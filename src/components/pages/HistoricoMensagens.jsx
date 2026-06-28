import { useState, useMemo } from 'react'
import styles from './HistoricoMensagens.module.css'

const MOCK_DISPAROS = [
  { id: 1,  dataHora: '27/06/2026 14:32', produtor: 'João Ribeiro da Silva',     canal: 'WhatsApp', status: 'entregue', motivo: null },
  { id: 2,  dataHora: '27/06/2026 14:33', produtor: 'Carlos Eduardo Mendes',      canal: 'E-mail',   status: 'entregue', motivo: null },
  { id: 3,  dataHora: '27/06/2026 14:33', produtor: 'Maria José Ferreira',        canal: 'WhatsApp', status: 'falha',    motivo: 'Número não cadastrado no WhatsApp' },
  { id: 4,  dataHora: '27/06/2026 14:34', produtor: 'Antônio Pereira Neto',       canal: 'SMS',      status: 'entregue', motivo: null },
  { id: 5,  dataHora: '27/06/2026 14:34', produtor: 'Luiza Gomes Teixeira',       canal: 'E-mail',   status: 'entregue', motivo: null },
  { id: 6,  dataHora: '27/06/2026 14:35', produtor: 'Marcos Aurelio Souza',       canal: 'Ligação',  status: 'entregue', motivo: null },
  { id: 7,  dataHora: '27/06/2026 14:35', produtor: 'Fernanda Lima Castro',       canal: 'WhatsApp', status: 'entregue', motivo: null },
  { id: 8,  dataHora: '26/06/2026 09:11', produtor: 'Roberto Carlos Pinto',       canal: 'E-mail',   status: 'falha',    motivo: 'Caixa de e-mail inexistente' },
  { id: 9,  dataHora: '26/06/2026 09:12', produtor: 'Patrícia Alves Moreira',     canal: 'WhatsApp', status: 'entregue', motivo: null },
  { id: 10, dataHora: '26/06/2026 09:13', produtor: 'Diego Henrique Barros',      canal: 'SMS',      status: 'entregue', motivo: null },
  { id: 11, dataHora: '26/06/2026 09:14', produtor: 'Claudia Regina Nascimento',  canal: 'Ligação',  status: 'entregue', motivo: null },
  { id: 12, dataHora: '26/06/2026 09:15', produtor: 'Thiago Augusto Cavalcanti',  canal: 'WhatsApp', status: 'entregue', motivo: null },
  { id: 13, dataHora: '25/06/2026 16:48', produtor: 'Beatriz Santos Corrêa',      canal: 'E-mail',   status: 'entregue', motivo: null },
  { id: 14, dataHora: '25/06/2026 16:49', produtor: 'Wellington de Oliveira',     canal: 'SMS',      status: 'falha',    motivo: 'Número de telefone inválido' },
  { id: 15, dataHora: '25/06/2026 16:50', produtor: 'Rosana Melo Figueiredo',     canal: 'WhatsApp', status: 'entregue', motivo: null },
  { id: 16, dataHora: '25/06/2026 16:51', produtor: 'Eduardo Vieira Magalhães',   canal: 'E-mail',   status: 'entregue', motivo: null },
  { id: 17, dataHora: '24/06/2026 10:22', produtor: 'Simone Andrade Rocha',       canal: 'WhatsApp', status: 'entregue', motivo: null },
  { id: 18, dataHora: '24/06/2026 10:23', produtor: 'Alexandre Costa Ramos',      canal: 'Ligação',  status: 'falha',    motivo: 'Timeout na conexão com o servidor' },
  { id: 19, dataHora: '24/06/2026 10:24', produtor: 'Gabriela Freitas Monteiro',  canal: 'SMS',      status: 'entregue', motivo: null },
  { id: 20, dataHora: '24/06/2026 10:25', produtor: 'Leonardo Cunha Barbosa',     canal: 'E-mail',   status: 'entregue', motivo: null },
]

const CANAL_CLASS = {
  WhatsApp: styles.canalWhatsapp,
  SMS:      styles.canalSms,
  'E-mail': styles.canalEmail,
  Ligação:  styles.canalLigacao,
}

