import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
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

function MetricCard({ label, value, dotColor }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statHeader}>
        <span className={styles.statDot} style={{ background: dotColor }} />
        <span className={styles.statLabel}>{label}</span>
      </div>
      <span className={styles.statValue}>{value}</span>
    </div>
  )
}

export default function PainelPage({ produtores, notificacoesEnviadas }) {
  if (!produtores.length) return <EmptyState />

  const total = produtores.length
  const ativos = produtores.filter((p) => p.status === 'ativo').length
  const taxa = total > 0 ? Math.round((ativos / total) * 100) : 0

  const pieData = [
    { name: 'Sem CAR',    value: produtores.filter((p) => p.status === 'sem').length,        color: STATUS_COLORS.sem },
    { name: 'Pendente',   value: produtores.filter((p) => p.status === 'pendente').length,   color: STATUS_COLORS.pendente },
    { name: 'Cancelado',  value: produtores.filter((p) => p.status === 'cancelado').length,  color: STATUS_COLORS.cancelado },
    { name: 'Notificado', value: produtores.filter((p) => p.status === 'notificado').length, color: STATUS_COLORS.notificado },
    { name: 'CAR Regular',value: ativos,                                                      color: STATUS_COLORS.ativo },
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
        <MetricCard label="Produtores carregados"  value={total}                dotColor="#6b7280" />
        <MetricCard label="Total de propriedades"  value={propriedades.length}  dotColor="#2B4A10" />
        <MetricCard label="Notificações enviadas"  value={notificacoesEnviadas} dotColor="#3b82f6" />
        <MetricCard label="Taxa de regularização"  value={`${taxa}%`}           dotColor="#10b981" />
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>Produtores por status</h2>
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
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={`${styles.chartCard} ${styles.chartCardWide}`}>
          <h2 className={styles.chartTitle}>Propriedades por município — top 8</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={TOP_MUNICIPIOS} layout="vertical" margin={{ left: 4, right: 24, top: 4, bottom: 4 }}>
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
                width={120}
                tick={{ fontSize: 12, fill: '#374151' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(200,217,34,0.12)' }}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                formatter={(v) => [v, 'Propriedades']}
              />
              <Bar
                dataKey="count"
                name="Propriedades"
                fill="#2B4A10"
                radius={[0, 4, 4, 0]}
                activeBar={{ fill: '#C4A020' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.chartsRow}>
        <div className={`${styles.chartCard} ${styles.chartCardWide}`}>
          <h2 className={styles.chartTitle}>Notificações enviadas por mês</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={LINE_DATA} margin={{ left: 0, right: 24, top: 8, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="mes"
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                formatter={(v) => [v, 'Notificações']}
              />
              <Line
                type="monotone"
                dataKey="notificacoes"
                name="Notificações"
                stroke="#2B4A10"
                strokeWidth={2.5}
                dot={{ fill: '#2B4A10', r: 4, strokeWidth: 0 }}
                activeDot={{ fill: '#C4A020', r: 5, stroke: '#2B4A10', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={`${styles.chartCard} ${styles.taxaCard}`}>
          <h2 className={styles.chartTitle}>Taxa de regularização</h2>
          <div className={styles.taxaBody}>
            <span className={styles.taxaNum}>{taxa}%</span>
            <p className={styles.taxaSub}>dos produtores notificados regularizaram o CAR</p>
          </div>
        </div>
      </div>
    </>
  )
}