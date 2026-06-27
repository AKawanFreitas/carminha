import styles from './DrawerProdutor.module.css'

const STATUS_MAP = {
  ativo:      { label: 'CAR Regular',        cls: styles.badgeAtivo },
  pendente:   { label: 'CAR Pendente',        cls: styles.badgePendente },
  sem:        { label: 'Sem CAR',             cls: styles.badgeSem },
  cancelado:  { label: 'Cancelado',           cls: styles.badgeCancelado },
  notificado: { label: 'CAR com Notificação', cls: styles.badgeNotificado },
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.9.53 3.67 1.45 5.19L2 22l4.91-1.42A9.94 9.94 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="#25D366" opacity="0.15" stroke="#25D366" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M9 11c.3.6.7 1.15 1.2 1.6.5.46 1.1.85 1.8 1.1l1.5-1.5c.2-.2.5-.25.75-.1.8.4 1.65.65 2.55.73.3.03.53.28.53.58v2.4c0 .3-.23.55-.53.55C9.8 16.36 6 12.56 6 7.97c0-.3.25-.55.55-.55h2.4c.3 0 .55.23.58.53.08.9.33 1.76.73 2.55.14.25.1.55-.1.75L9 11z" fill="#25D366" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="20" height="14" rx="2" fill="#4f46e5" opacity="0.12" stroke="#4f46e5" strokeWidth="1.3" />
      <path d="M2 7l10 7 10-7" stroke="#4f46e5" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function SmsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="2" width="14" height="20" rx="2.5" fill="#3b82f6" opacity="0.12" stroke="#3b82f6" strokeWidth="1.3" />
      <line x1="9" y1="7" x2="15" y2="7" stroke="#3b82f6" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="9" y1="10.5" x2="15" y2="10.5" stroke="#3b82f6" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.2" fill="#3b82f6" />
    </svg>
  )
}

function LigacaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.25.2 2.45.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" fill="#6366f1" opacity="0.15" stroke="#6366f1" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

const CANAL_CONFIG = {
  whatsapp: { label: 'WhatsApp', Icon: WhatsAppIcon },
  email:    { label: 'E-mail',   Icon: EmailIcon },
  sms:      { label: 'SMS',      Icon: SmsIcon },
  ligacao:  { label: 'Ligação (Bot)', Icon: LigacaoIcon },
}

function CanalItem({ canalKey, dados }) {
  const { label, Icon } = CANAL_CONFIG[canalKey]
  return (
    <div className={styles.canalItem}>
      <div className={styles.canalIconWrap}>
        <Icon />
      </div>
      <div className={styles.canalInfo}>
        <span className={styles.canalLabel}>{label}</span>
        {dados.disponivel ? (
          <span className={styles.canalValor}>{dados.valor}</span>
        ) : (
          <span className={styles.canalMotivo}>{dados.motivo}</span>
        )}
      </div>
      <span className={`${styles.dispBadge} ${dados.disponivel ? styles.dispSim : styles.dispNao}`}>
        {dados.disponivel ? 'Disponível' : 'Indisponível'}
      </span>
    </div>
  )
}

export default function DrawerProdutor({ produtor, onClose }) {
  const status = STATUS_MAP[produtor.status] ?? { label: produtor.status, cls: '' }
  const canais = produtor.canais ?? {}
  const nenhumDisponivel = Object.values(canais).every((c) => !c.disponivel)

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <aside className={styles.drawer}>
        {/* Header */}
        <div className={styles.drawerHeader}>
          <div className={styles.drawerTitleGroup}>
            <h2 className={styles.drawerTitle}>{produtor.nome}</h2>
            <span className={styles.drawerCpf}>{produtor.cpf}</span>
            <span className={styles.drawerMunicipio}>
              {produtor.municipio} · {produtor.uf}
            </span>
          </div>
          <div className={styles.drawerHeaderRight}>
            <span className={`${styles.badge} ${status.cls}`}>{status.label}</span>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.drawerBody}>
          {/* Canais */}
          <section className={styles.section}>
            <p className={styles.sectionTitle}>Canais de contato disponíveis</p>
            <p className={styles.sectionSub}>Informações obtidas via API Gov.br</p>
            <div className={styles.canalList}>
              <CanalItem canalKey="whatsapp" dados={canais.whatsapp ?? { disponivel: false, motivo: 'Sem dados' }} />
              <CanalItem canalKey="email"    dados={canais.email    ?? { disponivel: false, motivo: 'Sem dados' }} />
              <CanalItem canalKey="sms"      dados={canais.sms      ?? { disponivel: false, motivo: 'Sem dados' }} />
              <CanalItem canalKey="ligacao"  dados={canais.ligacao  ?? { disponivel: false, motivo: 'Sem dados' }} />
            </div>
          </section>

          {/* Encaminhamento — só quando nenhum canal disponível */}
          {nenhumDisponivel && (
            <div className={styles.encaminhamento}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                <path d="M8 1l7 13H1L8 1z" fill="#fef3c7" stroke="#92400e" strokeWidth="1.2" strokeLinejoin="round" />
                <line x1="8" y1="6" x2="8" y2="9.5" stroke="#92400e" strokeWidth="1.3" strokeLinecap="round" />
                <circle cx="8" cy="11.5" r="0.8" fill="#92400e" />
              </svg>
              <p className={styles.encaminhamentoText}>
                Nenhum canal de contato disponível. Este produtor será encaminhado para intermediário
                (EMATER/Sindicato Rural).
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}