function EmptyState() {
  return (
    <div className={styles.emptyWrap}>
      <div className={styles.emptyState}>
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <path
            d="M6 8A2 2 0 018 6h28a2 2 0 012 2v22a2 2 0 01-2 2H24l-8 6v-6H8a2 2 0 01-2-2V8z"
            stroke="#d1d5db"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <line x1="13" y1="16" x2="31" y2="16" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="13" y1="22" x2="24" y2="22" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <p className={styles.emptyTitle}>Nenhum disparo realizado ainda</p>
        <p className={styles.emptySubtitle}>
          Os registros aparecerão aqui após o primeiro envio de notificações.
        </p>
      </div>
    </div>
  )
}

export default function HistoricoMensagensPage({ notificacoesEnviadas }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [canalFilter, setCanalFilter] = useState('todos')

  const filtered = useMemo(() => {
    const term = search.toLowerCase()
    return MOCK_DISPAROS.filter((d) => {
      const matchSearch =
        !term ||
        d.produtor.toLowerCase().includes(term) ||
        d.canal.toLowerCase().includes(term)
      const matchStatus = statusFilter === 'todos' || d.status === statusFilter
      const matchCanal = canalFilter === 'todos' || d.canal === canalFilter
      return matchSearch && matchStatus && matchCanal
    })
  }, [search, statusFilter, canalFilter])

  if (!notificacoesEnviadas) return <EmptyState />

  const totalDisparos = MOCK_DISPAROS.length
  const entregues = MOCK_DISPAROS.filter((d) => d.status === 'entregue').length
  const falhas = MOCK_DISPAROS.filter((d) => d.status === 'falha').length

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Histórico de Mensagens</h1>
        <p className={styles.pageSubtitle}>Acompanhe todos os disparos de notificação realizados.</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statBorder} style={{ background: '#6b7280' }}/>
          <span className={styles.statLabel}>Total de disparos</span>
          <span className={styles.statValue}>{totalDisparos}</span>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statBorder} style={{ background: '#10b981' }}/>
          <span className={styles.statLabel}>Entregues com sucesso</span>
          <span className={styles.statValue}>{entregues}</span>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statBorder} style={{ background: '#ef4444' }}/>
          <span className={styles.statLabel}>Falhas no envio</span>
          <span className={styles.statValue}>{falhas}</span>
        </div>
      </div>

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
              placeholder="Buscar por produtor ou canal..."
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
            <option value="entregue">Entregue</option>
            <option value="falha">Falha</option>
          </select>
          <select
            className={styles.filterSelect}
            value={canalFilter}
            onChange={(e) => setCanalFilter(e.target.value)}
          >
            <option value="todos">Todos os canais</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="SMS">SMS</option>
            <option value="E-mail">E-mail</option>
            <option value="Ligação">Ligação</option>
          </select>
        </div>
      </div>

      <div className={styles.grid}>
        {filtered.length === 0 ? (
          <div className={styles.emptyRow}>Nenhum registro encontrado.</div>
        ) : (
          filtered.map((d) => (
            <div
              key={d.id}
              className={`${styles.card} ${d.status === 'falha' ? styles.cardFalha : ''}`}
            >
              <div className={styles.cardTop}>
                <span className={`${styles.canalBadge} ${CANAL_CLASS[d.canal]}`}>
                  {d.canal}
                </span>
                {d.status === 'entregue' ? (
                  <span className={`${styles.badge} ${styles.badgeEntregue}`}>
                    Entregue
                  </span>
                ) : (
                  <span className={`${styles.badge} ${styles.badgeFalha}`}>
                    Falha
                  </span>
                )}
              </div>

              <div className={styles.cardProdutor}>{d.produtor}</div>

              <div className={styles.cardData}>{d.dataHora}</div>

              {d.motivo && (
                <div className={styles.cardMotivo}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1l7 13H1L8 1z" fill="#fee2e2" stroke="#b91c1c"
                          strokeWidth="1.2" strokeLinejoin="round"/>
                    <line x1="8" y1="6" x2="8" y2="9.5" stroke="#b91c1c"
                          strokeWidth="1.3" strokeLinecap="round"/>
                    <circle cx="8" cy="11.5" r="0.8" fill="#b91c1c"/>
                  </svg>
                  {d.motivo}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className={styles.tableFooter}>
        Exibindo {filtered.length} de {MOCK_DISPAROS.length} registros
      </div>
    </>
  )
}
