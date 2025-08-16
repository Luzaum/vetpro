import React, { useEffect, useMemo, useState } from 'react'
import { Question } from '../types'
import { Button } from './ui/button'
import { composeLuzaumPrompt, generateLuzaumReview } from '../services/geminiService'
import { ChatMessage, streamChat, setOpenAIKey } from '../services/ai'
import { composeOfflineReview } from '../services/offlineReview'
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
  const [showKeyConfig, setShowKeyConfig] = useState(false)
  const [tempKey, setTempKey] = useState('')
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
        let text: string
        try {
          text = await generateLuzaumReview(question)
        } catch (e: any) {
          // Modo offline de contingência
          text = composeOfflineReview(question)
        }
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
    <div className="relative rounded-2xl border border-sky-400/30 bg-[rgba(10,25,50,0.6)] backdrop-blur-xl shadow-[0_10px_40px_rgba(0,20,60,0.5)] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-700/20 rounded-full blur-3xl" />
      </div>
      <div className="relative border-b border-sky-400/30 px-5 py-4 flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sky-100 font-semibold text-lg">Olá, sou o Dr. Luzaum — vamos revisar juntos?</h3>
          <p className="text-sky-200/80 text-sm"><span className="font-semibold">Tema:</span> {(question.topic_tags && question.topic_tags.length) ? question.topic_tags.join(', ') : question.area_tags.join(', ')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={tab === 'resumo' ? 'default' : 'outline'} size="sm" onClick={() => setTab('resumo')}>Revisão</Button>
          <Button variant={tab === 'chat' ? 'default' : 'outline'} size="sm" onClick={() => setTab('chat')}>Chat</Button>
          <Button variant="outline" size="sm" onClick={() => setShowKeyConfig(v => !v)}>Configurar IA</Button>
        </div>
      </div>
      {showKeyConfig && (
        <div className="relative px-5 pt-4">
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="Cole sua OpenAI API Key (sk-...)"
              className="w-full sm:max-w-md rounded-md border border-sky-400/30 bg-[rgba(10,25,50,0.35)] px-3 py-2 text-sm text-sky-50 placeholder:text-sky-200/60"
            />
            <Button size="sm" onClick={() => { if (tempKey.trim()) { setOpenAIKey(tempKey.trim()); setTempKey(''); setShowKeyConfig(false); }}}>Salvar</Button>
          </div>
          <p className="mt-2 text-[11px] text-sky-200/70">Sua chave fica salva apenas neste navegador (localStorage). Reinicie a página após salvar para garantir a ativação completa.</p>
        </div>
      )}

      {tab === 'resumo' && (
        <div className="relative p-5">
          {loading && <div className="text-sm text-sky-200/80">Gerando revisão com o Dr. Luzaum...</div>}
          {error && <div className="text-sm text-red-300">{error}</div>}
          {!loading && !error && (
            <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-white prose-strong:text-white prose-p:text-white prose-li:text-white prose-blockquote:text-white prose-code:text-white">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
            </div>
          )}
        </div>
      )}

      {tab === 'chat' && (
        <div className="relative p-5 text-sm text-sky-50 flex flex-col gap-3">
          <div className="rounded-lg border border-sky-400/30 bg-[rgba(10,25,50,0.35)] p-3 max-h-[40vh] overflow-y-auto">
            {history.filter(m => m.role !== 'system').map((m, i) => (
              <div key={i} className={"mb-2 rounded-md p-2 " + (m.role === 'assistant' ? 'bg-sky-500/20' : 'bg-blue-900/30')}>
                <div className="text-xs opacity-70 mb-1 text-white">{m.role === 'assistant' ? 'Dr. Luzaum' : 'Você'}</div>
                <div className="whitespace-pre-wrap text-white">{m.content}</div>
              </div>
            ))}
            {streaming && <div className="text-xs text-sky-200/80">Gerando...</div>}
          </div>
          <div className="flex gap-2">
            <input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendChat(userInput) }}
              placeholder="Pergunte algo ao Dr. Luzaum..."
              className="flex-1 rounded-md border border-sky-400/30 bg-[rgba(10,25,50,0.4)] px-3 py-2 text-sm text-sky-50 placeholder:text-sky-200/60"
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


