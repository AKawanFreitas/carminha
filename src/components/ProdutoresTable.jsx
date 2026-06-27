import { useState } from 'react'
import DrawerProdutor from './drawers/DrawerProdutor'
import styles from './ProdutoresTable.module.css'

const STATUS_MAP = {
  ativo: { label: 'CAR Regular', className: styles.badgeAtivo },
  pendente: { label: 'CAR Pendente', className: styles.badgePendente },
  sem: { label: 'Sem CAR', className: styles.badgeSem },
  cancelado: { label: 'Cancelado', className: styles.badgeCancelado },
  notificado: { label: 'CAR com Notificação', className: styles.badgeNotificado },
}

function getInitials(nome) {
  const parts = nome.trim().split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function ProdutoresTable({
  produtores,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  visible,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  onNotificar,
}) {
  const [drawerProdutor, setDrawerProdutor] = useState(null)
  const STATUS_ORDER = { sem: 0, pendente: 1, cancelado: 2, notificado: 3, ativo: 4 }

  const filtered = produtores
    .filter((p) => {
      const term = search.toLowerCase()
      const matchSearch =
        !term ||
        p.nome.toLowerCase().includes(term) ||
        p.cpf.includes(term) ||
        p.municipio.toLowerCase().includes(term)
      const matchStatus = statusFilter === 'todos' || p.status === statusFilter
      return matchSearch && matchStatus
    })
    .sort((a, b) => (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99))

  const allSelected =
    filtered.length > 0 && filtered.every((p) => selectedIds.has(p.id))
  const someSelected = filtered.some((p) => selectedIds.has(p.id))

  const selectedCount = filtered.filter((p) => selectedIds.has(p.id)).length

  return (
    <div className={`${styles.wrapper} ${visible ? styles.visible : styles.hidden}`}>
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
              placeholder="Buscar por nome, CPF ou município..."
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
            <option value="notificado">CAR com Notificação</option>
            <option value="ativo">CAR Regular</option>
          </select>
        </div>
        <div className={styles.toolbarRight}>
          {selectedCount > 0 && (
            <span className={styles.selectedCount}>
              {selectedCount} selecionado{selectedCount !== 1 ? 's' : ''}
            </span>
          )}
          <button className={styles.btnOutline} onClick={onNotificar}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a5 5 0 015 5v3l1 2H2l1-2V6a5 5 0 015-5z" opacity="0.85" />
              <path d="M6.5 13a1.5 1.5 0 003 0" />
            </svg>
            Notificar Produtores
          </button>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thCheck}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={allSelected}
                  ref={(el) => { if (el) el.indeterminate = !allSelected && someSelected }}
                  onChange={() => onToggleAll(filtered.map((p) => p.id))}
                />
              </th>
              <th>Produtor</th>
              <th>CPF</th>
              <th>Município</th>
              <th>Status</th>
              <th className={styles.thAction} />
            </tr>
          </thead>
          <tbody>
            {produtores.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyRow}>
                  <div className={styles.emptyState}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <circle cx="20" cy="20" r="19" stroke="#d1d5db" strokeWidth="1.5" />
                      <path d="M20 10v2M20 28v2M10 20h2M28 20h2" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="20" cy="20" r="5" stroke="#9ca3af" strokeWidth="1.5" />
                      <path d="M14 14l2 2M24 24l2 2M24 14l-2 2M16 24l-2 2" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    <p className={styles.emptyTitle}>Nenhum produtor carregado</p>
                    <p className={styles.emptySubtitle}>Clique em <strong>Buscar Produtores via API</strong> para importar os dados do SICAR.</p>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyRow}>
                  Nenhum produtor encontrado.
                </td>
              </tr>
            ) : (
              filtered.map((produtor) => (
                <tr
                  key={produtor.id}
                  className={`${styles.row} ${selectedIds.has(produtor.id) ? styles.rowSelected : ''}`}
                  onClick={() => setDrawerProdutor(produtor)}
                >
                  <td className={styles.tdCheck} onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={selectedIds.has(produtor.id)}
                      onChange={() => onToggleSelect(produtor.id)}
                    />
                  </td>
                  <td>
                    <div className={styles.produtorCell}>
                      <div className={styles.avatar}>{getInitials(produtor.nome)}</div>
                      <span className={styles.produtorNome}>{produtor.nome}</span>
                    </div>
                  </td>
                  <td className={styles.cpf}>{produtor.cpf}</td>
                  <td className={styles.municipio}>
                    {produtor.municipio}
                    <span className={styles.uf}> · {produtor.uf}</span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${STATUS_MAP[produtor.status].className}`}>
                      {STATUS_MAP[produtor.status].label}
                    </span>
                  </td>
                  <td className={styles.tdAction}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 4l4 4-4 4" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className={styles.tableFooter}>
        Exibindo {filtered.length} de {produtores.length} produtores
      </div>

      {drawerProdutor && (
        <DrawerProdutor
          produtor={drawerProdutor}
          onClose={() => setDrawerProdutor(null)}
        />
      )}
    </div>
  )
}
