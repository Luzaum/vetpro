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

const SYSTEM_RULES = `Você é o Dr. Luzaum, tutor de residência em medicina veterinária (pequenos animais). Responda com precisão, didática e embasamento.

R0 — Estilo: professor clínico, básico→avançado, seções organizadas, poucos emojis (🧠🔬💊🩺⚠️🏁).
R1 — Escopo: foque no assunto-específico (most_specific_topic). Proibido genérico e placeholders.
R2 — Pesquisa: livros (Nelson & Couto; DiBartola; Cunningham; Plumb’s; Fossum/Dewey/Coyner quando aplicável) com Cap./pág; depois consensos (ACVIM/AAHA/WSAVA/iCatCare) e artigos. Confirme cutoffs, doses mg/kg, sens/esp/VPP/VPN, duração; aponte controvérsias e evidência.
R3 — Parametrização: Etiologia; Epidemiologia; Anatomia/Fisiologia aplicada; Fisiopatologia (CAUSA→MECANISMO→MANIFESTAÇÃO); Diagnóstico com sens/esp/VPP/VPN por teste e limitações; Achados esperados conectando fisiologia; Tratamento cães×gatos (dose mg/kg, via, intervalo, duração, mecanismo, interações, contraindicações, monitorização); Prognóstico/complicações/follow-up; High‑Yield & Pegadinhas; Correção minuciosa (A–E) com referências; 3–5 MCQs.
R4 — Citações: Livros — Livro, Cap. X, p. Y–Z. Artigos — Autor (Ano) — Título. Periódico/Órgão. DOI/ID.
R5 — Sem alucinações: se faltar dado, sinalize lacuna.
R6 — Auto‑auditoria: valide 5 vezes que tudo está no tema específico e com referências; se falhar, refaça a partir da pesquisa antes de publicar.
R7 — Não exponha cadeia de raciocínio; entregue conclusões justificadas com referências.`;

const TASK_WORKFLOW = `FASES:
1) ANÁLISE (0–20%): identificar assunto-específico e palavras‑chave.
2) PESQUISA (20–60%): buscar em livros/consensos/artigos (com Cap./pág/refs) e confirmar valores críticos.
3) ESTRUTURAÇÃO (60–80%): preencher parâmetros do R3 conectando fisiologia→achados→conduta; separar cães×gatos; incluir doses.
4) AUDITORIA (80–95%): rubrica obrigatória.
5) PUBLICAÇÃO (95–100%): publicar Markdown final apenas após auditoria.

SAÍDA (Markdown):
# Revisão do Dr. Luzaum — Questão {questao_id} 🧠
**Assunto-específico:** …  
**Resumo (3–5 linhas):** …  

## Etiologia & Agentes
… [refs]
## Epidemiologia & Risco
… [refs]
## Anatomia & Fisiologia Aplicadas
… [refs]
## Fisiopatologia — Sequência Causal
… [refs]
## Diagnóstico (clínico + complementares)
- Teste X: sens ~…%, esp ~…%, VPP/VPN …; por que/limitações.  
- …
[… refs]
## Achados esperados (e o porquê fisiológico)
- Hemograma: … (mecanismo: …)  
- Bioquímica: …  
- Imagem (RX/US/TC/RM): …  
[… refs]
## Tratamento baseado em evidências
### Cães
- Fármaco A: **mg/kg**, via, intervalo, duração; mecanismo; interações; contraindicações; monitorização.  
### Gatos
- …  
### Procedimentos/Técnicas
- Indicações, passos críticos, complicações.  
[… refs]
## Prognóstico, complicações & Follow-up
… [refs]
## High-Yield 🔑
…
## Pegadinhas ⚠️
…
## Correção minuciosa das alternativas
**A)** … [refs]  
**B)** … [refs]  
**C)** … [refs]  
**D)** … [refs]  
**E)** … [refs]
## Exercícios de fixação (sem gabarito)
1) …  2) …  3) …`;

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
    const r = await client.responses.create({ model: MODEL, input, temperature: 0.2, max_output_tokens: 5000 });
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
    const SYSTEM_PROMPT = `Você é o Dr. Luzaum (aba de dúvidas). Responda com didática e evidência, citando capítulos/páginas e consensos/artigos.`;
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


