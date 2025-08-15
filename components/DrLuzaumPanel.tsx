import React, { useMemo, useState } from 'react'
import { Question } from '../types'
import { Button } from './ui/button'

interface Props {
  question: Question
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h5 className="mt-4 mb-2 text-base font-semibold text-foreground">{children}</h5>
)

export const DrLuzaumPanel: React.FC<Props> = ({ question }) => {
  const [tab, setTab] = useState<'chat' | 'resumo' | 'extras'>('resumo')

  const prompt = useMemo(() => {
    return `Você é o Dr. Luzaum, médico-veterinário PhD em clínica médica, cirúrgica, anestesiologia, imaginologia, saúde pública e patologia clínica. Explique o tema desta questão de forma completa e robusta.
Contexto da questão: ${question.stem}
Área(s): ${question.area_tags.join(', ')} | Tópicos: ${question.topic_tags.join(', ')} | Ano/Prova: ${question.exam}-${question.year}

Instruções:
- Aborde epidemiologia, etiologia, patogenia, sinais clínicos e diferenciais.
- Diagnóstico com sensibilidade/especificidade (use faixas e referências típicas quando não houver valor exato).
- Tratamentos padrão (consensos atuais) e alternativos, com ressalvas.
- Explique conceitos complexos com analogias e passos.
- Para saúde pública, inclua revisão de leis/definições aplicáveis.
- Analise as alternativas da questão (correta e incorretas) de forma crítica.
- Finalize com dicas e curiosidades para fixação.
- Formate com destaques: use títulos curtos, listas, e marque conceitos-chaves com **negrito**. Quando possível, sugira fluxogramas textuais (->) e pequenos quadros comparativos.
`;
  }, [question])

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Button variant={tab === 'resumo' ? 'default' : 'outline'} size="sm" onClick={() => setTab('resumo')}>Resumo</Button>
        <Button variant={tab === 'chat' ? 'default' : 'outline'} size="sm" onClick={() => setTab('chat')}>Chat</Button>
        <Button variant={tab === 'extras' ? 'default' : 'outline'} size="sm" onClick={() => setTab('extras')}>Extras</Button>
      </div>

      {tab === 'resumo' && (
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <SectionTitle>Como usar</SectionTitle>
          <p>
            O Dr. Luzaum prepara um roteiro de revisão completo para esta questão. Você pode abrir a aba Chat
            para fazer perguntas livres, ou copiar o prompt abaixo para outra IA.
          </p>
          <SectionTitle>Prompt para copiar</SectionTitle>
          <pre className="whitespace-pre-wrap rounded-md border border-border bg-background p-3 text-xs text-foreground">{prompt}</pre>
          <SectionTitle>Roteiro recomendado</SectionTitle>
          <ul>
            <li><strong>Panorama:</strong> definição do tema, relevância e riscos.</li>
            <li><strong>Diagnóstico de precisão:</strong> quando usar quais exames e por quê.</li>
            <li><strong>Terapia baseada em evidências:</strong> condutas de 1ª linha e alternativas.</li>
            <li><strong>Pegadinhas de prova:</strong> erros comuns relacionados a este assunto.</li>
          </ul>
        </div>
      )}

      {tab === 'chat' && (
        <div className="rounded-md border border-border bg-background p-3 text-sm text-foreground">
          <p>
            Integração de chat externo não habilitada neste projeto. Use o prompt acima em sua IA preferida
            ou conecte um provedor em <code>services/geminiService.ts</code>.
          </p>
        </div>
      )}

      {tab === 'extras' && (
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <SectionTitle>Ideias de artigos recentes</SectionTitle>
          <ul>
            <li>Guidelines e consensos (WSAVA/ACVS/ACVAA/ACVIM) relacionados ao tópico.</li>
            <li>Estudos comparando abordagens terapêuticas e desfechos.</li>
          </ul>
          <SectionTitle>Fluxograma sugerido</SectionTitle>
          <pre className="whitespace-pre">{`Sinais clínicos -> Exames básicos -> Exames confirmatórios -> Classificação de gravidade -> Conduta passo-a-passo`}</pre>
        </div>
      )}
    </div>
  )
}

export default DrLuzaumPanel


