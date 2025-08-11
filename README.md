# Residência Vet Pro

Ingestão de questões por levas (40) com IA e persistência segura.

## Como importar levas da IA (no código)

Exemplo de uso do serviço de ingestão:

```ts
import { ingestFromTextBlocks, chunkIntoBatches, RawQuestionTextBlock } from './services/ingest';

async function importarLoteIA(blocos: RawQuestionTextBlock[]) {
  const batches = chunkIntoBatches(blocos, 40);
  for (let i = 0; i < batches.length; i++) {
    const label = `AI-BATCH-${i + 1}`;
    const { summary, rejected } = await ingestFromTextBlocks(batches[i], label);
    console.log(label, summary, rejected);
  }
}
```

## Prompt sugerido para sua IA gerar lotes de 40

Cole este prompt como instrução da sua IA:

"""
Você é responsável por produzir lotes de 40 questões de provas de residência veterinária. Para cada questão, gere um objeto JSON com o schema abaixo. Não use texto livre fora do JSON. Retorne exatamente um array JSON com até 40 itens.

Schema de cada item:
- stem: enunciado (string)
- options: array de 5 objetos { label: 'A'|'B'|'C'|'D'|'E', text: string }
- answer_key: 'A'|'B'|'C'|'D'|'E'
- year (opcional): número
- exam (opcional): string
- topic_tags (opcional): string[]
- area_guess (opcional): subset de ["CLÍNICA MÉDICA","CLÍNICA CIRÚRGICA","ANESTESIOLOGIA","DIAGNÓSTICO POR IMAGEM","LABORATÓRIO CLÍNICO","SAÚDE PÚBLICA"]. Se não souber, omita que o app classifica.

Regras:
- Garanta que answer_key exista e corresponda a uma das labels das options.
- Mantenha as opções com rótulos únicos A..E.
- Não use imagens por enquanto (media omitido; o app adiciona depois).
- Produza no máximo 40 questões por resposta.

Exemplo de saída (2 itens):
[
  {
    "stem": "Em cães com doença renal crônica, qual achado é mais consistente?",
    "options": [
      {"label":"A","text":"Poliúria e polidipsia"},
      {"label":"B","text":"Hipercalemia persistente"},
      {"label":"C","text":"Hiperglicemia acentuada"},
      {"label":"D","text":"Aumento de eritropoetina"},
      {"label":"E","text":"Bradicardia sinusial"}
    ],
    "answer_key": "A",
    "year": 2022,
    "exam": "UFV",
    "topic_tags": ["NEFROLOGIA"]
  },
  {
    "stem": "Sobre analgesia multimodal em anestesiologia veterinária, assinale a correta:",
    "options": [
      {"label":"A","text":"Combinar AINE com opioide reduz analgesia"},
      {"label":"B","text":"Bloqueio epidural não é útil em cirurgias abdominais"},
      {"label":"C","text":"Aditivos como morfina podem prolongar analgesia epidural"},
      {"label":"D","text":"Dexmedetomidina não tem efeito analgésico"},
      {"label":"E","text":"Cetamina aumenta hiperalgesia"}
    ],
    "answer_key": "C",
    "exam": "UFMG",
    "topic_tags": ["ANESTESIOLOGIA","ANALGESIA"]
  }
]
"""
