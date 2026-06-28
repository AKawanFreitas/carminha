import {
  LayoutDashboard,
  Users,
  MapPin,
  FileText,
  MessageSquare,
  Settings,
} from 'lucide-react'
import styles from './Sidebar.module.css'

const navItems = [
  {
    id: 'painel',
    label: 'Painel',
    icon: <LayoutDashboard size={16} strokeWidth={1.8}/>,
  },
  {
    id: 'produtores',
    label: 'Produtores',
    icon: <Users size={16} strokeWidth={1.8}/>,
  },
  {
    id: 'propriedades',
    label: 'Propriedades',
    icon: <MapPin size={16} strokeWidth={1.8}/>,
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: <FileText size={16} strokeWidth={1.8}/>,
  },
  {
    id: 'historico',
    label: 'Histórico de Mensagens',
    icon: <MessageSquare size={16} strokeWidth={1.8}/>,
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
        <div className={styles.avatar}>LC</div>
        <div className={styles.profileInfo}>
          <span className={styles.profileName}>Luciana Carvalho</span>
          <span className={styles.profileRole}>Gestora de Regularização CAR</span>
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
            <Settings size={15} strokeWidth={1.8}/>
          </span>
          <span className={styles.label}>Configurações</span>
        </div>
        <span className={styles.version}>v2.4.1 · SICAR</span>
      </div>

    </aside>
  )
}
