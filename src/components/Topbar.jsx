import styles from './Topbar.module.css'

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

export default function Topbar({ onLogout }) {
  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <img src="/carminha.png" alt="CARminha" className={styles.logoImg} />
        <span className={styles.subtitle}>GOV · Cadastro Ambiental Rural</span>
      </div>

      <div className={styles.right}>
        <div className={styles.userInfo}>
          <div className={styles.userText}>
            <span className={styles.userName}>Rafael Monteiro</span>
            <span className={styles.userRole}>Analista Ambiental Sênior</span>
          </div>
          <div className={styles.avatar}>RM</div>
        </div>
        <button className={styles.logoutBtn} onClick={onLogout} title="Sair">
          <LogoutIcon />
        </button>
      </div>
    </header>
  )
}
