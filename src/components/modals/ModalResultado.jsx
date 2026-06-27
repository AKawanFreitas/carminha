import styles from './ModalResultado.module.css'

export default function ModalResultado({ sentCount, onClose }) {
  const enviadas = sentCount
  const entregues = Math.round(sentCount * 0.91)
  const falhas = sentCount - entregues

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.checkCircle}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="#065f46"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className={styles.title}>Notificações enviadas</h2>
        <p className={styles.subtitle}>
          As notificações foram processadas e encaminhadas aos produtores selecionados.
        </p>

        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{enviadas}</span>
            <span className={styles.statLabel}>Enviadas</span>
          </div>
          <div className={styles.statCard}>
            <span className={`${styles.statValue} ${styles.statGreen}`}>{entregues}</span>
            <span className={styles.statLabel}>Entregues</span>
          </div>
          <div className={`${styles.statCard} ${falhas > 0 ? styles.statCardFail : ''}`}>
            <span className={`${styles.statValue} ${falhas > 0 ? styles.statRed : styles.statGray}`}>{falhas}</span>
            <span className={styles.statLabel}>Falhas</span>
          </div>
        </div>

        <button className={styles.btnConcluir} onClick={onClose}>
          Concluído
        </button>
      </div>
    </div>
  )
}
