import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
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
  sem:       '#ef4444',
  pendente:  '#f59e0b',
  cancelado: '#9ca3af',
  notificado:'#3b82f6',
  ativo:     '#10b981',
}

const STATUS_LABELS = {
  sem: 'Sem CAR',
  pendente: 'Pendente',
  cancelado: 'Cancelado',
  notificado: 'Notificado',
  ativo: 'CAR Regular',
}

const muniCount = {}
propriedades.forEach((p) => {
  muniCount[p.municipio] = (muniCount[p.municipio] || 0) + 1
})
const TOP_MUNICIPIOS = Object.entries(muniCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 6)
  .map(([municipio, count]) => ({ municipio, count }))

function EmptyState() {
  return (
    <div className={styles.emptyWrap}>
      <div className={styles.emptyState}>
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

  const total  = produtores.length
  const ativos = produtores.filter((p) => p.status === 'ativo').length
  const taxa   = total > 0 ? Math.round((ativos / total) * 100) : 0

  const statusGroups = ['sem','pendente','cancelado','notificado','ativo'].map((key) => ({
    key,
    label: STATUS_LABELS[key],
    color: STATUS_COLORS[key],
    value: produtores.filter((p) => p.status === key).length,
  })).filter((d) => d.value > 0)

  return (
    <div className={styles.page}>

      {/* Header minimalista */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Painel</h1>
          <p className={styles.subtitle}>Cadastro Ambiental Rural — visão geral</p>
        </div>
        <div className={styles.headerBadge}>
          <span className={styles.liveDot}/>
          Dados atualizados
        </div>
      </div>

      {/* Layout assimétrico: coluna esquerda + coluna direita */}
      <div className={styles.layout}>

        {/* Coluna esquerda — métricas empilhadas verticalmente */}
        <div className={styles.leftCol}>

          <div className={styles.metricBlock}>
            <span className={styles.metricNum}>{total}</span>
            <span className={styles.metricLabel}>Produtores</span>
            <div className={styles.metricBar} style={{ background: '#6b7280' }}/>
          </div>

          <div className={styles.metricBlock}>
            <span className={styles.metricNum}>{propriedades.length}</span>
            <span className={styles.metricLabel}>Propriedades</span>
            <div className={styles.metricBar} style={{ background: '#1A6B2A' }}/>
          </div>

          <div className={styles.metricBlock}>
            <span className={styles.metricNum}>{notificacoesEnviadas}</span>
            <span className={styles.metricLabel}>Notificações</span>
            <div className={styles.metricBar} style={{ background: '#3b82f6' }}/>
          </div>

          <div className={`${styles.metricBlock} ${styles.metricHighlight}`}>
            <span className={`${styles.metricNum} ${styles.metricNumGreen}`}>{taxa}%</span>
            <span className={styles.metricLabel}>Regularização</span>
            <div className={styles.metricBar} style={{ background: '#10b981' }}/>
          </div>

          {/* Status compacto */}
          <div className={styles.statusCompact}>
            <span className={styles.statusCompactTitle}>Por status</span>
            {statusGroups.map((s) => (
              <div key={s.key} className={styles.statusLine}>
                <span
                  className={styles.statusLineDot}
                  style={{ background: s.color }}
                />
                <span className={styles.statusLineName}>{s.label}</span>
                <span className={styles.statusLineVal}>{s.value}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Coluna direita — gráficos empilhados */}
        <div className={styles.rightCol}>

          {/* Área de notificações — grande, no topo */}
          <div className={styles.chartBlock}>
            <div className={styles.chartBlockHeader}>
              <span className={styles.chartBlockTitle}>Notificações por mês</span>
              <span className={styles.chartBlockSub}>Jan — Jun 2026</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart
                data={LINE_DATA}
                margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#1A6B2A" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#1A6B2A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false}/>
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9ca3af' }}
                       axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }}
                       axisLine={false} tickLine={false}
                       allowDecimals={false} width={22}/>
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 6,
                    border: '1px solid #e5e7eb', boxShadow: 'none' }}
                  formatter={(v) => [v, 'Notificações']}
                />
                <Area type="monotone" dataKey="notificacoes"
                      stroke="#1A6B2A" strokeWidth={2}
                      fill="url(#grad)"
                      dot={{ fill: '#1A6B2A', r: 3, strokeWidth: 0 }}
                      activeDot={{ fill: '#1A6B2A', r: 5, strokeWidth: 0 }}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Linha divisória */}
          <div className={styles.rowDivider}/>

          {/* Municípios + Taxa lado a lado */}
          <div className={styles.bottomPair}>

            <div className={styles.chartBlock}>
              <div className={styles.chartBlockHeader}>
                <span className={styles.chartBlockTitle}>Municípios</span>
                <span className={styles.chartBlockSub}>top {TOP_MUNICIPIOS.length}</span>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart
                  data={TOP_MUNICIPIOS}
                  margin={{ left: 4, right: 8, top: 4, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false}/>
                  <XAxis dataKey="municipio"
                         tick={{ fontSize: 10, fill: '#374151' }}
                         axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }}
                         axisLine={false} tickLine={false}
                         allowDecimals={false} width={18}/>
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 6,
                      border: '1px solid #e5e7eb', boxShadow: 'none' }}
                    formatter={(v) => [v, 'Propriedades']}
                    cursor={{ fill: '#f0fdf4' }}
                  />
                  <Bar dataKey="count" fill="#1A6B2A"
                       radius={[4, 4, 0, 0]} activeBar={{ fill: '#2E7D3A' }}/>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Taxa de regularização — minimalista */}
            <div className={styles.taxaBlock}>
              <span className={styles.chartBlockTitle}>Regularização</span>
              <div className={styles.taxaCircleWrap}>
                <svg viewBox="0 0 100 100" className={styles.taxaSvg}>
                  <circle cx="50" cy="50" r="38"
                    fill="none" stroke="#f3f4f6" strokeWidth="8"/>
                  <circle cx="50" cy="50" r="38"
                    fill="none" stroke="#1A6B2A" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${taxa * 2.388} 238.8`}
                    transform="rotate(-90 50 50)"/>
                </svg>
                <div className={styles.taxaCenter}>
                  <span className={styles.taxaBig}>{taxa}%</span>
                </div>
              </div>
              <div className={styles.taxaPair}>
                <div className={styles.taxaItem}>
                  <span className={styles.taxaItemNum}>{ativos}</span>
                  <span className={styles.taxaItemLabel}>Regularizados</span>
                </div>
                <div className={styles.taxaItemDivider}/>
                <div className={styles.taxaItem}>
                  <span className={styles.taxaItemNum}>{total - ativos}</span>
                  <span className={styles.taxaItemLabel}>Pendentes</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}
