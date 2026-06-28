import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area,
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

function RadialProgress({ value }) {
  const r = 52
  const circ = 2 * Math.PI * r
  const filled = (value / 100) * circ
  return (
    <svg width="148" height="148" viewBox="0 0 148 148" className={styles.radialSvg}>
      <circle cx="74" cy="74" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
      <circle
        cx="74" cy="74" r={r}
        fill="none"
        stroke="#10b981"
        strokeWidth="10"
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 74 74)"
        className={styles.radialFill}
      />
      <text x="74" y="68" textAnchor="middle" fontSize="28" fontWeight="800" fill="#1c1c1c" fontFamily="inherit">{value}%</text>
      <text x="74" y="88" textAnchor="middle" fontSize="11" fill="#9ca3af" fontFamily="inherit">regularizados</text>
    </svg>
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
      <nav className={styles.breadcrumb}>
        <span>CARminha</span>
        <span className={styles.breadSep}>/</span>
        <span className={styles.breadActive}>Painel</span>
      </nav>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Painel</h1>
        <p className={styles.pageSubtitle}>Visão geral do Cadastro Ambiental Rural no estado.</p>
      </div>

      <div className={styles.statsGrid}>
        <MetricCard label="Produtores carregados" value={total}                metaKey="produtores"   />
        <MetricCard label="Total de propriedades" value={propriedades.length}  metaKey="propriedades" />
        <MetricCard label="Notificações enviadas" value={notificacoesEnviadas} metaKey="notificacoes" />
        <MetricCard label="Taxa de regularização" value={`${taxa}%`}           metaKey="taxa"         />
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Produtores por status</h2>
          <div className={styles.pieWrap}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="46%"
                  innerRadius={68}
                  outerRadius={98}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, name]}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,.08)' }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.pieCenter}>
              <span className={styles.pieCenterNum}>{total}</span>
              <span className={styles.pieCenterLabel}>produtores</span>
            </div>
          </div>
        </div>

        <div className={`${styles.chartCard} ${styles.chartCardWide}`}>
          <h2 className={styles.chartTitle}>Propriedades por município — top 8</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={TOP_MUNICIPIOS} layout="vertical" margin={{ left: 4, right: 24, top: 4, bottom: 4 }}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#2B4A10" />
                  <stop offset="100%" stopColor="#5a8c28" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
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
                tick={{ fontSize: 12, fill: '#374151' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(43,74,16,0.06)' }}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,.08)' }}
                formatter={(v) => [v, 'Propriedades']}
              />
              <Bar dataKey="count" name="Propriedades" fill="url(#barGrad)" radius={[0, 6, 6, 0]} activeBar={{ fill: '#C4A020' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.chartsRow}>
        <div className={`${styles.chartCard} ${styles.chartCardWide}`}>
          <h2 className={styles.chartTitle}>Notificações enviadas por mês</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={LINE_DATA} margin={{ left: 0, right: 24, top: 8, bottom: 4 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2B4A10" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2B4A10" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,.08)' }}
                formatter={(v) => [v, 'Notificações']}
              />
              <Area
                type="monotone"
                dataKey="notificacoes"
                name="Notificações"
                stroke="#2B4A10"
                strokeWidth={2.5}
                fill="url(#areaGrad)"
                dot={{ fill: '#2B4A10', r: 4, strokeWidth: 0 }}
                activeDot={{ fill: '#C4A020', r: 5, stroke: '#2B4A10', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={`${styles.chartCard} ${styles.taxaCard}`}>
          <h2 className={styles.chartTitle}>Taxa de regularização</h2>
          <div className={styles.taxaBody}>
            <RadialProgress value={taxa} />
            <p className={styles.taxaSub}>dos produtores notificados regularizaram o CAR</p>
          </div>
        </div>
      </div>
    </>
  )
}
