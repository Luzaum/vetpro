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
  if (!apiKey) {
    throw new Error("Faltando VITE_GEMINI_API_KEY. Crie um arquivo .env.local com a variável e reinicie o dev server.");
  }
  const model = DEFAULT_MODEL;
  const url = `${API_BASE}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const prompt = composeLuzaumPrompt(q);
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
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    ...(init || {})
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini erro ${res.status}: ${text}`);
  }
  const data = await res.json();
  const draft = data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).join("\n\n");
  if (!draft) throw new Error("Resposta vazia do Gemini");
  return draft as string;
}

