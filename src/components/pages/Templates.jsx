import { useState, useRef } from 'react'
import styles from './Templates.module.css'

const TEMPLATES = [
  {
    id: 'sem',
    title: 'Sem CAR',
    badgeStyle: 'sem',
    description: 'Mensagem enviada para produtores que ainda não realizaram o cadastro no CAR.',
    defaultText:
      'Olá, {{nome}}. Identificamos que sua propriedade rural em {{municipio}} ainda não possui Cadastro Ambiental Rural (CAR). O CAR é obrigatório pelo Código Florestal (Lei 12.651/2012). Regularize até {{prazo}} acessando: {{link_car}}',
    variables: ['{{nome}}', '{{municipio}}', '{{link_car}}', '{{prazo}}'],
  },
  {
    id: 'pendente',
    title: 'CAR Pendente',
    badgeStyle: 'pendente',
    description: 'Mensagem enviada para produtores com cadastro iniciado mas ainda não concluído.',
    defaultText:
      'Olá, {{nome}}. Seu cadastro CAR referente ao imóvel em {{municipio}} está com pendências (protocolo {{protocolo}}). Para concluir o processo e regularizar sua situação, acesse: {{link_car}}. Prazo: {{prazo}}',
    variables: ['{{nome}}', '{{municipio}}', '{{link_car}}', '{{prazo}}', '{{protocolo}}'],
  },
  {
    id: 'cancelado',
    title: 'CAR Cancelado',
    badgeStyle: 'cancelado',
    description: 'Mensagem enviada para produtores com cadastro cancelado que precisam regularizar.',
    defaultText:
      'Olá, {{nome}}. O cadastro CAR do seu imóvel rural em {{municipio}} foi cancelado. Motivo: {{motivo_cancelamento}}. Para reabrir o processo de regularização, acesse: {{link_car}} até {{prazo}}.',
    variables: ['{{nome}}', '{{municipio}}', '{{link_car}}', '{{prazo}}', '{{motivo_cancelamento}}'],
  },
]

function TemplateCard({ template, onSave }) {
  const [text, setText] = useState(template.defaultText)
  const textareaRef = useRef(null)

  const insertVariable = (variable) => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const next = text.slice(0, start) + variable + text.slice(end)
    setText(next)
    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + variable.length, start + variable.length)
    }, 0)
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={`${styles.badge} ${styles[`badge_${template.badgeStyle}`]}`}>
          {template.title}
        </span>
      </div>
      <p className={styles.cardDesc}>{template.description}</p>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className={styles.variables}>
        <span className={styles.variablesLabel}>Variáveis disponíveis:</span>
        {template.variables.map((v) => (
          <button key={v} className={styles.chip} onClick={() => insertVariable(v)}>
            {v}
          </button>
        ))}
      </div>
      <div className={styles.cardFooter}>
        <button className={styles.btnSave} onClick={() => onSave()}>
          Salvar template
        </button>
      </div>
    </div>
  )
}

export default function TemplatesPage() {
  const [toast, setToast] = useState(false)

  const handleSave = () => {
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  return (
    <>
      <nav className={styles.breadcrumb}>
        <span>CARminha</span>
        <span className={styles.breadSep}>/</span>
        <span className={styles.breadActive}>Templates</span>
      </nav>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Templates de Mensagem</h1>
        <p className={styles.pageSubtitle}>
          Configure as mensagens enviadas automaticamente para cada situação de cadastro.
        </p>
      </div>

      <div className={styles.cards}>
        {TEMPLATES.map((t) => (
          <TemplateCard key={t.id} template={t} onSave={handleSave} />
        ))}
      </div>

      {toast && (
        <div className={styles.toast}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7.25" fill="#2B4A10" />
            <path d="M5 8l2 2 4-4" stroke="#C4A020" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Template salvo com sucesso
        </div>
      )}
    </>
  )
}