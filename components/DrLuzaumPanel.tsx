import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Question } from '../types'
import { composeLuzaumPrompt, generateLuzaumReview } from '../services/geminiService'
import { ChatMessage } from '../services/ai'
import { composeOfflineReview } from '../services/offlineReview'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { API_BASE } from '../lib/apiBase'

interface Props {
  question: Question
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h5 className="mt-4 mb-2 text-base font-semibold text-foreground">{children}</h5>
)

export const DrLuzaumPanel: React.FC<Props> = ({ question }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<ChatMessage[]>([])
  const [progress, setProgress] = useState<number>(0)
  const [pendingAnswer, setPendingAnswer] = useState<string>('')
  const progressTimer = useRef<number | null>(null)

  const prompt = useMemo(() => composeLuzaumPrompt(question), [question])

  useEffect(() => {
    let mounted = true
    async function run() {
      try {
        setLoading(true)
        setError(null)
        setProgress(0)
        let text: string
        try {
          const header = [
            '👋 Olá, sou o **Dr. Luzaum** — vamos revisar juntos?',
            `**Tema:** ${(question.topic_tags && question.topic_tags.length) ? question.topic_tags.join(', ') : question.area_tags.join(', ')}`,
            `**Nível:** ${question.difficulty === 'F' ? 'Fácil' : question.difficulty === 'M' ? 'Médio' : 'Difícil'}`,
            `**Fonte:** ${question.exam}-${question.year}`,
            `**Área:** ${question.area_tags.join(', ')}`,
            '---'
          ].join('\n')
          setHistory([{ role: 'assistant', content: header }])

          // Barra de progresso (simulada em etapas) enquanto consulta IA
          setProgress(10)
          // análise inicial
          setProgress(20)
          // simular fase de pesquisa: incrementa lentamente até 75%
          if (progressTimer.current) window.clearInterval(progressTimer.current)
          progressTimer.current = window.setInterval(() => {
            setProgress((p) => (p < 75 ? p + 2 : p))
          }, 120)

          // Opcional: chamar servidor workflow (se disponível)
          try {
            const resp = await fetch(`${API_BASE}/api/dr-luzaum/revisao`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                questao_id: question.id,
                enunciado: question.stem,
                alternativas: question.options.map(o => ({ letra: o.label, texto: o.text })),
                alternativa_correta: question.answer_key,
                alternativa_marcada_pelo_usuario: undefined,
                area_conhecimento: (question.area_tags[0] || '').toLowerCase(),
                especie_alvo: 'ambos',
                contexto_extra: ''
              })
            })
            if (resp.ok) {
              const data = await resp.json()
              text = data.markdown || ''
              setProgress(100)
            } else {
              throw new Error('Server workflow indisponível')
            }
          } catch {
            text = await generateLuzaumReview(question)
          }
          if (progressTimer.current) { window.clearInterval(progressTimer.current); progressTimer.current = null }
          setProgress(90)
        } catch (e: any) {
          if (progressTimer.current) { window.clearInterval(progressTimer.current); progressTimer.current = null }
          setProgress(85)
          text = composeOfflineReview(question)
        }
        if (mounted) {
          // Validação: garantir foco no tópico mais específico
          const norm = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
          const tags = question.topic_tags || []
          const isGeneric = (t: string) => {
            const k = norm(t)
            return /logia$/.test(k) || ['ortopedia','gastroenterologia','neurologia','cardiologia','dermatologia','endocrinologia','hemostasia','hematologia','sus','saude publica','diagnostico por imagem','laboratorio clinico','anestesiologia'].includes(k)
          }
          const specific = tags.filter(t => !isGeneric(t))
          const mostSpecific = specific[0] || (tags.length ? [...tags].sort((a,b)=>b.length-a.length)[0] : (question.area_tags?.[0] || ''))
          const ok = mostSpecific ? norm(text).includes(norm(mostSpecific)) : true
          if (!ok) {
            try {
              // forçar novo giro com tópico específico
              text = await generateLuzaumReview({ ...question, topic_tags: [mostSpecific] } as Question)
            } catch {}
          }

          setPendingAnswer(text)
          setProgress(100)
          // somente após 100% exibir no histórico
          setTimeout(() => {
            setHistory(cur => [...cur, { role: 'assistant', content: text }])
          }, 50)
        }
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
    <div className="relative rounded-2xl border border-sky-400/30 bg-[rgba(10,25,50,0.6)] backdrop-blur-xl shadow-[0_10px_40px_rgba(0,20,60,0.5)] overflow-hidden text-white">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-700/20 rounded-full blur-3xl" />
      </div>
      <div className="relative border-b border-sky-400/30 px-5 py-4">
        <h3 className="text-white font-semibold text-lg">Olá, sou o Dr. Luzaum — vamos revisar juntos?</h3>
        <p className="text-white/85 text-sm"><span className="font-semibold">Tema:</span> {(question.topic_tags && question.topic_tags.length) ? question.topic_tags.join(', ') : question.area_tags.join(', ')}</p>
      </div>
      <div className="relative p-5 text-sm text-white flex flex-col gap-3">
        {loading && <div className="text-sm text-white/80">Gerando revisão com o Dr. Luzaum...</div>}
        {/* Barra de progresso amarela neon enquanto pesquisa */}
        {loading && (
          <div className="w-full">
            <div className="h-3 w-full rounded-full bg-yellow-400/20 border border-yellow-300/60 shadow-[0_0_12px_rgba(250,204,21,0.6)] overflow-hidden">
              <div
                className="h-full bg-yellow-400 shadow-[0_0_18px_rgba(250,204,21,0.95)] transition-[width] duration-150 ease-linear"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-yellow-300/90">Pesquisando literatura e montando revisão… {Math.min(progress,100).toFixed(0)}%</div>
          </div>
        )}
        {error && <div className="text-sm text-red-300">{error}</div>}
        <div className="rounded-lg border border-sky-400/30 bg-[rgba(10,25,50,0.35)] p-3 max-h-[60vh] overflow-y-auto">
          {history.map((m, i) => (
            <div key={i} className={"mb-2 rounded-md p-2 " + (m.role === 'assistant' ? 'bg-sky-500/20' : m.role === 'user' ? 'bg-blue-900/30' : '')}>
              <div className="text-xs opacity-70 mb-1 text-white">{m.role === 'assistant' ? 'Dr. Luzaum' : m.role === 'user' ? 'Você' : 'Sistema'}</div>
              <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-white prose-strong:text-white prose-p:text-white prose-li:text-white prose-blockquote:text-white prose-code:text-white prose-h1:text-white prose-h2:text-white prose-h3:text-white prose-h4:text-white prose-h5:text-white prose-h6:text-white prose-em:text-white prose-span:text-white whitespace-pre-wrap">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DrLuzaumPanel


