
import { upsertQuestionsInChunks, validateAndNormalizeQuestion } from '../data/db';
import { Question } from '../types';

// Mapeamento simples de palavras-chave para classificação de áreas
const AREA_KEYWORDS: Record<string, string[]> = {
  'CLÍNICA MÉDICA': ['clínica médica', 'clínica medica', 'hepatite', 'cardiologia', 'nefropatia', 'dermatite', 'endocrin', 'doenças infecciosas'],
  'CLÍNICA CIRÚRGICA': ['cirurgia', 'ortopedia', 'osteossíntese', 'colocação de placas', 'anastomose', 'laparotomia'],
  'ANESTESIOLOGIA': ['anestesia', 'anestésico', 'opioide', 'isoflurano', 'propofol', 'bloqueio epidural'],
  'DIAGNÓSTICO POR IMAGEM': ['radiografia', 'ultrassonografia', 'tomografia', 'ressonância', 'diagnóstico por imagem', 'tfast', 'eFAST'],
  'LABORATÓRIO CLÍNICO': ['hemograma', 'bioquímica', 'bioquimica', 'coagulograma', 'urinálise', 'urinalise', 'parasito', 'copro'],
  'SAÚDE PÚBLICA': ['zoonose', 'saúde pública', 'saude publica', 'vigilância', 'vigilancia', 'epidemiologia']
};

function classifyAreaFromText(text: string): string[] {
  const lower = text.toLowerCase();
  const areas: string[] = [];
  for (const [area, keywords] of Object.entries(AREA_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) areas.push(area);
  }
  return areas.length > 0 ? areas : ['CLÍNICA MÉDICA'];
}

export interface RawQuestionTextBlock {
  stem: string;
  options: { label: string; text: string }[];
  answer_key: string;
  year?: number;
  exam?: string;
  topic_tags?: string[];
  area_guess?: string[]; // opcional: IA pode sugerir áreas
}

export async function ingestFromTextBlocks(blocks: RawQuestionTextBlock[], batchLabel: string = 'AI') {
  // 1) Converter blocos em objetos Question parciais e classificar área
  const rawItems = blocks.map((b, idx) => ({
    id: `${batchLabel}-${Date.now()}-${idx + 1}`,
    year: b.year ?? 0,
    exam: b.exam ?? '—',
    source_file: null,
    source_pages: { start: null, end: null },
    area_tags: Array.isArray(b.area_guess) && b.area_guess.length > 0 ? b.area_guess : classifyAreaFromText([b.stem, ...b.options.map(o => o.text)].join(' \n ')),
    topic_tags: Array.isArray(b.topic_tags) ? b.topic_tags : [],
    classification_meta: { area_confidence: {}, topic_confidence: {}, evidence_spans: [], ambiguities: [] },
    difficulty: 'M',
    cognitive_level: 'Entender',
    stem: b.stem,
    media: [],
    options: b.options,
    answer_type: 'single',
    answer_key: b.answer_key,
    rationales: {},
    review: {},
    provenance: { extracted_at: new Date().toISOString(), checksum: `sha256:${batchLabel}` },
    status: 'pending',
    version: 1,
    issues: []
  }));

  // 2) Validar/normalizar individualmente
  const normalized: Question[] = [];
  const rejected: { index: number; reason: string }[] = [];
  rawItems.forEach((item, i) => {
    const q = validateAndNormalizeQuestion(item);
    if (q) normalized.push(q); else rejected.push({ index: i, reason: 'invalid-or-incomplete' });
  });

  // 3) Persistir no IndexedDB com upsert tolerante a falhas
  const summary = await upsertQuestionsInChunks(normalized, 50);

  return { summary, rejected };
}

// Utilitário para dividir em levas de até 40 questões
export function chunkIntoBatches<T>(items: T[], size = 40): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}
