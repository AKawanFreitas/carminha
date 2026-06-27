import { useEffect } from 'react'
import styles from './ModalEnviando.module.css'

function EnvelopeSVG() {
  return (
    <svg width="72" height="56" viewBox="0 0 72 56" fill="none">
      <rect x="1" y="1" width="70" height="54" rx="5" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1.5" />
      <path d="M1 1L36 30L71 1" stroke="#d1d5db" strokeWidth="1.5" fill="none" />
      <path d="M1 55L25 33" stroke="#d1d5db" strokeWidth="1.2" />
      <path d="M71 55L47 33" stroke="#d1d5db" strokeWidth="1.2" />
      <rect x="52" y="7" width="13" height="15" rx="2" fill="#C4A020" />
      <rect x="54" y="9" width="9" height="11" rx="1" fill="#2B4A10" opacity="0.35" />
      <line x1="9" y1="40" x2="34" y2="40" stroke="#e5e7eb" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="9" y1="46" x2="26" y2="46" stroke="#e5e7eb" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export default function ModalEnviando({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 5200)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Área de animação — overflow: visible para o envelope voar para fora */}
        <div className={styles.envelopeArea}>
          <div className={styles.scene}>
            {/* Rastros */}
            <div className={styles.ghost2}><EnvelopeSVG /></div>
            <div className={styles.ghost1}><EnvelopeSVG /></div>
            {/* Partículas no lançamento */}
            <div className={styles.spark1} />
            <div className={styles.spark2} />
            <div className={styles.spark3} />
            <div className={styles.spark4} />
            {/* Envelope principal */}
            <div className={styles.envelope}><EnvelopeSVG /></div>
          </div>
        </div>

        <p className={styles.text}>Enviando notificações...</p>

        <div className={styles.dots}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
      </div>
    </div>
  )
}