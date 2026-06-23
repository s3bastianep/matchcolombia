import React from 'react'
import ReactDOM from 'react-dom/client'
import { importWithRetry } from '@/lib/chunkRetry'
import { preloadCurrentRouteChunk } from '@/lib/preloadRoute'
import { applySiteFavicon } from '@/lib/siteBranding'

applySiteFavicon()

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
  if (!loader) return
  loader.style.transition = 'opacity 0.35s ease'
  loader.style.opacity = '0'
  window.setTimeout(() => loader.remove(), 350)
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
        <h1 style="font-weight:800;font-size:1.25rem;margin:0 0 8px">No se pudo cargar HABIBAR</h1>
        <p style="color:#6b7280;font-size:.875rem;margin:0 0 16px">Prueba recargar o limpiar los datos locales del navegador.</p>
        <p style="font-size:.75rem;text-align:left;background:#f3f4f6;border-radius:12px;padding:12px;margin:0 0 16px;word-break:break-all;color:#dc2626">${message}</p>
        <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">
          <button type="button" onclick="(function(){sessionStorage.removeItem('habibar-chunk-reload');var u=new URL(location.href);u.searchParams.set('_cb',Date.now());location.replace(u);})()" style="background:linear-gradient(135deg,#E91E7A,#8B5CF6);color:#fff;border:0;font-weight:700;padding:12px 24px;border-radius:12px;cursor:pointer">Recargar</button>
          <button type="button" onclick="Object.keys(localStorage).filter(k=>k.startsWith('habibar_')).forEach(k=>localStorage.removeItem(k));location.reload()" style="border:1px solid #e5e7eb;background:#fff;font-weight:600;padding:12px 24px;border-radius:12px;cursor:pointer">Limpiar datos</button>
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

const BOOT_TIMEOUT_MS = 20000

const bootTimer = window.setTimeout(() => {
  if (isBooting()) {
    showBootstrapError(new Error('La app tardó demasiado en cargar. Recarga la página o limpia datos locales.'))
  }
}, BOOT_TIMEOUT_MS)

async function boot() {
  try {
    try {
      if (!sessionStorage.getItem("habibar_storage_migrated")) {
        for (const key of Object.keys(localStorage)) {
          if (key.startsWith("matchcolombia_") || key.startsWith("lumora_")) {
            const next = key.replace(/^matchcolombia_/, "habibar_").replace(/^lumora_/, "habibar_")
            if (!localStorage.getItem(next)) localStorage.setItem(next, localStorage.getItem(key))
            localStorage.removeItem(key)
          }
        }
        sessionStorage.setItem("habibar_storage_migrated", "1")
      }
    } catch {
      /* ignore storage migration errors */
    }

    const routeChunk = preloadCurrentRouteChunk()
    const bootTasks = [
      importWithRetry(() => import("@/App.jsx")),
      importWithRetry(() => import("@/components/ErrorBoundary")),
      import("@/index.css"),
    ]
    if (routeChunk) bootTasks.push(routeChunk)

    const [{ default: App }, { default: ErrorBoundary }] = await Promise.all(bootTasks)

    window.clearTimeout(bootTimer)
    removeBootLoader()

    ReactDOM.createRoot(document.getElementById('root')).render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    )

    import('@/api/apiClient').then(({ ensureApiReady }) => ensureApiReady().catch(() => {}))
    import('@/lib/capacitorNative').then(({ initCapacitorNative }) => initCapacitorNative())
    import('@/lib/chunkRetry').then(({ clearChunkReloadFlag }) => {
      clearChunkReloadFlag()
      const url = new URL(window.location.href)
      if (url.searchParams.has('_cb')) {
        url.searchParams.delete('_cb')
        window.history.replaceState({}, '', url.pathname + url.search + url.hash)
      }
    })
  } catch (error) {
    window.clearTimeout(bootTimer)
    showBootstrapError(error)
  }
}

boot()
