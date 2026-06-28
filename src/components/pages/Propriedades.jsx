import { useState } from 'react'
import { propriedades } from '../../data/propriedades'
import DrawerHistorico from '../drawers/DrawerHistorico'
import styles from './Propriedades.module.css'

const STATUS_LABEL = {
  ativo: 'CAR Regular',
  pendente: 'CAR Pendente',
  cancelado: 'Cancelado',
  sem: 'Sem CAR',
}

function StatusBadge({ status }) {
  const map = {
    ativo: styles.badgeAtivo,
    pendente: styles.badgePendente,
    cancelado: styles.badgeCancelado,
    sem: styles.badgeSem,
  }
  return (
    <span className={`${styles.badge} ${map[status] ?? ''}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  )
}

function EmptyState() {
  return (
    <div className={styles.emptyWrap}>
      <div className={styles.emptyState}>
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <rect x="6" y="10" width="32" height="28" rx="2" stroke="#d1d5db" strokeWidth="1.5" />
          <path d="M6 17h32" stroke="#d1d5db" strokeWidth="1.5" />
          <path d="M15 10V6M29 10V6" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="22" cy="28" r="5" stroke="#9ca3af" strokeWidth="1.2" />
          <path d="M22 24v4l2.5 2.5" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <p className={styles.emptyTitle}>Nenhuma propriedade carregada</p>
        <p className={styles.emptySubtitle}>
          Acesse <strong>Produtores</strong> e clique em{' '}
          <strong>Buscar Produtores via API</strong> para importar os dados.
        </p>
      </div>
    </div>
  )
}

const STAT_CARDS = [
  {
    key: 'total',
    label: 'Total de Propriedades',
    dotColor: '#6b7280',
    getValue: (p) => p.length,
  },
  {
    key: 'ativo',
    label: 'CAR Regular',
    dotColor: '#10b981',
    getValue: (p) => p.filter((x) => x.statusimovel === 'ativo').length,
  },
  {
    key: 'irr',
    label: 'Pendente / Cancelado',
    dotColor: '#f59e0b',
    getValue: (p) =>
      p.filter((x) => x.statusimovel === 'pendente' || x.statusimovel === 'cancelado').length,
  },
  {
    key: 'pra',
    label: 'Aderentes ao PRA',
    dotColor: '#3b82f6',
    getValue: (p) => p.filter((x) => x.aderiupra).length,
  },
]

export default function PropriedadesPage({ hasLoaded }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [praFilter, setPraFilter] = useState('todos')
  const [selectedImovel, setSelectedImovel] = useState(null)

  if (!hasLoaded) return <EmptyState />

  const filtered = propriedades.filter((p) => {
    const term = search.toLowerCase()
    const matchSearch =
      !term ||
      p.nomeimovel.toLowerCase().includes(term) ||
      (p.codigoimovel ?? '').toLowerCase().includes(term) ||
      p.municipio.toLowerCase().includes(term) ||
      p.nomecadastrante.toLowerCase().includes(term)
    const matchStatus = statusFilter === 'todos' || p.statusimovel === statusFilter
    const matchPra =
      praFilter === 'todos' ||
      (praFilter === 'sim' && p.aderiupra) ||
      (praFilter === 'nao' && !p.aderiupra)
    return matchSearch && matchStatus && matchPra
  })

  return (
    <>
      <nav className={styles.breadcrumb}>
        <span>CARminha</span>
        <span className={styles.breadSep}>/</span>
        <span className={styles.breadActive}>Propriedades</span>
      </nav>

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Propriedades Rurais</h1>
        <p className={styles.pageSubtitle}>
          Visualize as propriedades vinculadas aos produtores carregados via API SICAR.
        </p>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {STAT_CARDS.map((card) => (
          <div key={card.key} className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statDot} style={{ background: card.dotColor }} />
              <span className={styles.statLabel}>{card.label}</span>
            </div>
            <span className={styles.statValue}>{card.getValue(propriedades)}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} width="15" height="15" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="#9ca3af" strokeWidth="1.5" />
              <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Buscar por nome, código CAR, município ou proprietário..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="todos">Todos os status</option>
            <option value="sem">Sem CAR</option>
            <option value="pendente">CAR Pendente</option>
            <option value="cancelado">Cancelado</option>
            <option value="ativo">CAR Regular</option>
          </select>
          <select
            className={styles.filterSelect}
            value={praFilter}
            onChange={(e) => setPraFilter(e.target.value)}
          >
            <option value="todos">Adesão ao PRA</option>
            <option value="sim">Aderente</option>
            <option value="nao">Não aderente</option>
          </select>
        </div>
      </div>

      <div className={styles.grid}>
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>Nenhuma propriedade encontrada.</p>
          </div>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              className={styles.card}
              onClick={() => setSelectedImovel(p)}
            >
              <div className={styles.cardTop}>
                <StatusBadge status={p.statusimovel} />
                {p.aderiupra && (
                  <span className={styles.praBadge}>PRA</span>
                )}
              </div>

              <div className={styles.cardNome}>{p.nomeimovel}</div>

              <div className={styles.cardProprietario}>{p.nomecadastrante}</div>

              {p.codigoimovel && (
                <div className={styles.cardCar}>
                  <span className={styles.cardCarLabel}>CAR</span>
                  <span className={styles.cardCarNum}>{p.codigoimovel}</span>
                </div>
              )}

              <div className={styles.cardFooter}>
                <span className={styles.cardMunicipio}>
                  {p.municipio} · {p.uf}
                </span>
                <span className={styles.cardArea}>
                  {p.areatotalimovel.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} ha
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.tableFooter}>
        Exibindo {filtered.length} de {propriedades.length} propriedades
      </div>

      {selectedImovel && (
        <DrawerHistorico
          imovel={selectedImovel}
          onClose={() => setSelectedImovel(null)}
        />
      )}
    </>
  )
}