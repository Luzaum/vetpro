import React, { useEffect, useMemo, useState } from 'react'
import { Question } from '../types'
import { Button } from './ui/button'
import { composeLuzaumPrompt, generateLuzaumReview } from '../services/geminiService'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  question: Question
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h5 className="mt-4 mb-2 text-base font-semibold text-foreground">{children}</h5>
)

export const DrLuzaumPanel: React.FC<Props> = ({ question }) => {
  const [tab, setTab] = useState<'resumo' | 'chat'>('resumo')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [answer, setAnswer] = useState<string>('')

  const prompt = useMemo(() => {
    return composeLuzaumPrompt(question)
  }, [question])

  useEffect(() => {
    let mounted = true
    async function run() {
      try {
        setLoading(true)
        setError(null)
        const text = await generateLuzaumReview(question)
        if (mounted) setAnswer(text)
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Falha ao gerar revisão')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => { mounted = false }
  }, [question])

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant={tab === 'resumo' ? 'default' : 'outline'} size="sm" onClick={() => setTab('resumo')}>Resumo</Button>
          <Button variant={tab === 'chat' ? 'default' : 'outline'} size="sm" onClick={() => setTab('chat')}>Chat</Button>
        </div>
        <span className="text-xs text-muted-foreground">{question.exam}-{question.year}</span>
      </div>

      {tab === 'resumo' && (
        <div className="p-4">
          {loading && <div className="text-sm text-muted-foreground">Gerando revisão com o Dr. Luzaum...</div>}
          {error && <div className="text-sm text-danger">{error}</div>}
          {!loading && !error && (
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
            </div>
          )}
        </div>
      )}

      {tab === 'chat' && (
        <div className="p-4 text-sm text-foreground">
          <div className="rounded-md border border-border bg-background p-3 text-muted-foreground">
            Chat em tempo real não habilitado nesta versão. A revisão completa é gerada automaticamente com o Gemini Pro.
          </div>
        </div>
      )}
    </div>
  )
}

export default DrLuzaumPanel


