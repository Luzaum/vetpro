import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Question } from '../types'
import { Button } from './ui/button'

interface AIChatProps {
  seedPrompt: string
  question: Question
}

type ChatMsg = { role: 'user' | 'assistant' | 'system'; content: string }

const AIChat: React.FC<AIChatProps> = ({ seedPrompt, question }) => {
  const [apiKey, setApiKey] = useState<string>('')
  const [model, setModel] = useState<string>('gpt-4o-mini')
  const [messages, setMessages] = useState<ChatMsg[]>([{
    role: 'system',
    content: 'Você é o Dr. Luzaum, médico-veterinário PhD, professor e clínico. Explique sempre com rigor, cite consensos quando possível, e ensine de forma didática.'
  },{
    role: 'assistant',
    content: 'Olá! Sou o Dr. Luzaum. Vamos revisar esta questão juntos. Envie sua dúvida ou clique em “Gerar visão geral”.'
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const view = useRef<HTMLDivElement>(null)

  useEffect(() => {
    view.current?.scrollTo({ top: view.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const starter = useMemo(() => (
    `Contexto:\n${seedPrompt}\n\nQuestão: ${question.stem}\nOpções: ${question.options.map(o => `${o.label}) ${o.text}`).join(' | ')}\nGabarito: ${question.answer_key}\n`
  ), [seedPrompt, question])

  async function callOpenAI(body: any) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  }

  const send = async (userText: string) => {
    if (!apiKey) {
      alert('Informe sua OpenAI API Key para usar o chat.')
      return
    }
    const newMsgs = [...messages, { role: 'user', content: userText } as ChatMsg]
    setMessages(newMsgs)
    setLoading(true)
    try {
      const response = await callOpenAI({
        model,
        messages: newMsgs.map(m => ({ role: m.role, content: m.content })),
        temperature: 0.4
      })
      const text = response.choices?.[0]?.message?.content ?? 'Sem resposta.'
      setMessages([...newMsgs, { role: 'assistant', content: text }])
    } catch (e: any) {
      setMessages([...newMsgs, { role: 'assistant', content: `Erro: ${e?.message || 'falha na chamada'}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="password"
          placeholder="OpenAI API Key (sk-...)"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full sm:max-w-xs rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
        />
        <select value={model} onChange={(e) => setModel(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
          <option value="gpt-4o-mini">gpt-4o-mini</option>
          <option value="gpt-4o">gpt-4o</option>
          <option value="gpt-4.1-mini">gpt-4.1-mini</option>
        </select>
        <Button size="sm" onClick={() => send(`Gerar visão geral detalhada e estruturada. ${starter}`)} disabled={loading}>Gerar visão geral</Button>
      </div>
      <div ref={view} className="max-h-[40vh] overflow-y-auto rounded-md border border-border bg-card p-3">
        {messages.map((m, i) => (
          <div key={i} className={"mb-2 rounded-md p-2 " + (m.role === 'assistant' ? 'bg-accent/40' : m.role === 'user' ? 'bg-secondary/30' : 'bg-muted') }>
            <div className="text-xs opacity-70 mb-1">{m.role === 'assistant' ? 'Dr. Luzaum' : m.role === 'user' ? 'Você' : 'Sistema'}</div>
            <div className="whitespace-pre-wrap text-sm text-foreground">{m.content}</div>
          </div>
        ))}
        {loading && <div className="text-sm text-muted-foreground">Gerando...</div>}
      </div>
      <div className="flex gap-2">
        <input
          placeholder="Pergunte algo ao Dr. Luzaum..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && input.trim()) { send(input.trim()); setInput('') } }}
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
        />
        <Button size="sm" onClick={() => { if (input.trim()) { send(input.trim()); setInput('') }}} disabled={loading}>Enviar</Button>
      </div>
      <div className="text-xs text-muted-foreground">
        Como obter a chave: crie uma conta em openai.com, acesse Billing e gere uma API key. Cole acima. Custos são cobrados pela OpenAI.
      </div>
    </div>
  )
}

export default AIChat
