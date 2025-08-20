import { Question } from "../types";
import { getGeminiKey, getGeminiModel, getOpenAIKey, getOpenAIModel } from "./ai";

const API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_MODEL = getGeminiModel();

const getGeminiApiKey = (): string | null => getGeminiKey();

export const composeLuzaumPrompt = (q: Question): string => {
  const topics = q.topic_tags?.join(", ") || q.area_tags?.join(", ") || "tema abordado";
  return [
    `NÃO RELEIA ou RESUMA o enunciado. Não mencione que está analisando a questão. Foque somente na revisão educativa do tema, sem citar o enunciado.`,
    `🩺 Olá! Eu sou o **Dr. Luzaum**, médico-veterinário com PhD em múltiplas especialidades veterinárias! 😊`,
    ``,
    `Vou fazer uma revisão educativa COMPLETA sobre **${topics}** para você, explicando cada conceito de forma didática! 🎓✨`,
    ``,
    `🔬 **Minha abordagem de ensino:**`,
    `- Explicações parte por parte de cada conceito 📚`,
    `- Correlações fisiológicas e fisiopatológicas 🧬`,
    `- Fundamentação com literatura de referência 📖`,
    `- Dicas práticas para memorização 💡`,
    `- Conexões entre conceitos para facilitar o aprendizado 🔗`,
    ``,
    `📋 **Estrutura da minha revisão educativa:**`,
    ``,
    `## 🦠 **Etiologia**`,
    `As causas e fatores que levam ao desenvolvimento da condição`,
    ``,
    `## 📊 **Epidemiologia**`, 
    `Dados populacionais, predisposições raciais, de idade e fatores de risco`,
    ``,
    `## 🫀 **Fisiologia Normal**`,
    `Como o sistema funciona em condições normais`,
    ``,
    `## ⚠️ **Fisiopatologia**`,
    `Mecanismos pelos quais a doença se desenvolve e progride`,
    ``,
    `## 🔬 **Patologia**`,
    `Alterações macro e microscópicas características`,
    ``,
    `## 🩺 **Sinais Clínicos**`,
    `Manifestações que observamos nos pacientes`,
    ``,
    `## 🧪 **Exames Complementares**`,
    `Ferramentas diagnósticas e achados esperados`,
    ``,
    `## ✅ **Diagnóstico**`,
    `Como estabelecer o diagnóstico (incluindo sensibilidade/especificidade quando aplicável)`,
    ``,
    `## 💊 **Tratamento**`,
    `Protocolos terapêuticos padrão e alternativas`,
    ``,
    `## 🤔 **Diagnósticos Diferenciais**`,
    `Outras condições que podem confundir o diagnóstico`,
    ``,
    `## 🎯 **Pontos High-Yield**`,
    `Dicas importantes para não esquecer na prova`,
    ``,
    `## 📚 **Correlações Clínicas**`,
    `Conexões importantes para facilitar o aprendizado`,
    ``,
    `📖 **Referências:** NELSON & COUTO, PLUMB'S, BSAVA, DiBARTOLA, CUNNINGHAM + consensos atuais`,
    ``,
    `🎓 Vamos começar nossa revisão educativa sobre **${topics}**! 🚀`,
  ].filter(Boolean).join("\n\n");
};

// --- Prompts especializados solicitados pelo usuário ---
export function composeDrLuzaumSystemPrompt(): string {
  return [
    `Você é o Dr. Luzaum, um médico-veterinário experiente e professor.`,
    ``,
    `IMPORTANTE: Seja EXTREMAMENTE DIRETO e OBJETIVO.`,
    `- Máximo 3-4 parágrafos curtos`,
    `- Sem seções complexas ou listas longas`,
    `- Sem explicações genéricas ou teóricas`,
    `- Foque APENAS na questão específica`,
    `- Use linguagem simples e acessível`,
    `- Inclua 2-3 emojis no máximo`,
    ``,
    `Sua resposta deve ter:`,
    `1. Tema da questão (1 frase)`,
    `2. Por que a resposta correta está certa (1-2 frases)`,
    `3. Por que as alternativas erradas estão erradas (1-2 frases)`,
    `4. Dica prática para lembrar (1 frase)`,
  ].join("\n");
}

