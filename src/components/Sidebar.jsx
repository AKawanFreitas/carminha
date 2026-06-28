import styles from './Sidebar.module.css'

const navItems = [
  {
    id: 'painel',
    label: 'Painel',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <rect x="1" y="1" width="6" height="6" rx="1" />
        <rect x="9" y="1" width="6" height="6" rx="1" />
        <rect x="1" y="9" width="6" height="6" rx="1" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
      </svg>
    ),
  },
  {
    id: 'produtores',
    label: 'Produtores',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="6" cy="5" r="2.5" />
        <path d="M1 13c0-2.76 2.24-5 5-5s5 2.24 5 5" />
        <circle cx="12" cy="4" r="2" />
        <path d="M10 11c.3-.05.6-.08.9-.1A4 4 0 0115 14.8" />
      </svg>
    ),
  },
  {
    id: 'propriedades',
    label: 'Propriedades',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1L1 6v9h4v-4h6v4h4V6L8 1z" />
      </svg>
    ),
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2 3.5A1.5 1.5 0 013.5 2h9A1.5 1.5 0 0114 3.5v9a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 12.5v-9z" opacity="0.15" />
        <path d="M2 3.5A1.5 1.5 0 013.5 2h9A1.5 1.5 0 0114 3.5v9a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 12.5v-9z" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <line x1="5" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="5" y1="8.5" x2="11" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="5" y1="11" x2="8.5" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'historico',
    label: 'Histórico de Mensagens',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path
          d="M2 3.5A1.5 1.5 0 013.5 2h9A1.5 1.5 0 0114 3.5v7A1.5 1.5 0 0112.5 12H9l-3 2.5V12H3.5A1.5 1.5 0 012 10.5v-7z"
          opacity="0.15"
        />
        <path
          d="M2 3.5A1.5 1.5 0 013.5 2h9A1.5 1.5 0 0114 3.5v7A1.5 1.5 0 0112.5 12H9l-3 2.5V12H3.5A1.5 1.5 0 012 10.5v-7z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <line x1="5" y1="5.5" x2="11" y2="5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="5" y1="8"   x2="9"  y2="8"   stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function Sidebar({ activeItem = 'produtores', onNavigate, onLogout }) {
  return (
    <aside className={styles.sidebar}>

      <div className={styles.logoArea}>
        <img src="/carminha.png" alt="CARminha" className={styles.logoImg} />
        <div className={styles.logoText}>
          <span className={styles.logoName}>CARminha</span>
          <span className={styles.logoSub}>GOV · CAR</span>
        </div>
      </div>

      <div className={styles.divider}/>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.navItem} ${activeItem === item.id ? styles.active : ''}`}
            onClick={() => onNavigate?.(item.id)}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
            {activeItem === item.id && (
              <span className={styles.activeDot}/>
            )}
          </button>
        ))}
      </nav>

      <div className={styles.spacer}/>

      <div className={styles.divider}/>

      <div className={styles.profile}>
        <div className={styles.avatar}>RM</div>
        <div className={styles.profileInfo}>
          <span className={styles.profileName}>Rafael Monteiro</span>
          <span className={styles.profileRole}>Analista Ambiental Sênior</span>
        </div>
        <button className={styles.logoutBtn} onClick={onLogout} title="Sair">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>

      <div className={styles.footer}>
        <div className={styles.configBtn}>
          <span className={styles.icon}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="8" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M12.95 3.05l-1.06 1.06M4.11 11.89l-1.06 1.06"
                stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </span>
          <span className={styles.label}>Configurações</span>
        </div>
        <span className={styles.version}>v2.4.1 · SICAR</span>
      </div>

    </aside>
  )
}
