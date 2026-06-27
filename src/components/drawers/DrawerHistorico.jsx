import styles from './DrawerHistorico.module.css'

const STATUS_LABEL = {
  ativo: 'CAR Regular',
  pendente: 'CAR Pendente',
  cancelado: 'Cancelado',
  sem: 'Sem CAR',
}

const STATUS_DOT = {
  ativo: '#10b981',
  pendente: '#f59e0b',
  cancelado: '#9ca3af',
  sem: '#ef4444',
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

function formatDate(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export default function DrawerHistorico({ imovel, onClose }) {
  const active = imovel.declaracoes.find((d) => d.situacao) ?? imovel.declaracoes[0]

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <aside className={styles.drawer}>
        {/* Header */}
        <div className={styles.drawerHeader}>
          <div className={styles.drawerTitleGroup}>
            <h2 className={styles.drawerTitle}>{imovel.nomeimovel}</h2>
            <span className={styles.drawerCode}>
              {imovel.codigoimovel ?? 'Sem código CAR'}
            </span>
          </div>
          <div className={styles.drawerHeaderRight}>
            <StatusBadge status={imovel.statusimovel} />
            <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.drawerBody}>
          {/* Dados principais da declaração ativa */}
          <section className={styles.section}>
            <p className={styles.sectionTitle}>Declaração ativa</p>
            <div className={styles.dataGrid}>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Área total</span>
                <span className={styles.dataValue}>
                  {active.areatotal.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} ha
                </span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Módulos fiscais</span>
                <span className={styles.dataValue}>{imovel.numeromodulosfiscais}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Município</span>
                <span className={styles.dataValue}>{imovel.municipio} · {imovel.uf}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Proprietário</span>
                <span className={styles.dataValue}>{imovel.nomecadastrante}</span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Adesão ao PRA</span>
                <span className={styles.dataValue}>
                  {imovel.aderiupra ? (
                    <span className={styles.praSimBadge}>Sim</span>
                  ) : (
                    <span className={styles.praNaoBadge}>Não</span>
                  )}
                </span>
              </div>
              <div className={styles.dataItem}>
                <span className={styles.dataLabel}>Data de cadastro</span>
                <span className={styles.dataValue}>{formatDate(active.datacriacaoregistro)}</span>
              </div>
            </div>
          </section>

          <div className={styles.divider} />

          {/* Histórico de declarações */}
          <section className={styles.section}>
            <p className={styles.sectionTitle}>Histórico de declarações</p>
            <div className={styles.timeline}>
              {imovel.declaracoes.map((dec, idx) => (
                <div
                  key={dec.codigoversao}
                  className={`${styles.timelineItem} ${dec.situacao ? styles.timelineActive : ''}`}
                >
                  <div className={styles.timelineLeft}>
                    <div
                      className={styles.timelineDot}
                      style={{ background: STATUS_DOT[dec.statusimovel] ?? '#9ca3af' }}
                    />
                    {idx < imovel.declaracoes.length - 1 && (
                      <div className={styles.timelineLine} />
                    )}
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineTop}>
                      <span className={styles.timelineVersion}>{dec.codigoversao}</span>
                      <StatusBadge status={dec.statusimovel} />
                    </div>
                    <div className={styles.timelineMeta}>
                      <span>{dec.nomecadastrante}</span>
                      <span className={styles.timelineSep}>·</span>
                      <span>{formatDate(dec.datacriacaoregistro)}</span>
                    </div>
                    <span className={styles.timelineArea}>
                      {dec.areatotal.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} ha
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </>
  )
}