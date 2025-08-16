import { Question } from '../types'

const join = (arr?: string[] | null) => (arr && arr.length ? arr.join('\n- ') : '')

export function composeOfflineReview(q: Question): string {
  const lines: string[] = []
  lines.push(`## Visão Geral`)
  lines.push(`Prova: **${q.exam}-${q.year}**  |  Área: **${q.area_tags.join(', ')}**`)
  if (q.topic_tags?.length) lines.push(`Tópicos: ${q.topic_tags.join(', ')}`)
  lines.push('')
  lines.push(`### Enunciado`)
  lines.push(q.stem)
  lines.push('')

  // Diagnóstico a partir do objeto review, quando disponível
  if (q.review && Object.keys(q.review).length > 0) {
    if (q.review.fisiologia) {
      lines.push(`### Fisiologia/Patogenia`)
      lines.push(q.review.fisiologia)
      lines.push('')
    }
    if (q.review.diagnostico?.principais?.length) {
      lines.push('### Diagnóstico (Pontos-chave)')
      lines.push(`- ${join(q.review.diagnostico.principais)}`)
      lines.push('')
    }
    if (q.review.terapia?.caes?.length || q.review.terapia?.gatos?.length) {
      lines.push('### Tratamento (Baseado em evidências)')
      if (q.review.terapia?.caes?.length) lines.push(`Cães:\n- ${join(q.review.terapia.caes)}`)
      if (q.review.terapia?.gatos?.length) lines.push(`\nGatos:\n- ${join(q.review.terapia.gatos)}`)
      lines.push('')
    }
    if (q.review.high_yield?.length) {
      lines.push('### Pontos de Alto Rendimento')
      lines.push(`- ${join(q.review.high_yield)}`)
      lines.push('')
    }
    if (q.review.pegadinhas?.length) {
      lines.push('### Pegadinhas de Prova')
      lines.push(`- ${join(q.review.pegadinhas)}`)
      lines.push('')
    }
  }

  // Análise das alternativas com base nos racionales
  if (q.rationales && Object.keys(q.rationales).length > 0) {
    lines.push('### Análise das Alternativas')
    const labels = q.options.map(o => o.label)
    for (const label of labels) {
      const head = label === q.answer_key ? `**${label}) (Correta)**` : `${label})`
      const tx = q.rationales[label] || ''
      lines.push(`- ${head} ${tx}`)
    }
    lines.push('')
  }

  lines.push('> Revisão gerada no modo offline a partir dos metadados da questão. Para uma revisão expandida, ative a IA (Gemini ou OpenAI) em .env.local.')
  return lines.join('\n')
}


