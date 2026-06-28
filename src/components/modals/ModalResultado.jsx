import styles from './ModalResultado.module.css'

export default function ModalResultado({ sentCount, onClose }) {
  const enviadas = sentCount
  const entregues = Math.round(sentCount * 0.91)
  const falhas = sentCount - entregues

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        <div className={styles.top}>
          <div className={styles.topText}>
            <span className={styles.tag}>Concluído</span>
            <h2 className={styles.title}>Notificações enviadas</h2>
            <p className={styles.subtitle}>
              Processadas e encaminhadas aos produtores selecionados.
            </p>
          </div>
          <div className={styles.checkIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#1A6B2A" strokeWidth="2.2"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className={styles.divider}/>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{enviadas}</span>
            <span className={styles.statLabel}>Enviadas</span>
          </div>
          <div className={styles.statDivider}/>
          <div className={styles.statItem}>
            <span className={`${styles.statValue} ${styles.statGreen}`}>{entregues}</span>
            <span className={styles.statLabel}>Entregues</span>
          </div>
          <div className={styles.statDivider}/>
          <div className={styles.statItem}>
            <span className={`${styles.statValue} ${falhas > 0 ? styles.statRed : styles.statGray}`}>
              {falhas}
            </span>
            <span className={styles.statLabel}>Falhas</span>
          </div>
        </div>

        <div className={styles.divider}/>

        <div className={styles.footer}>
          <button className={styles.btnConcluir} onClick={onClose}>
            Fechar
          </button>
        </div>

      </div>
    </div>
  )
}
