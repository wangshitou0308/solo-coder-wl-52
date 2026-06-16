import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Feather, Loader2 } from 'lucide-react'
import App from './App'
import './index.css'
import { useStore } from './store/useStore'

function Bootstrap() {
  const { init, initialized, loading } = useStore()

  useEffect(() => {
    init()
  }, [init])

  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-parchment-100/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 animate-fade-in">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-ink-700 via-ink-600 to-ink-700 flex items-center justify-center shadow-2xl">
              <Feather className="w-10 h-10 text-parchment-100 animate-float" />
            </div>
            <div className="absolute -inset-2 rounded-3xl bg-ink-400/10 -z-10 blur-xl animate-pulse" />
          </div>
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-ink-800 mb-2">
              书信时光
            </h1>
            <p className="text-sm text-ink-500 mb-4">Letter Memories</p>
            <div className="flex items-center gap-2 text-ink-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">正在载入你的书信记忆...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Bootstrap />
  </StrictMode>,
)
