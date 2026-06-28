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
    <div className={styles.editor}>

      <p className={styles.editorDesc}>{template.description}</p>

      <div className={styles.editorField}>
        <label className={styles.fieldLabel}>Mensagem</label>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className={styles.variablesSection}>
        <span className={styles.variablesLabel}>Inserir variável</span>
        <div className={styles.chips}>
          {template.variables.map((v) => (
            <button key={v} className={styles.chip} onClick={() => insertVariable(v)}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.previewSection}>
        <span className={styles.previewLabel}>Preview</span>
        <div className={styles.previewBubble}>
          {text
            .replace(/\{\{nome\}\}/g, 'João Silva')
            .replace(/\{\{municipio\}\}/g, 'Sorriso')
            .replace(/\{\{prazo\}\}/g, '30/07/2026')
            .replace(/\{\{link_car\}\}/g, 'sicar.gov.br/...')
            .replace(/\{\{protocolo\}\}/g, 'MT-2024-00123')
            .replace(/\{\{motivo_cancelamento\}\}/g, 'Documentação incompleta')
          }
        </div>
      </div>

      <div className={styles.editorFooter}>
        <span className={styles.charCount}>{text.length} caracteres</span>
        <button className={styles.btnSave} onClick={onSave}>
          Salvar template
        </button>
      </div>

    </div>
  )
}

export default function TemplatesPage() {
  const [toast, setToast] = useState(false)
  const [activeTab, setActiveTab] = useState('sem')

  const handleSave = () => {
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  const activeTemplate = TEMPLATES.find((t) => t.id === activeTab)

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Templates de Mensagem</h1>
          <p className={styles.pageSubtitle}>
            Configure as mensagens enviadas automaticamente para cada situação.
          </p>
        </div>
      </div>

      <div className={styles.tabs}>
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            <span className={`${styles.tabDot} ${styles[`dot_${t.badgeStyle}`]}`}/>
            {t.title}
          </button>
        ))}
      </div>

      {activeTemplate && (
        <TemplateCard
          key={activeTemplate.id}
          template={activeTemplate}
          onSave={handleSave}
        />
      )}

      {toast && (
        <div className={styles.toast}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7.25" fill="#fff" fillOpacity="0.2"/>
            <path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.6"
                  strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Template salvo com sucesso
        </div>
      )}
    </>
  )
}