export function composeDrLuzaumActionPrompt(): string {
  return [
    `Analise a questão e responda de forma EXTREMAMENTE DIRETA:`,
    ``,
    `- Tema: Qual é o assunto da questão?`,
    `- Resposta certa: Por que está correta?`,
    `- Alternativas erradas: Por que estão erradas?`,
    `- Dica: Uma frase prática para lembrar`,
    ``,
    `MÁXIMO 4 parágrafos curtos. Seja DIRETO e OBJETIVO.`,
    `Sem explicações longas ou teóricas.`,
  ].join("\n");
}

export function buildQuestionPayload(q: Question, userAnswer?: string | null) {
  const normalize = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
  const isGeneric = (t: string) => {
    const k = normalize(t);
    return (
      /logia$/.test(k) ||
      [
        'gastroenterologia','neurologia','cardiologia','dermatologia','endocrinologia',
        'hemostasia','hematologia','sus','saude publica','diagnostico por imagem',
        'laboratorio clinico','anestesiologia','ortopedia'
      ].includes(k)
    );
  };
  const mostSpecificTopic = (() => {
    const tags = q.topic_tags || [];
    const specific = tags.filter(t => !isGeneric(t));
    if (specific.length > 0) return specific[0];
    if (tags.length > 0) return [...tags].sort((a,b)=>b.length-a.length)[0];
    return q.area_tags?.[0] || 'tema';
  })();
  const mapArea = (a: string): string => {
    const k = a.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    if (k.includes('saude publica')) return 'saude_publica';
    if (k.includes('clinica medica')) return 'clinica_medica';
    if (k.includes('clinica cirurgica')) return 'clinica_cirurgica';
    if (k.includes('anestesiologia')) return 'anestesiologia';
    if (k.includes('diagnostico por imagem')) return 'diagnostico_por_imagem';
    if (k.includes('laboratorio clinico')) return 'laboratorio_clinico';
    return 'clinica_medica';
  };
  return {
    area_conhecimento: mapArea(q.area_tags[0] || ''),
    questao_id: q.id,
    enunciado: q.stem,
    alternativas: q.options.map(o => ({ letra: o.label, texto: o.text })),
    alternativa_marcada_pelo_usuario: (userAnswer || '').toUpperCase() || undefined,
    alternativa_correta: q.answer_key,
    especie_alvo: 'ambos',
    contexto_extra: '',
    ids_biblioteca_usuario: [] as string[],
    meta: {
      area_tags: q.area_tags,
      topic_tags: q.topic_tags,
      fonte: `${q.exam}-${q.year}`,
      dificuldade: q.difficulty,
      most_specific_topic: mostSpecificTopic
    }
  } as any;
}

export async function generateLuzaumReview(q: Question, init?: RequestInit): Promise<string> {
  const openaiKey = getOpenAIKey();
  const geminiKey = getGeminiApiKey();

  // Constrói payload e prompts completos
  const payload = buildQuestionPayload(q);
  const system = composeDrLuzaumSystemPrompt();
  const action = composeDrLuzaumActionPrompt();
  const combinedForGemini = [system, '', action, '', 'Dados da questão (JSON):', JSON.stringify(payload)].join('\n\n');

  // Preferir OpenAI quando disponível
  if (openaiKey) {
    const openaiModel = getOpenAIModel();
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiKey}` },
      body: JSON.stringify({
        model: openaiModel,
        temperature: 0.3,
        max_tokens: 800,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: action },
          { role: 'user', content: 'Dados da questão (JSON):' },
          { role: 'user', content: JSON.stringify(payload) }
        ]
      }),
      ...(init || {})
    });
    if (!res.ok) throw new Error(`OpenAI erro ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || '';
    if (!text) throw new Error('Resposta vazia do OpenAI');
    return text as string;
  }

  if (!geminiKey) {
    throw new Error('Nenhum provedor configurado. Defina VITE_OPENAI_API_KEY ou VITE_GEMINI_API_KEY.');
  }

  const model = DEFAULT_MODEL;
  const url = `${API_BASE}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(geminiKey)}`;
  const body = {
    contents: [
      { role: "user", parts: [{ text: combinedForGemini }] }
    ],
    generationConfig: { temperature: 0.3, topP: 0.95, topK: 40, maxOutputTokens: 800 }
  };
  let res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), ...(init || {}) });
  if (!res.ok) throw new Error(`Gemini erro ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const draft = data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).join('\n\n');
  if (!draft) throw new Error('Resposta vazia do Gemini');
  return draft as string;
}

