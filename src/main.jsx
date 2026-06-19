import React from 'react'
import ReactDOM from 'react-dom/client'

function isBooting() {
  return !!document.getElementById('boot-loader')
}

function showBootLoader() {
  const loader = document.getElementById('boot-loader')
  if (loader) {
    loader.hidden = false
    loader.style.display = 'flex'
  }
}

function removeBootLoader() {
  const loader = document.getElementById('boot-loader')
  if (loader) {
    loader.remove()
  }
}

showBootLoader()

function showBootstrapError(error) {
  removeBootLoader()
  const root = document.getElementById('root')
  if (!root) return
  const message = error?.message || String(error || 'Error desconocido')
  root.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;font-family:system-ui,sans-serif;background:#fafafa">
      <div style="max-width:420px;width:100%;background:#fff;border-radius:24px;border:1px solid #e5e7eb;padding:32px;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,.08)">
        <p style="font-size:2rem;margin:0 0 12px">⚠️</p>
        <h1 style="font-weight:800;font-size:1.25rem;margin:0 0 8px">No se pudo cargar LUMORA HOME</h1>
        <p style="color:#6b7280;font-size:.875rem;margin:0 0 16px">Prueba recargar o limpiar los datos locales del navegador.</p>
        <p style="font-size:.75rem;text-align:left;background:#f3f4f6;border-radius:12px;padding:12px;margin:0 0 16px;word-break:break-all;color:#dc2626">${message}</p>
        <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">
          <button type="button" onclick="location.reload()" style="background:linear-gradient(135deg,#E91E7A,#8B5CF6);color:#fff;border:0;font-weight:700;padding:12px 24px;border-radius:12px;cursor:pointer">Recargar</button>
          <button type="button" onclick="Object.keys(localStorage).filter(k=>k.startsWith('matchcolombia_')).forEach(k=>localStorage.removeItem(k));location.reload()" style="border:1px solid #e5e7eb;background:#fff;font-weight:600;padding:12px 24px;border-radius:12px;cursor:pointer">Limpiar datos</button>
        </div>
      </div>
    </div>
  `
}

window.addEventListener('error', (event) => {
  if (isBooting()) showBootstrapError(event.error || event.message)
})

window.addEventListener('unhandledrejection', (event) => {
  if (isBooting()) showBootstrapError(event.reason)
})

const BOOT_TIMEOUT_MS = 25000
const bootTimer = window.setTimeout(() => {
  if (isBooting()) {
    showBootstrapError(new Error('La app tardó demasiado en cargar. Recarga la página o limpia datos locales.'))
  }
}, BOOT_TIMEOUT_MS)

async function boot() {
  try {
    const [{ default: App }, { default: ErrorBoundary }, , { initApi } ] = await Promise.all([
      import('@/App.jsx'),
      import('@/components/ErrorBoundary'),
      import('@/index.css'),
      import('@/api/initApi'),
    ])

    await initApi()

    window.clearTimeout(bootTimer)
    removeBootLoader()

    ReactDOM.createRoot(document.getElementById('root')).render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    )

    import('@/lib/capacitorNative').then(({ initCapacitorNative }) => initCapacitorNative())
    import('@/lib/lazyWithRetry').then(({ clearChunkReloadFlag }) => clearChunkReloadFlag())
  } catch (error) {
    window.clearTimeout(bootTimer)
    showBootstrapError(error)
  }
}

boot()
