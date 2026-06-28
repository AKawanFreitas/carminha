import { useState, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import StatsCards from './components/StatsCards'
import ProdutoresTable from './components/ProdutoresTable'
import ModalLoading from './components/modals/ModalLoading'
import ModalNotificar from './components/modals/ModalNotificar'
import ModalResultado from './components/modals/ModalResultado'
import { produtores as initialData } from './data/produtores'
import ModalEnviando from './components/modals/ModalEnviando'
import TemplatesPage from './components/pages/Templates'
import PropriedadesPage from './components/pages/Propriedades'
import PainelPage from './components/pages/Painel'
import HistoricoMensagensPage from './components/pages/HistoricoMensagens'
import LoginPage from './components/pages/Login'
import styles from './App.module.css'

function defaultSelected(data) {
  return new Set(data.filter((p) => p.status !== 'ativo').map((p) => p.id))
}

const STATUS_POOL = [
  'sem', 'sem', 'sem',
  'pendente', 'pendente', 'pendente',
  'cancelado', 'cancelado',
  'notificado', 'notificado',
  'ativo', 'ativo', 'ativo', 'ativo',
]

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState('produtores')
  const [produtores, setProdutores] = useState([])
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [tableVisible, setTableVisible] = useState(true)
  const [showLoading, setShowLoading] = useState(false)
  const [showNotificar, setShowNotificar] = useState(false)
  const [showEnviando, setShowEnviando] = useState(false)
  const [showResultado, setShowResultado] = useState(false)
  const [notificacoesEnviadas, setNotificacoesEnviadas] = useState(0)

  const handleBuscarITR = () => {
    setTableVisible(false)
    setShowLoading(true)
  }

  const handleLoadingComplete = useCallback(() => {
    setShowLoading(false)
    const randomized = initialData.map((p) => ({
      ...p,
      status: STATUS_POOL[Math.floor(Math.random() * STATUS_POOL.length)],
    })).sort(() => Math.random() - 0.5)
    setProdutores(randomized)
    setSelectedIds(defaultSelected(randomized))
    setShowNotificar(true)
  }, [])

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleToggleAll = (ids) => {
    const allSelected = ids.every((id) => selectedIds.has(id))
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (allSelected) ids.forEach((id) => next.delete(id))
      else ids.forEach((id) => next.add(id))
      return next
    })
  }

  const handleNotificar = () => setShowNotificar(true)

  const handleCloseNotificar = () => {
    setShowNotificar(false)
    setTimeout(() => setTableVisible(true), 50)
  }

  const handleConfirmNotificar = () => {
    setNotificacoesEnviadas((prev) => prev + selectedCount)
    setShowNotificar(false)
    setTimeout(() => setShowEnviando(true), 120)
  }

  const handleEnviandoComplete = () => {
    setShowEnviando(false)
    setTimeout(() => setShowResultado(true), 80)
  }

  const handleCloseResultado = () => {
    setShowResultado(false)
    setTimeout(() => setTableVisible(true), 50)
  }

  const selectedCount = [...selectedIds].filter((id) =>
    produtores.some((p) => p.id === id)
  ).length

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />
  }

  return (
    <>
      <Sidebar activeItem={currentPage} onNavigate={setCurrentPage} onLogout={() => setIsLoggedIn(false)} />

      <main className={styles.main}>
        {currentPage === 'painel' ? (
          <PainelPage produtores={produtores} notificacoesEnviadas={notificacoesEnviadas} />
        ) : currentPage === 'historico' ? (
          <HistoricoMensagensPage notificacoesEnviadas={notificacoesEnviadas} />
        ) : currentPage === 'templates' ? (
          <TemplatesPage />
        ) : currentPage === 'propriedades' ? (
          <PropriedadesPage hasLoaded={produtores.length > 0} />
        ) : (
          <>
            <nav className={styles.breadcrumb}>
              <span>CARminha</span>
              <span className={styles.breadSep}>/</span>
              <span className={styles.breadActive}>Produtores</span>
            </nav>

            <div className={styles.pageHeader}>
              <div>
                <h1 className={styles.pageTitle}>Produtores Rurais</h1>
                <p className={styles.pageSubtitle}>
                  Gerencie os produtores cadastrados na base SICAR e acompanhe o status do CAR.
                </p>
              </div>
              <button className={styles.btnPrimary} onClick={handleBuscarITR}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M6.5 4v5M4 6.5h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                Buscar Produtores via API
              </button>
            </div>

            <StatsCards produtores={produtores} />

            <ProdutoresTable
              produtores={produtores}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onToggleAll={handleToggleAll}
              visible={tableVisible}
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onNotificar={handleNotificar}
            />
          </>
        )}
      </main>

      {showLoading && <ModalLoading onComplete={handleLoadingComplete} />}
      {showEnviando && <ModalEnviando onComplete={handleEnviandoComplete} />}

      {showNotificar && (
        <ModalNotificar
          produtores={produtores}
          selectedIds={selectedIds}
          onClose={handleCloseNotificar}
          onConfirm={handleConfirmNotificar}
        />
      )}

      {showResultado && (
        <ModalResultado
          sentCount={selectedCount}
          onClose={handleCloseResultado}
        />
      )}
    </>
  )
}