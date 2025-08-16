import { Question } from "../types";
import { getGeminiKey, getGeminiModel, getOpenAIKey, getOpenAIModel } from "./ai";

const API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_MODEL = getGeminiModel();

const getApiKey = (): string | null => {
  // Primeiro pelo env, depois localStorage (exposto por getGeminiKey)
  return getGeminiKey();
};

export const composeLuzaumPrompt = (q: Question): string => {
  const options = q.options?.map(o => `${o.label}) ${o.text}`).join(" | ") || "";
  return [
    `🩺 Olá! Eu sou o **Dr. Luzaum**, médico-veterinário com PhD em múltiplas especialidades veterinárias! 😊`,
    ``,
    `Vou fazer uma revisão COMPLETA desta questão para você, explicando cada conceito de forma didática e facilitando seu aprendizado! 🎓✨`,
    ``,
    `⚠️ **IMPORTANTE**: Presumo que você já conhece o enunciado da questão, então vou direto à revisão conceitual aprofundada!`,
    ``,
    `🔬 **Minha abordagem de ensino:**`,
    `- Explicações parte por parte de cada conceito 📚`,
    `- Correlações fisiológicas e fisiopatológicas 🧬`,
    `- Fundamentação com literatura de referência 📖`,
    `- Dicas práticas para memorização 💡`,
    `- Conexões entre conceitos para facilitar o aprendizado 🔗`,
    ``,
    `📋 **Estrutura da minha revisão (com emojis para facilitar):**`,
    `## 🦠 **Etiologia** - As causas por trás do problema`,
    `## 📊 **Epidemiologia** - Dados populacionais e fatores de risco`,  
    `## 🫀 **Fisiologia Normal** - Como funciona normalmente`,
    `## ⚠️ **Fisiopatologia** - O que acontece quando há problema`,
    `## 🔬 **Patologia** - Alterações morfológicas e funcionais`,
    `## 🩺 **Sinais Clínicos** - O que observamos no paciente`,
    `## 🧪 **Exames Complementares** - Ferramentas diagnósticas`,
    `## ✅ **Diagnóstico** - Como chegamos à conclusão (com sensibilidade/especificidade quando relevante)`,
    `## 💊 **Tratamento** - Protocolos padrão e alternativas`,
    `## 🤔 **Diagnósticos Diferenciais** - O que mais pode ser`,
    `## 🎯 **Análise das Alternativas** - Por que cada opção está certa ou errada`,
    `## 💡 **Dicas High-Yield** - Pontos de ouro para não esquecer`,
    `## 📚 **Correlações Importantes** - Conectando conceitos`,
    ``,
    `📖 **Minhas referências base:** NELSON & COUTO, PLUMB'S, BSAVA, DiBARTOLA, CUNNINGHAM + consensos atuais`,
    ``,
    `🎓 Vamos começar nossa revisão educativa! Prepare-se para aprender de verdade! 🚀`,
    ``,
    `**Questão analisada:** ${q.stem}`,
    options ? `**Alternativas:** ${options}` : "",
    q.answer_key ? `**Gabarito:** ${q.answer_key}` : "",
  ].filter(Boolean).join("\n\n");
};

export async function generateLuzaumReview(q: Question, init?: RequestInit): Promise<string> {
  const apiKey = getApiKey();
  const prompt = composeLuzaumPrompt(q);
  // Se não houver Gemini, faça fallback para OpenAI se existir
  if (!apiKey) {
    // Fallback simples para OpenAI (sem streaming)
    const openaiKey = getOpenAIKey();
    const openaiModel = getOpenAIModel();
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
    const openaiKey = getOpenAIKey();
    const openaiModel = getOpenAIModel();
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

