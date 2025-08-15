import { Question } from "../types";

const API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_MODEL = (import.meta as any).env?.VITE_GEMINI_MODEL || "gemini-1.5-pro";

const getApiKey = (): string | null => {
  // Leia a chave do ambiente de build (Vite)
  const key = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  return key || null;
};

export const composeLuzaumPrompt = (q: Question): string => {
  const options = q.options?.map(o => `${o.label}) ${o.text}`).join(" | ") || "";
  return [
    `Você é o Dr. Luzaum, médico-veterinário com pós-doutorado em clínica médica, clínica cirúrgica, anestesiologia, imaginologia, saúde pública e patologia clínica.`,
    `Explique o tema da questão abaixo de forma completa e robusta, sempre didática e com revisões de consensos atuais.`,
    `Faça verificação de consistência em 3 passes ANTES de responder (sem expor o raciocínio intermediário). Garanta exatidão.`,
    `Formatação: use títulos curtos (##), listas, **negrito** para conceitos chave, e fluxogramas textuais com '->'.`,
    `Inclua: epidemiologia, etiologia/patogenia, sinais clínicos, diferenciais, diagnóstico (com faixas de sensibilidade/especificidade quando apropriado), tratamento (padrão e alternativas com ressalvas), noções de saúde pública/legislação quando aplicável, análise das alternativas (correta e incorretas) e dicas/curiosidades ao final.`,
    `Questão: ${q.stem}`,
    options ? `Opções: ${options}` : "",
    q.answer_key ? `Gabarito oficial: ${q.answer_key}` : "",
  ].filter(Boolean).join("\n\n");
};

export async function generateLuzaumReview(q: Question, init?: RequestInit): Promise<string> {
  const apiKey = getApiKey();
  const prompt = composeLuzaumPrompt(q);
  // Se não houver Gemini, faça fallback para OpenAI se existir
  if (!apiKey) {
    // Fallback simples para OpenAI (sem streaming) usando env do Vite
    const V: any = (import.meta as any).env || {};
    const openaiKey = V.VITE_OPENAI_API_KEY;
    const openaiModel = V.VITE_OPENAI_MODEL || 'gpt-4o-mini';
    if (!openaiKey) {
      throw new Error('Faltando VITE_GEMINI_API_KEY e VITE_OPENAI_API_KEY. Configure uma das chaves em .env.local');
    }
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiKey}` },
      body: JSON.stringify({ model: openaiModel, messages: [{ role: 'user', content: prompt }], temperature: 0.4 }),
      ...(init || {})
    });
    if (!res.ok) throw new Error(`OpenAI erro ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || '';
    if (!text) throw new Error('Resposta vazia do OpenAI');
    return text as string;
  }
  const model = DEFAULT_MODEL;
  const url = `${API_BASE}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const body = {
    contents: [
      { role: "user", parts: [{ text: prompt }] }
    ],
    generationConfig: {
      temperature: 0.4,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 4096
    }
  };
  let res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    ...(init || {})
  });
  if (!res.ok) {
    // Fallback: se Gemini falhar (ex.: créditos), tenta OpenAI
    const text = await res.text();
    const V: any = (import.meta as any).env || {};
    const openaiKey = V.VITE_OPENAI_API_KEY;
    const openaiModel = V.VITE_OPENAI_MODEL || 'gpt-4o-mini';
    if (openaiKey) {
      const oa = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiKey}` },
        body: JSON.stringify({ model: openaiModel, messages: [{ role: 'user', content: prompt }], temperature: 0.4 }),
        ...(init || {})
      });
      if (!oa.ok) throw new Error(`Gemini erro ${res.status}: ${text} | OpenAI erro ${oa.status}: ${await oa.text()}`);
      const data = await oa.json();
      const out = data?.choices?.[0]?.message?.content || '';
      if (!out) throw new Error('Resposta vazia do OpenAI');
      return out as string;
    }
    throw new Error(`Gemini erro ${res.status}: ${text}`);
  }
  const data = await res.json();
  const draft = data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).join("\n\n");
  if (!draft) throw new Error("Resposta vazia do Gemini");
  return draft as string;
}

