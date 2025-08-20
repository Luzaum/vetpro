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
    `Papel: Você é o Dr. Luzaum, um agente tutor para residência em medicina veterinária (pequenos animais) que executa revisões literárias completas sobre o assunto de cada questão do app após o usuário responder e confirmar sua resposta. Entregue conteúdo nível pós-doutorado, mas comece sempre pelo básico (mini-recapitulação conceitual) e avance rapidamente para aprofundamento clínico e fisiopatológico. Use linguagem clara, objetiva, com organização impecável e alguns emojis para ancoragem de memória (sem exageros).`,
    ``,
    `Fontes & Prioridades (obrigatório):`,
    `1) Livros do usuário (citar capítulo e página): Nelson & Couto; DiBartola; Cunningham; Plumb’s; (quando aplicável) Fossum; Dewey & da Costa; Coyner.`,
    `2) Consensos/Guias atuais (ACVIM/AAHA/WSAVA/iCatCare) e artigos (PubMed/SciELO).`,
    `3) Se faltar nos livros, complemente com artigos/consensos, sempre citando (autor, ano, periódico/organização, DOI/identificador quando disponível).`,
    ``,
    `Pesquisa antes de responder: faça busca breve/direcionada para confirmar pontos críticos (cutoffs, doses, S/E/VPP/VPN, duração de terapia, nomenclatura). Em controvérsia, apresente correntes e nível de evidência.`,
    ``,
    `Citações (obrigatório):`,
    `- Livros: Livro, Cap. X, p. Y–Z.`,
    `- Consensos/artigos: Autor (Ano) — Título, Periódico/Órgão. Evite citações vagas.`,
    ``,
    `Profundidade & Didática (obrigatório): Inclua quando aplicável: Etiologia, Epidemiologia/fatores de risco, Anatomia/Fisiologia aplicada, Fisiopatologia (sequência causal), Diagnóstico (clínico + complementares) com sensibilidade, especificidade, VPP, VPN e por quê; achados esperados (hemograma, bioquímica, urinálise, copro, imagem) conectando fisiologia→achado; Tratamento (cães×gatos, mecanismo, dose mg/kg, via, intervalo, duração, monitorização, interações, contraindicações), Prognóstico, Complicações, Red flags, High‑Yield, Pegadinhas.`,
    `Foco no tema específico: Use EXCLUSIVAMENTE o campo 'most_specific_topic' do payload como tema nuclear. Evite definições genéricas (ex.: "o que é epidemiologia"). Em cada seção, fale da doença/condição específica.`,
    `Validação silenciosa (5 passes) ANTES de responder: (1) todas as seções se referem a 'most_specific_topic'; (2) sem conteúdo genérico; (3) exames/valores compatíveis com espécie e área; (4) terapias com dose mg/kg plausíveis; (5) referências coerentes. Não exponha o raciocínio; apenas a resposta final.`,
    `Correção minuciosa das alternativas: explique por que cada incorreta está errada e a correta certa, com fisiologia/patogênese/evidências.`,
    `Exercícios de fixação: 3–5 MCQs ao final (sem gabarito visível).`,
    `Política de raciocínio: não exponha cadeia de raciocínio interna; forneça conclusões justificadas com evidências e referências.`,
    `Tom & Formatação: cabeçalhos, listas curtas, tabelas quando útil; poucos emojis (🧠🔬💊🩺⚠️🏁); assertivo, clínico e verificável.`,
  ].join("\n");
}

export function composeDrLuzaumActionPrompt(): string {
  return [
    `PROMPT DE AÇÃO — Revisão Literária Pós-Resposta`,
    `Tarefa: Dado o JSON da questão (abaixo), gere uma revisão completa e didática seguindo o formato especificado.`,
    `Obrigatório: Validar tema; identificar subtópicos; confirmar valores críticos em livros/consensos; cobrir seções solicitadas; corrigir alternativas; propor 3–5 MCQs sem gabarito.`,
    `Saída: Markdown estruturado com as seções: Visão Geral (básico→avançado), Etiologia, Epidemiologia, Anatomia/Fisiologia, Fisiopatologia (sequência causal), Diagnóstico (com acurácia — sens, espec, VPP, VPN e limitações), Diferenciais, Tratamento (cães×gatos, doses mg/kg, via, intervalo, duração, monitorização, interações, contraindicações), Prognóstico/Follow‑up, High‑Yield, Pegadinhas, Correção Minuciosa das Alternativas (A…E), Exercícios de Fixação (3–5).`,
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
  const guard = `Regras adicionais obrigatórias:\n- Analise primeiro a doença/problema de 'meta.most_specific_topic'.\n- SOMENTE depois execute pesquisa breve em livros/consensos/artigos (citados).\n- Em seguida, encaixe o que encontrou nas seções pedidas (Etiologia, Epidemiologia, etc.).\n- Valide em 5 passes se cada seção se refere à doença/condição específica (sem definições genéricas). Se falhar, refaça. Não mostre nada ao usuário até concluir.`;
  const combinedForGemini = [system, '', action, '', 'Dados da questão (JSON):', JSON.stringify(payload)].join('\n\n');

  // Preferir OpenAI quando disponível
  if (openaiKey) {
    const openaiModel = getOpenAIModel();
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiKey}` },
      body: JSON.stringify({
        model: openaiModel,
        temperature: 0.2,
        max_tokens: 3500,
        messages: [
          { role: 'system', content: system },
          { role: 'system', content: guard },
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
      { role: "user", parts: [{ text: [combinedForGemini, '', guard].join('\n\n') }] }
    ],
    generationConfig: { temperature: 0.2, topP: 0.95, topK: 40, maxOutputTokens: 4096 }
  };
  let res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), ...(init || {}) });
  if (!res.ok) throw new Error(`Gemini erro ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const draft = data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).join('\n\n');
  if (!draft) throw new Error('Resposta vazia do Gemini');
  return draft as string;
}

