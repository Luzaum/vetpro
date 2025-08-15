import React, { useEffect, useMemo, useState } from 'react'
import { Question } from '../types'
import { Button } from './ui/button'
import { composeLuzaumPrompt, generateLuzaumReview } from '../services/geminiService'
import { ChatMessage, streamChat } from '../services/ai'
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
  const [history, setHistory] = useState<ChatMessage[]>([
    { role: 'system', content: 'Você é o Dr. Luzaum, médico-veterinário PhD. Responda com precisão e de acordo com a literatura.' },
  ])
  const [userInput, setUserInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const abortRef = React.useRef<AbortController | null>(null)

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

  const sendChat = async (text: string) => {
    if (!text.trim()) return;
    const controller = new AbortController();
    abortRef.current = controller;
    const updated: ChatMessage[] = [...history, { role: 'user' as const, content: text }];
    setHistory(updated);
    setStreaming(true);
    let acc = '';
    try {
      await streamChat(updated, (delta) => {
        acc += delta;
        // render token a token
        setHistory((cur: ChatMessage[]) => {
          // se última msg é assistant, concatena; senão adiciona
          const last = cur[cur.length - 1];
          if (last && last.role === 'assistant') {
            const clone = [...cur];
            clone[clone.length - 1] = { role: 'assistant', content: acc } as ChatMessage;
            return clone;
          }
          return [...cur, { role: 'assistant', content: acc } as ChatMessage];
        });
      }, controller.signal);
    } catch (e) {
      setHistory(cur => [...cur, { role: 'assistant', content: 'Falha ao gerar resposta. Verifique as chaves do provedor.' }]);
    } finally {
      setStreaming(false);
      setUserInput('');
    }
  }

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
        <div className="p-4 text-sm text-foreground flex flex-col gap-3">
          <div className="rounded-md border border-border bg-background p-3 max-h-[40vh] overflow-y-auto">
            {history.filter(m => m.role !== 'system').map((m, i) => (
              <div key={i} className={"mb-2 rounded-md p-2 " + (m.role === 'assistant' ? 'bg-accent/40' : 'bg-secondary/30')}>
                <div className="text-xs opacity-70 mb-1">{m.role === 'assistant' ? 'Dr. Luzaum' : 'Você'}</div>
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            ))}
            {streaming && <div className="text-xs text-muted-foreground">Gerando...</div>}
          </div>
          <div className="flex gap-2">
            <input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendChat(userInput) }}
              placeholder="Pergunte algo ao Dr. Luzaum..."
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
            <Button size="sm" onClick={() => sendChat(userInput)} disabled={streaming}>Enviar</Button>
            {streaming && (
              <Button size="sm" variant="outline" onClick={() => abortRef.current?.abort()}>Parar</Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DrLuzaumPanel


