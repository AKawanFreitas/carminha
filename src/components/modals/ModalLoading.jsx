import { useState, useEffect } from 'react'
import styles from './ModalLoading.module.css'

const STEPS = [
  'Conectando ao INCRA/SNCR...',
  'Recuperando lista de imóveis rurais por município...',
  'Extraindo CPFs dos proprietários rurais...',
  'Consultando API do SICAR por CPF...',
  'Identificando situação de cada cadastro...',
  'Separando irregularidades: Sem CAR, Pendente, Cancelado...',
  'Consultando perfis no Gov.br...',
  'Verificando canais de contato disponíveis...',
  'Gerando mensagens personalizadas com IA...',
  '18 produtores identificados para notificação.',
]

const TOTAL_MS = 13000

function PendingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="#d1d5db" strokeWidth="1.5" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg className={styles.spinner} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="#e5e7eb" strokeWidth="2" />
      <path d="M14 8A6 6 0 008 2" stroke="#2B4A10" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="8" fill="#2B4A10" />
      <path
        d="M4.5 8.5l2.5 2.5 4.5-5"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ModalLoading({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1))
    }, TOTAL_MS / STEPS.length)

    let current = 0
    let stallFor = 0

    const progressTimer = setInterval(() => {
      if (stallFor > 0) { stallFor--; return }
      if (Math.random() < 0.07 && current > 8 && current < 88) {
        stallFor = Math.floor(Math.random() * 5) + 3
        return
      }
      current = Math.min(current + 0.42 + Math.random() * 0.36, 99)
      setProgress(Math.round(current))
    }, 50)

    const doneTimer = setTimeout(() => {
      clearInterval(stepTimer)
      clearInterval(progressTimer)
      setProgress(100)
      setStepIndex(STEPS.length - 1)
      setTimeout(onComplete, 500)
    }, TOTAL_MS)

    return () => {
      clearInterval(stepTimer)
      clearInterval(progressTimer)
      clearTimeout(doneTimer)
    }
  }, [onComplete])

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.title}>Buscando produtores</span>
          <span className={styles.subtitle}>Consultando INCRA/SNCR e SICAR...</span>
        </div>

        {/* Checklist */}
        <div className={styles.checklist}>
          {STEPS.map((step, i) => {
            if (i > stepIndex) return null
            const done   = i < stepIndex
            const active = i === stepIndex
            return (
              <div
                key={i}
                className={`${styles.checkItem} ${
                  done   ? styles.checkItemDone   :
                  active ? styles.checkItemActive : ''
                }`}
              >
                <span className={styles.iconSlot}>
                  {done ? <CheckIcon /> : active ? <SpinnerIcon /> : <PendingIcon />}
                </span>
                <span className={`${styles.checkText} ${done ? styles.checkTextDone : ''}`}>
                  {step}
                </span>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.progressTrack}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.progressPct}>{progress}%</span>
        </div>
      </div>
    </div>
  )
}