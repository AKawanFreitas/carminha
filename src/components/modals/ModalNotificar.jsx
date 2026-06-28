import { useState, useEffect } from 'react'
import styles from './ModalNotificar.module.css'

const CANAIS = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.534 5.86L.057 23.625a.5.5 0 00.611.668l5.953-1.56A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.944 9.944 0 01-5.09-1.395l-.364-.218-3.535.927.944-3.446-.238-.377A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
    ),
  },
  {
    id: 'sms',
    label: 'SMS',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
        <circle cx="8" cy="10" r="1" />
        <circle cx="12" cy="10" r="1" />
        <circle cx="16" cy="10" r="1" />
      </svg>
    ),
  },
  {
    id: 'email',
    label: 'E-mail',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    ),
  },
  {
    id: 'ligacao',
    label: 'Ligação (Bot)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
      </svg>
    ),
  },
]

const COUNTDOWN_START = 10

export default function ModalNotificar({ produtores, selectedIds, onClose, onConfirm }) {
  const [canais, setCanais] = useState(new Set(['whatsapp']))
  const [countdown, setCountdown] = useState(COUNTDOWN_START)

  const selected = produtores.filter((p) => selectedIds.has(p.id))
  const counts = {
    sem: selected.filter((p) => p.status === 'sem').length,
    pendente: selected.filter((p) => p.status === 'pendente').length,
    cancelado: selected.filter((p) => p.status === 'cancelado').length,
    notificado: selected.filter((p) => p.status === 'notificado').length,
    ativo: selected.filter((p) => p.status === 'ativo').length,
  }

  useEffect(() => {
    if (selected.length === 0) return
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          onConfirm()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const toggleCanal = (id) => {
    setCanais((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        if (next.size === 1) return prev
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* Topo */}
        <div className={styles.top}>
          <div className={styles.topLeft}>
            <span className={styles.tag}>
              {selected.length} produtor{selected.length !== 1 ? 'es' : ''}
            </span>
            <h2 className={styles.title}>Confirmar notificação</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor"
                    strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Breakdown de status em linha */}
        <div className={styles.breakdown}>
          {counts.sem > 0 && (
            <div className={styles.bItem}>
              <span className={`${styles.bDot} ${styles.dotSem}`}/>
              <span className={styles.bLabel}>Sem CAR</span>
              <span className={styles.bNum}>{counts.sem}</span>
            </div>
          )}
          {counts.pendente > 0 && (
            <div className={styles.bItem}>
              <span className={`${styles.bDot} ${styles.dotPendente}`}/>
              <span className={styles.bLabel}>Pendente</span>
              <span className={styles.bNum}>{counts.pendente}</span>
            </div>
          )}
          {counts.cancelado > 0 && (
            <div className={styles.bItem}>
              <span className={`${styles.bDot} ${styles.dotCancelado}`}/>
              <span className={styles.bLabel}>Cancelado</span>
              <span className={styles.bNum}>{counts.cancelado}</span>
            </div>
          )}
          {counts.notificado > 0 && (
            <div className={styles.bItem}>
              <span className={`${styles.bDot} ${styles.dotNotificado}`}/>
              <span className={styles.bLabel}>Notificado</span>
              <span className={styles.bNum}>{counts.notificado}</span>
            </div>
          )}
          {selected.length === 0 && (
            <span className={styles.emptyMsg}>Nenhum produtor selecionado.</span>
          )}
        </div>

        <div className={styles.divider}/>

        {/* Canal de envio — lista vertical */}
        <div className={styles.canalSection}>
          <span className={styles.canalLabel}>Canal de envio</span>
          <div className={styles.canalList}>
            {CANAIS.map((c) => (
              <button
                key={c.id}
                className={`${styles.canalRow} ${canais.has(c.id) ? styles.canalRowActive : ''}`}
                onClick={() => toggleCanal(c.id)}
              >
                <span className={styles.canalIcon}>{c.icon}</span>
                <span className={styles.canalName}>{c.label}</span>
                <span className={`${styles.check} ${canais.has(c.id) ? styles.checkActive : ''}`}>
                  {canais.has(c.id) && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="#fff"
                            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.divider}/>

        {/* Footer — countdown + ações */}
        <div className={styles.footer}>
          {selected.length > 0 && countdown > 0 && (
            <div className={styles.countdownWrap}>
              <div className={styles.countdownTrack}>
                <div className={styles.countdownBar}
                     style={{ width: `${(countdown / 10) * 100}%` }}/>
              </div>
              <span className={styles.countdownNum}>{countdown}s</span>
            </div>
          )}
          <div className={styles.actions}>
            <button className={styles.btnCancel} onClick={onClose}>
              Cancelar
            </button>
            <button
              className={styles.btnConfirm}
              onClick={onConfirm}
              disabled={selected.length === 0}
            >
              Enviar agora
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
