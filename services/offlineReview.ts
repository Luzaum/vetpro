import { Question } from '../types'

const join = (arr?: string[] | null) => (arr && arr.length ? arr.join('\n- ') : '')

function normalize(input: string): string {
  return input
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

function isGenericTopic(topic: string): boolean {
  const t = normalize(topic)
  const genericSet = [
    'gastroenterologia',
    'neurologia',
    'cardiologia',
    'dermatologia',
    'endocrinologia',
    'hemostasia',
    'hematologia',
    'sus',
    'saude publica',
    'diagnostico por imagem',
    'laboratorio clinico',
    'anestesiologia'
  ]
  return genericSet.includes(t) || /logia$/.test(t)
}

function pickSpecificTopic(topicTags: string[] | undefined): string | null {
  if (!topicTags || topicTags.length === 0) return null
  const specific = topicTags.filter(t => !isGenericTopic(t))
  if (specific.length > 0) return specific[0]
  // fallback: pick the longest tag (usually more específico)
  return [...topicTags].sort((a, b) => b.length - a.length)[0]
}

function generateDidacticExplanation(topic: string, area: string): any {
  const explanations: any = {
    'TOXOPLASMOSE': {
      etiologia: `🧬 **Agente etiológico**: *Toxoplasma gondii* - protozoário intracelular obrigatório do filo Apicomplexa.

**Ciclo de vida completo**: Ocorre APENAS em felídeos (hospedeiros definitivos). Outros animais são hospedeiros intermediários.

**Formas parasitárias**:
- 🥚 **Oocistos** (ambiente) - forma de resistência
- 🌙 **Taquizoítos** (fase aguda) - multiplicação rápida  
- 💤 **Bradizoítos** (fase crônica) - cistos teciduais`,
      
      epidemiologia: `🌍 **Distribuição**: Cosmopolita - uma das zoonoses mais prevalentes mundialmente.

**Prevalência**: 25-30% da população humana mundial infectada.

**Fatores de risco**:
- 🥩 Consumo de carne crua/malcozida
- 🧽 Manipulação de solo contaminado
- 🐱 Contato com fezes de gatos
- 🤰 Gestantes (risco de transmissão vertical)`,
      
      fisiopatologia: `🔄 **Mecanismo de transmissão**:

**Via indireta** (mais comum):
1. Felino elimina oocistos nas fezes
2. Esporulação no ambiente (1-5 dias) 
3. Ingestão por hospedeiro intermediário
4. Invasão intestinal → disseminação sistêmica

**Via direta**:
- Transmissão transplacentária (congênita)
- Transfusão sanguínea
- Transplante de órgãos

**Patogênese**: Taquizoítos invadem células nucleadas → replicação → destruição celular → resposta inflamatória`
    },
    
    'MUCOCELE BILIAR': {
      etiologia: `🫥 **Definição**: Distensão anormal da vesícula biliar por acúmulo de **mucina** e material gelatinoso.

**Causas primárias**:
- 🔄 Hipomotilidade da vesícula biliar
- 🧬 Alterações na composição da bile
- 🚫 Obstrução parcial do ducto cístico

**Fatores predisponentes**:
- Endocrinopatias (HAC, hipotireoidismo)
- Idade avançada  
- Predisposição racial (Cocker Spaniel)`,
      
      fisiopatologia: `⚡ **Fisiopatologia normal da vesícula**:
- Armazenamento e concentração da bile
- Contração coordenada com CCK
- Esvaziamento durante digestão

🚨 **Na mucocele**:
1. **Hipomotilidade** → estase biliar
2. **Hipersecreção mucosa** → acúmulo de mucina
3. **Distensão progressiva** → compressão vascular
4. **Isquemia** → necrose da parede
5. **Ruptura** (complicação grave) → peritonite biliar`,
      
      diagnostico: `🔍 **Padrão ouro**: Ultrassom abdominal

**Achados ultrassonográficos**:
- 🌟 **"Sinal do kiwi"** - padrão estriado típico
- 🎯 Conteúdo hiperecóico em camadas
- 📏 Distensão da vesícula
- 🚫 Ausência de sombra acústica (diferencial com cálculo)

**Bioquímica**:
- ↑ FA, GGT (colestase)
- ↑ Bilirrubinas (se houver obstrução)  
- ↑ ALT/AST (se hepatite secundária)`
    },
    
    'HEMOSTASIA': {
      etiologia: `🔴 **Conceito**: Sistema hemostático = mecanismo de controle do sangramento e manutenção da fluidez sanguínea.

**Componentes do sistema**:
- 🩸 **Hemostasia primária** - plaquetas e vasos
- ⚡ **Hemostasia secundária** - cascata de coagulação
- 🔄 **Fibrinólise** - dissolução do coágulo`,
      
      fisiopatologia: `🎯 **Via extrínseca** (TP):
- Ativada por Fator Tecidual (lesão tecidual)
- Avalia: FVII → via comum (FX, FV, FII, FI)

🔄 **Via intrínseca** (TTPA):  
- Ativada por superfície (FXII)
- Avalia: FXII, FXI, FIX, FVIII → via comum

**Via comum final**:
- FX → protrombinase → trombina → fibrina

**Interpretação clínica**:
- TP ↑, TTPA normal = defeito via EXTRÍNSECA (FVII)
- TP normal, TTPA ↑ = defeito via INTRÍNSECA (hemofilia)  
- TP ↑, TTPA ↑ = defeito via COMUM ou múltiplos`
    }
  }

  const topicKey = topic.toUpperCase()
  const base = explanations[topicKey] || {}
  
  return {
    etiologia: base.etiologia || `**Causas e mecanismos** relacionados a **${topic}** segundo a literatura veterinária de referência.`,
    epidemiologia: base.epidemiologia || `**Dados populacionais** e **fatores de risco** para **${topic}** na população animal.`,
    fisiopatologia: base.fisiopatologia || `**Mecanismos fisiopatológicos** envolvidos no desenvolvimento de **${topic}**.`,
    diagnostico: base.diagnostico || `**Abordagem diagnóstica** sistemática para **${topic}**.`
  }
}

export function composeOfflineReview(q: Question): string {
  const lines: string[] = []
  const mainTopic = pickSpecificTopic(q.topic_tags) || q.area_tags?.[0] || 'tema'
  
  // Cabeçalho didático estilo aula
  lines.push(`# 🩺 **Aula Magistral do Dr. Luzaum**`)
  lines.push(``)
  lines.push(`**📖 Tema da Aula**: ${q.topic_tags?.join(' • ') || q.area_tags?.join(' • ')}`)
  lines.push(`**🎓 Nível**: Graduação em Medicina Veterinária`)
  lines.push(`**📚 Fonte**: Prova ${q.exam}-${q.year} | Área: ${q.area_tags.join(', ')}`)
  lines.push(``)
  lines.push(`---`)
  lines.push(``)

  // Explicações didáticas expandidas
  const didacticContent = generateDidacticExplanation(mainTopic, q.area_tags[0] || '')

  if (q.review?.etiologia || didacticContent.etiologia) {
    lines.push('## 🦠 **Etiologia & Agentes Causais**')
    lines.push(`*"Para entender uma doença, precisamos conhecer sua origem"*`)
    lines.push(``)
    lines.push(q.review?.etiologia || didacticContent.etiologia)
    lines.push(``)
    lines.push(`💡 **Dica pedagógica**: A etiologia é o "ponto de partida" - identifique SEMPRE o agente primário ou mecanismo inicial. É a base para entender todo o processo patológico!`)
    lines.push(``)
  }

  if (q.review?.epidemiologia || didacticContent.epidemiologia) {
    lines.push('## 📊 **Epidemiologia & Fatores de Risco**')
    lines.push(`*"Conhecer os padrões populacionais orienta a prevenção"*`)
    lines.push(``)
    lines.push(q.review?.epidemiologia || didacticContent.epidemiologia)
    lines.push(``)
    lines.push(`💡 **Dica pedagógica**: Epidemiologia responde "QUEM", "ONDE" e "QUANDO" adoece. Use esses dados para suspeitas clínicas e medidas preventivas!`)
    lines.push(``)
  }

  if (q.review?.anatomia) {
    lines.push('## 🫀 **Base Anatômica & Fisiológica Normal**')
    lines.push(`*"Impossível reconhecer o patológico sem dominar o normal"*`)
    lines.push(``)
    lines.push('**Anatomia/Fisiologia relevante ao tema**:')
    lines.push(q.review.anatomia)
    lines.push(``)
    lines.push(`🎯 **Conceito fundamental**: O conhecimento anatômico-fisiológico é a BASE para interpretação de sinais clínicos, exames e escolhas terapêuticas!`)
    lines.push(``)
  }

  if (q.review?.fisiologia || q.review?.patogenia || didacticContent.fisiopatologia) {
    lines.push('## ⚠️ **Fisiopatologia - A Sequência dos Eventos**')
    lines.push(`*"A fisiopatologia conta a 'história' de como a saúde se torna doença"*`)
    lines.push(``)
    if (q.review?.fisiologia) lines.push(q.review.fisiologia)
    if (q.review?.patogenia) lines.push(q.review.patogenia) 
    if (!q.review?.fisiologia && !q.review?.patogenia) lines.push(didacticContent.fisiopatologia)
    lines.push(``)
    lines.push(`🔗 **Raciocínio clínico**: Fisiopatologia = CAUSA → MECANISMO → MANIFESTAÇÃO. Dominar essa sequência permite predizer sinais, complicações e respostas terapêuticas!`)
    lines.push(``)
  }

  if (q.review?.sintomatologia?.aguda?.length || q.review?.sintomatologia?.cronica?.length) {
    lines.push('## 🩺 **Semiologia - Como o Paciente se Apresenta**')
    lines.push(`*"Os sinais clínicos são a 'linguagem' que o corpo usa para comunicar a doença"*`)
    lines.push(``)
    const ag = q.review?.sintomatologia?.aguda || []
    const cr = q.review?.sintomatologia?.cronica || []
    if (ag.length) {
      lines.push('**📈 Manifestações AGUDAS** (início rápido, evolução acelerada):')
      lines.push(`- ${join(ag)}`)
      lines.push(``)
    }
    if (cr.length) {
      lines.push('**📉 Manifestações CRÔNICAS** (início insidioso, evolução lenta):')
      lines.push(`- ${join(cr)}`)
      lines.push(``)
    }
    lines.push(`⏱️ **Importância clínica**: A CRONOLOGIA dos sinais orienta diagnóstico diferencial, prognóstico e URGÊNCIA do atendimento!`)
    lines.push(``)
  }

  if (q.review?.diagnostico?.achados_complementares || (didacticContent.diagnostico && didacticContent.diagnostico.trim() !== `**Abordagem diagnóstica**`)) {
    lines.push('## 🧪 **Propedêutica Complementar - Confirmando Suspeitas**')
    lines.push(`*"Exames complementares CONFIRMAM o que a clínica SUGERE"*`)
    lines.push(``)
    if (q.review?.diagnostico?.achados_complementares) {
      const a = q.review.diagnostico.achados_complementares
      if (a.hemograma?.length) {
        lines.push('🔴 **HEMOGRAMA** (avaliação das células sanguíneas):')
        lines.push(`- ${join(a.hemograma)}`)
        lines.push(``)
      }
      if (a.bioquimica?.length) {
        lines.push('🧪 **BIOQUÍMICA SÉRICA** (avaliação da função orgânica):')
        lines.push(`- ${join(a.bioquimica)}`)
        lines.push(``)
      }
      if (a.imagem?.length) {
        lines.push('📸 **DIAGNÓSTICO POR IMAGEM**:')
        lines.push(`- ${join(a.imagem)}`)
        lines.push(``)
      }
      if (a.urinálise?.length) {
        lines.push('💧 **URINÁLISE** (avaliação da função renal/urinária):')
        lines.push(`- ${join(a.urinálise)}`)
        lines.push(``)
      }
      if (a.coproparasitologico?.length) {
        lines.push('💩 **COPROPARASITOLÓGICO**:')
        lines.push(`- ${join(a.coproparasitologico)}`)
        lines.push(``)
      }
    } else if (didacticContent.diagnostico) {
      lines.push(didacticContent.diagnostico)
      lines.push(``)
    }
    lines.push(`🎯 **PRINCÍPIO DIAGNÓSTICO FUNDAMENTAL**: Jamais se baseie em UM único exame isolado. Sempre correlacione MÚLTIPLAS evidências: anamnese + exame físico + exames complementares!`)
    lines.push(``)
  }

  if (q.review?.diagnostico?.principais?.length) {
    lines.push('## ✅ **Critérios para Fechamento Diagnóstico**')
    lines.push(`*"Diagnóstico correto = base para terapêutica eficaz"*`)
    lines.push(``)
    lines.push('**Critérios diagnósticos estabelecidos pela literatura**:')
    lines.push(`- ${join(q.review.diagnostico.principais)}`)
    if (q.review?.diagnostico?.sens_espec) {
      lines.push(``)
      lines.push('⚖️ **Acurácia diagnóstica**: Sempre considere sensibilidade (capacidade de detectar doentes) e especificidade (capacidade de excluir sadios) dos testes utilizados.')
    }
    lines.push(``)
    lines.push(`📋 **Método diagnóstico**: Use critérios OBJETIVOS e REPRODUTÍVEIS. Evite diagnósticos baseados apenas em "impressão clínica"!`)
    lines.push(``)
  }

  if (q.review?.terapia?.caes?.length || q.review?.terapia?.gatos?.length) {
    lines.push('## 💊 **Protocolo Terapêutico Baseado em Evidências**')
    lines.push(`*"Tratamento eficaz exige conhecimento farmacológico e monitoramento constante"*`)
    lines.push(``)
    if (q.review?.terapia?.caes?.length) {
      lines.push('🐕 **PROTOCOLO PARA CÃES**:')
      lines.push(`- ${join(q.review.terapia.caes)}`)
      lines.push(``)
    }
    if (q.review?.terapia?.gatos?.length) {
      lines.push('🐱 **PROTOCOLO PARA GATOS**:')
      lines.push(`- ${join(q.review.terapia.gatos)}`)
      lines.push(``)
    }
    lines.push(`⚠️ **SEGURANÇA TERAPÊUTICA**: Para CADA medicamento, considere: dose (mg/kg), via de administração, frequência, duração, contraindicações, efeitos adversos e necessidade de monitoramento!`)
    lines.push(``)
  }

  if (q.review?.high_yield?.length) {
    lines.push('## 🎯 **Pontos High-Yield - Ouro para Concursos**')
    lines.push(`*"Informações que aparecem repetidamente em provas de residência"*`)
    lines.push(``)
    lines.push(`- ${join(q.review.high_yield)}`)
    lines.push(``)
    lines.push(`🏆 **Estratégia de estudo**: Memorize estes pontos! São informações FREQUENTES em concursos e fundamentais na prática clínica.`)
    lines.push(``)
  }

  if (q.review?.pegadinhas?.length) {
    lines.push('## 🚨 **Pegadinhas Clássicas - Evite Estas Armadilhas**')
    lines.push(`*"Conhecer os erros comuns é metade do caminho para acertar"*`)
    lines.push(``)
    lines.push(`- ${join(q.review.pegadinhas)}`)
    lines.push(``)
    lines.push(`🔍 **Dica de prova**: Leia com ATENÇÃO! Pegadinhas exploram conceitos similares, unidades de medida, cronologia ou interpretações superficiais.`)
    lines.push(``)
  }

  // Referências científicas
  if (q.review?.referencias?.length) {
    lines.push('## 📚 **Referências Bibliográficas**')
    for (const ref of q.review.referencias) {
      const { obra, cap, pg } = ref as any
      const desc = [obra, cap ? `cap. ${cap}` : null, pg ? `p. ${pg}` : null].filter(Boolean).join(' · ')
      lines.push(`- ${desc}`)
    }
    lines.push(``)
  } else {
    lines.push('## 📚 **Bibliografia de Referência**')
    lines.push(`- **Nelson & Couto** - Medicina Interna de Pequenos Animais`)
    lines.push(`- **Plumb's** - Veterinary Drug Handbook`)
    lines.push(`- **BSAVA Manual** - Diagnóstico e Tratamento`)
    lines.push(`- **DiBartola** - Fluid, Electrolyte and Acid-Base Disorders`)
    lines.push(`- **Cunningham** - Fisiologia Veterinária`)
    lines.push(``)
  }

  // Análise das alternativas educativa
  if (q.rationales && Object.keys(q.rationales).length > 0) {
    lines.push('## 🎓 **Análise Pedagógica das Alternativas**')
    lines.push(`*"Cada alternativa incorreta ensina algo - aprenda com os erros!"*`)
    lines.push(``)
    const labels = q.options.map(o => o.label)
    for (const label of labels) {
      const isCorrect = label === q.answer_key
      const head = isCorrect ? `✅ **${label}) CORRETA**` : `❌ **${label}) INCORRETA**`
      const tx = q.rationales[label] || ''
      lines.push(`${head}`)
      lines.push(`${tx}`)
      lines.push(``)
    }
    lines.push(`🎯 **Método de estudo**: Não apenas decore a resposta certa. ENTENDA por que cada alternativa está certa ou errada - isso multiplica seu aprendizado!`)
    lines.push(``)
  }

  lines.push('---')
  lines.push('')
  lines.push('> 👨‍🏫 **Revisão educativa detalhada do Dr. Luzaum** - Baseada em literatura de referência e experiência didática.')
  
  return lines.join('\n')
}