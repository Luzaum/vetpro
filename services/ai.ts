export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

const V = (import.meta as any).env || {};

function safeLocalStorageGet(key: string): string | null {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeLocalStorageSet(key: string, value: string) {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, value);
  } catch {}
}

export const getGeminiKey = (): string | null => V.VITE_GEMINI_API_KEY || safeLocalStorageGet('GEMINI_API_KEY') || null;
export const getGeminiModel = (): string => V.VITE_GEMINI_MODEL || 'gemini-1.5-pro';

export const getOpenAIKey = (): string | null => V.VITE_OPENAI_API_KEY || safeLocalStorageGet('OPENAI_API_KEY') || null;
export const getOpenAIModel = (): string => V.VITE_OPENAI_MODEL || 'gpt-4o-mini';

export function setOpenAIKey(key: string) { safeLocalStorageSet('OPENAI_API_KEY', key); }
export function setGeminiKey(key: string) { safeLocalStorageSet('GEMINI_API_KEY', key); }

export function hasGemini(): boolean { return !!getGeminiKey(); }
export function hasOpenAI(): boolean { return !!getOpenAIKey(); }

// --- OpenAI streaming ---
export async function streamOpenAI(
  messages: ChatMessage[],
  onDelta: (text: string) => void,
  signal?: AbortSignal
) {
  const apiKey = getOpenAIKey();
  if (!apiKey) throw new Error('OPENAI API key ausente');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({ model: getOpenAIModel(), messages, temperature: 0.4, stream: true }),
    signal
  });
  if (!res.ok || !res.body) throw new Error(`OpenAI erro ${res.status}`);
  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() || '';
    for (const chunk of parts) {
      const line = chunk.trim();
      if (!line.startsWith('data:')) continue;
      const payload = line.replace(/^data:\s*/, '');
      if (payload === '[DONE]') return;
      try {
        const json = JSON.parse(payload);
        const token = json?.choices?.[0]?.delta?.content || '';
        if (token) onDelta(token);
      } catch {}
    }
  }
}

// --- Gemini streaming ---
export async function streamGemini(
  messages: ChatMessage[],
  onDelta: (text: string) => void,
  signal?: AbortSignal
) {
  const apiKey = getGeminiKey();
  if (!apiKey) throw new Error('GEMINI API key ausente');
  const model = getGeminiModel();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`;
  const contents = messages.map(m => ({ role: m.role, parts: [{ text: m.content }] }));
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents, generationConfig: { temperature: 0.4, topP: 0.95, topK: 40, maxOutputTokens: 2048 } }),
    signal
  });
  if (!res.ok || !res.body) throw new Error(`Gemini erro ${res.status}`);
  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() || '';
    for (const chunk of parts) {
      const line = chunk.trim();
      if (!line.startsWith('data:')) continue;
      const payload = line.replace(/^data:\s*/, '');
      if (payload === '[DONE]') return;
      try {
        const json = JSON.parse(payload);
        const texts = json?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).filter(Boolean) || [];
        if (texts.length) onDelta(texts.join(''));
      } catch {}
    }
  }
}

export async function streamChat(
  messages: ChatMessage[],
  onDelta: (text: string) => void,
  signal?: AbortSignal
) {
  if (hasGemini()) {
    try {
      return await streamGemini(messages, onDelta, signal);
    } catch (e) {
      // Quota/acabou créditos ou outro erro → fallback para OpenAI se disponível
      if (hasOpenAI()) {
        return await streamOpenAI(messages, onDelta, signal);
      }
      throw e;
    }
  }
  if (hasOpenAI()) return streamOpenAI(messages, onDelta, signal);
  throw new Error('Nenhum provedor configurado. Defina VITE_GEMINI_API_KEY ou VITE_OPENAI_API_KEY.');
}


