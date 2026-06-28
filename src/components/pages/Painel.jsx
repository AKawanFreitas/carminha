import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { propriedades } from '../../data/propriedades'
import styles from './Painel.module.css'

const LINE_DATA = [
  { mes: 'Jan', notificacoes: 8 },
  { mes: 'Fev', notificacoes: 12 },
  { mes: 'Mar', notificacoes: 7 },
  { mes: 'Abr', notificacoes: 19 },
  { mes: 'Mai', notificacoes: 14 },
  { mes: 'Jun', notificacoes: 23 },
]

const STATUS_COLORS = {
  sem: '#ef4444',
  pendente: '#f59e0b',
  cancelado: '#9ca3af',
  notificado: '#3b82f6',
  ativo: '#10b981',
}

const muniCount = {}
propriedades.forEach((p) => {
  muniCount[p.municipio] = (muniCount[p.municipio] || 0) + 1
})
const TOP_MUNICIPIOS = Object.entries(muniCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 8)
  .map(([municipio, count]) => ({ municipio, count }))
  .reverse()

const CARD_META = {
  produtores: {
    accent: '#4b5563',
    iconBg: '#f1f5f9',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  propriedades: {
    accent: '#2B4A10',
    iconBg: '#eef5e6',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  notificacoes: {
    accent: '#3b82f6',
    iconBg: '#eff6ff',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
  taxa: {
    accent: '#10b981',
    iconBg: '#ecfdf5',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
        <polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
  },
}

function MetricCard({ label, value, metaKey }) {
  const meta = CARD_META[metaKey]
  return (
    <div className={styles.statCard} style={{ '--accent': meta.accent }}>
      <div className={styles.statTop}>
        <span className={styles.statLabel}>{label}</span>
        <span className={styles.statIcon} style={{ background: meta.iconBg, color: meta.accent }}>
          {meta.icon}
        </span>
      </div>
      <span className={styles.statValue}>{value}</span>
    </div>
  )
}

function EmptyState() {
  return (
    <div className={styles.emptyWrap}>
      <div className={styles.emptyState}>
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <rect x="3" y="3" width="17" height="17" rx="2" stroke="#d1d5db" strokeWidth="1.5" />
          <rect x="24" y="3" width="17" height="17" rx="2" stroke="#d1d5db" strokeWidth="1.5" />
          <rect x="3" y="24" width="17" height="17" rx="2" stroke="#d1d5db" strokeWidth="1.5" />
          <rect x="24" y="24" width="17" height="17" rx="2" stroke="#d1d5db" strokeWidth="1.5" />
        </svg>
        <p className={styles.emptyTitle}>Painel sem dados</p>
        <p className={styles.emptySubtitle}>
          Acesse <strong>Produtores</strong> e clique em{' '}
          <strong>Buscar Produtores via API</strong> para carregar os dados.
        </p>
      </div>
    </div>
  )
}

export default function PainelPage({ produtores, notificacoesEnviadas }) {
  if (!produtores.length) return <EmptyState />

  const total = produtores.length
  const ativos = produtores.filter((p) => p.status === 'ativo').length
  const taxa = total > 0 ? Math.round((ativos / total) * 100) : 0

  const pieData = [
    { name: 'Sem CAR',     value: produtores.filter((p) => p.status === 'sem').length,        color: STATUS_COLORS.sem },
    { name: 'Pendente',    value: produtores.filter((p) => p.status === 'pendente').length,   color: STATUS_COLORS.pendente },
    { name: 'Cancelado',   value: produtores.filter((p) => p.status === 'cancelado').length,  color: STATUS_COLORS.cancelado },
    { name: 'Notificado',  value: produtores.filter((p) => p.status === 'notificado').length, color: STATUS_COLORS.notificado },
    { name: 'CAR Regular', value: ativos,                                                      color: STATUS_COLORS.ativo },
  ].filter((d) => d.value > 0)

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Painel</h1>
          <p className={styles.pageSubtitle}>
            Visão geral do Cadastro Ambiental Rural no estado.
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className={styles.kpiRow}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiValue}>{total}</span>
          <span className={styles.kpiLabel}>Produtores</span>
          <div className={styles.kpiBorder} style={{ background: '#6b7280' }}/>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiValue}>{propriedades.length}</span>
          <span className={styles.kpiLabel}>Propriedades</span>
          <div className={styles.kpiBorder} style={{ background: '#1A6B2A' }}/>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiValue}>{notificacoesEnviadas}</span>
          <span className={styles.kpiLabel}>Notificações enviadas</span>
          <div className={styles.kpiBorder} style={{ background: '#3b82f6' }}/>
        </div>
        <div className={styles.kpiCard}>
          <span className={`${styles.kpiValue} ${styles.kpiGreen}`}>{taxa}%</span>
          <span className={styles.kpiLabel}>Taxa de regularização</span>
          <div className={styles.kpiBorder} style={{ background: '#10b981' }}/>
        </div>
      </div>

      {/* Status bars */}
      <div className={styles.statusSection}>
        <h2 className={styles.sectionTitle}>Produtores por status</h2>
        <div className={styles.statusBars}>
          {pieData.map((d) => (
            <div key={d.name} className={styles.statusRow}>
              <span className={styles.statusName}>{d.name}</span>
              <div className={styles.statusTrack}>
                <div
                  className={styles.statusFill}
                  style={{
                    width: `${(d.value / total) * 100}%`,
                    background: d.color,
                  }}
                />
              </div>
              <span className={styles.statusCount}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className={styles.chartsGrid}>

        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Notificações por mês</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={LINE_DATA}
              margin={{ left: 0, right: 16, top: 8, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false}/>
              <XAxis
                dataKey="mes"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                width={28}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12, borderRadius: 6,
                  border: '1px solid #e5e7eb',
                  boxShadow: 'none'
                }}
                formatter={(v) => [v, 'Notificações']}
              />
              <Line
                type="monotone"
                dataKey="notificacoes"
                stroke="#1A6B2A"
                strokeWidth={2}
                dot={{ fill: '#1A6B2A', r: 3, strokeWidth: 0 }}
                activeDot={{ fill: '#1A6B2A', r: 5, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Propriedades por município</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={TOP_MUNICIPIOS}
              layout="vertical"
              margin={{ left: 0, right: 16, top: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6"/>
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="municipio"
                width={130}
                tick={{ fontSize: 11, fill: '#374151' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12, borderRadius: 6,
                  border: '1px solid #e5e7eb',
                  boxShadow: 'none'
                }}
                formatter={(v) => [v, 'Propriedades']}
                cursor={{ fill: '#f0fdf4' }}
              />
              <Bar
                dataKey="count"
                fill="#1A6B2A"
                radius={[0, 4, 4, 0]}
                activeBar={{ fill: '#2E7D3A' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </>
  )
}
