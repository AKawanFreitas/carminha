import { useState } from 'react'
import styles from './Login.module.css'

function EyeOpenIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

export default function Login({ onLogin }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (user === 'admin' && pass === 'admin') {
      setError('')
      onLogin()
    } else {
      setError('Usuário ou senha incorretos.')
    }
  }

  const clearError = () => { if (error) setError('') }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cardLogo}>
          <img src="/carminha.png" alt="CARminha" className={styles.logoImg} />
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>Bem-vindo de volta</h1>
            <p className={styles.formSubtitle}>Acesse sua conta para continuar.</p>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>E-mail ou usuário</label>
            <input
              className={styles.input}
              type="text"
              value={user}
              onChange={(e) => { setUser(e.target.value); clearError() }}
              placeholder="admin"
              autoComplete="username"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Senha</label>
            <div className={styles.passWrap}>
              <input
                className={styles.input}
                type={showPass ? 'text' : 'password'}
                value={pass}
                onChange={(e) => { setPass(e.target.value); clearError() }}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPass((v) => !v)}
                tabIndex={-1}
                aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPass ? <EyeOffIcon /> : <EyeOpenIcon />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.btnPrimary}>Entrar</button>

          {error && <p className={styles.errorMsg}>{error}</p>}

          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>ou</span>
            <span className={styles.dividerLine} />
          </div>

          <button type="button" className={styles.btnGov}>
            Entrar com
            <img src="/logo-gov.png" alt="Gov.br" className={styles.govLogo} />
          </button>
        </form>
      </div>

      <span className={styles.footer}>v2.4.1 · SICAR · 2025</span>
    </div>
  )
}
