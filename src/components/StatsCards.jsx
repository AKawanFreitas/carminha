import styles from './StatsCards.module.css'

const cardConfig = [
  {
    key: 'total',
    label: 'Total',
    dotColor: '#6b7280',
    getValue: (p) => p.length,
  },
  {
    key: 'sem',
    label: 'Sem CAR',
    dotColor: '#ef4444',
    getValue: (p) => p.filter((x) => x.status === 'sem').length,
  },
  {
    key: 'pendente',
    label: 'CAR Pendente',
    dotColor: '#f59e0b',
    getValue: (p) => p.filter((x) => x.status === 'pendente').length,
  },
  {
    key: 'cancelado',
    label: 'Cancelado',
    dotColor: '#9ca3af',
    getValue: (p) => p.filter((x) => x.status === 'cancelado').length,
  },
  {
    key: 'notificado',
    label: 'CAR com Notificação',
    dotColor: '#3b82f6',
    getValue: (p) => p.filter((x) => x.status === 'notificado').length,
  },
  {
    key: 'ativo',
    label: 'CAR Regular',
    dotColor: '#10b981',
    getValue: (p) => p.filter((x) => x.status === 'ativo').length,
  },
]

export default function StatsCards({ produtores }) {
  return (
    <div className={styles.grid}>
      {cardConfig.map((card) => (
        <div key={card.key} className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.dot} style={{ background: card.dotColor }} />
            <span className={styles.cardLabel}>{card.label}</span>
          </div>
          <span className={styles.cardValue}>{card.getValue(produtores)}</span>
        </div>
      ))}
    </div>
  )
}
