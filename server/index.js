/* Simple Node server for Dr. Luzaum APIs (Express, ESM) */
// Do NOT expose API keys in the browser. Keep them here.

import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: false }));
app.use(express.json({ limit: '2mb' }));

const PORT = process.env.PORT || 8787;
const MODEL = process.env.DR_LUZAUM_QA_MODEL || 'gpt-4o-mini';

const SYSTEM_RULES = `Você é o Dr. Luzaum, um médico-veterinário experiente e professor.

IMPORTANTE: Seja EXTREMAMENTE DIRETO e OBJETIVO.
- Máximo 3-4 parágrafos curtos
- Sem seções complexas ou listas longas
- Sem explicações genéricas ou teóricas
- Foque APENAS na questão específica
- Use linguagem simples e acessível
- Inclua 2-3 emojis no máximo

Sua resposta deve ter:
1. Tema da questão (1 frase)
2. Por que a resposta correta está certa (1-2 frases)
3. Por que as alternativas erradas estão erradas (1-2 frases)
4. Dica prática para lembrar (1 frase)`;

const TASK_WORKFLOW = `Analise a questão e responda de forma EXTREMAMENTE DIRETA:

- Tema: Qual é o assunto da questão?
- Resposta certa: Por que está correta?
- Alternativas erradas: Por que estão erradas?
- Dica: Uma frase prática para lembrar

MÁXIMO 4 parágrafos curtos. Seja DIRETO e OBJETIVO.
Sem explicações longas ou teóricas.`;

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
  if (!apiKey) throw new Error('OPENAI_API_KEY ausente.');
  return new OpenAI({ apiKey, baseURL });
}

// Healthcheck
app.get('/api/openai/health', async (req, res) => {
  try {
    const client = getOpenAIClient();
    const r = await client.responses.create({ model: MODEL, input: [{ role: 'user', content: 'pong' }], max_output_tokens: 5, temperature: 0 });
    res.json({ ok: true, model: MODEL, sample: (r && (r.output_text || 'ok')).slice(0, 20) });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message || String(e) });
  }
});

// Revisão com workflow e progresso
app.post('/api/dr-luzaum/revisao', async (req, res) => {
  try {
    const client = getOpenAIClient();
    const body = req.body || {};
    const input = [
      { role: 'system', content: SYSTEM_RULES },
      { role: 'user', content: TASK_WORKFLOW },
      { role: 'user', content: 'Entrada JSON a seguir:' },
      { role: 'user', content: JSON.stringify(body) }
    ];
    const r = await client.responses.create({ model: MODEL, input, temperature: 0.2, max_output_tokens: 800 });
    const markdown = r.output_text || r.text || '';
    res.json({
      progressMarks: [
        { step: 'analise', pct: 20 },
        { step: 'pesquisa', pct: 60 },
        { step: 'estrutura', pct: 80 },
        { step: 'auditoria', pct: 95 },
        { step: 'publicacao', pct: 100 }
      ],
      markdown
    });
  } catch (e) {
    res.status(500).json({ error: e.message || String(e) });
  }
});

// QA livre (tire suas dúvidas)
app.post('/api/dr-luzaum/qa', async (req, res) => {
  try {
    const client = getOpenAIClient();
    const SYSTEM_PROMPT = `Você é o Dr. Luzaum, um médico-veterinário experiente e professor dedicado a ajudar estudantes de medicina veterinária. Responda com linguagem clara, didática e acessível. Seja objetivo e direto ao ponto.`;
    const TASK_PROMPT = `Use o formato do sistema “Tire suas dúvidas” e inclua doses, sens/esp/VPP/VPN, diferenciações cães×gatos quando aplicável.`;
    const input = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: TASK_PROMPT },
      { role: 'user', content: 'Entrada JSON a seguir:' },
      { role: 'user', content: JSON.stringify(req.body || {}) }
    ];
    const r = await client.responses.create({ model: MODEL, input, temperature: 0.2, max_output_tokens: 4000 });
    const markdown = r.output_text || r.text || '';
    res.json({ markdown });
  } catch (e) {
    res.status(500).json({ error: e.message || String(e) });
  }
});

app.listen(PORT, () => {
  console.log(`[dr-luzaum-server] listening on http://localhost:${PORT}`);
});


