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

      <div className={styles.grid}>
        {produtores.length === 0 ? (
          <div className={styles.emptyState}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="19" stroke="#d1d5db" strokeWidth="1.5"/>
              <circle cx="20" cy="20" r="5" stroke="#9ca3af" strokeWidth="1.5"/>
            </svg>
            <p className={styles.emptyTitle}>Nenhum produtor carregado</p>
            <p className={styles.emptySubtitle}>
              Clique em <strong>Buscar Produtores via API</strong> para importar
              os dados do SICAR.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>Nenhum produtor encontrado.</p>
          </div>
        ) : (
          filtered.map((produtor) => {
            const isSelected = selectedIds.has(produtor.id)
            const s = STATUS_MAP[produtor.status]
            const canaisCount = Object.values(produtor.canais ?? {})
              .filter(c => c.disponivel).length
            return (
              <div
                key={produtor.id}
                className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
                onClick={() => setDrawerProdutor(produtor)}
              >
                <div
                  className={styles.cardCheck}
                  onClick={(e) => { e.stopPropagation(); onToggleSelect(produtor.id) }}
                >
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={isSelected}
                    onChange={() => onToggleSelect(produtor.id)}
                  />
                </div>

                <div className={styles.cardTop}>
                  <div className={styles.avatar}>{getInitials(produtor.nome)}</div>
                  <div className={styles.cardInfo}>
                    <span className={styles.cardNome}>{produtor.nome}</span>
                    <span className={styles.cardMunicipio}>
                      {produtor.municipio} · {produtor.uf}
                    </span>
                  </div>
                </div>

                <span className={`${styles.badge} ${s.className}`}>{s.label}</span>

                <div className={styles.cardMeta}>
                  <span className={styles.cardCpf}>{produtor.cpf}</span>
                  <span className={styles.cardCanais}>
                    {canaisCount} canal{canaisCount !== 1 ? 'is' : ''}
                  </span>
                </div>

                {produtor.numeroCar && (
                  <div className={styles.cardCar}>
                    <span className={styles.cardCarLabel}>CAR</span>
                    <span className={styles.cardCarNum}>{produtor.numeroCar}</span>
                  </div>
                )}
              </div>
            )
          })
        )}
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
