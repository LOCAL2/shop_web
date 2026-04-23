'use client'

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'

interface SSEContextType {
  points: number | null
}

const SSEContext = createContext<SSEContextType>({ points: null })

export function SSEProvider({ children, initialPoints }: { children: ReactNode; initialPoints: number | null }) {
  const [points, setPoints] = useState<number | null>(initialPoints)
  const esRef = useRef<EventSource | null>(null)
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (initialPoints === null) return

    function connect() {
      if (esRef.current) esRef.current.close()
      const es = new EventSource('/api/points-stream')
      esRef.current = es

      es.addEventListener('points', (e) => {
        try { setPoints(JSON.parse(e.data).points) } catch {}
      })

      es.onerror = () => {
        es.close()
        esRef.current = null
        retryRef.current = setTimeout(connect, 3000)
      }
    }

    connect()

    return () => {
      esRef.current?.close()
      if (retryRef.current) clearTimeout(retryRef.current)
    }
  }, [])

  return (
    <SSEContext.Provider value={{ points }}>
      {children}
    </SSEContext.Provider>
  )
}

export function useSSE() {
  return useContext(SSEContext)
}

export function showToast(message: string) {
  const el = document.createElement('div')
  el.style.cssText = `
    position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
    background:#0a0a0a; color:#fff; padding:12px 20px; border-radius:14px;
    font-size:14px; font-weight:500; z-index:9999; white-space:nowrap;
    box-shadow:0 8px 24px rgba(0,0,0,0.2);
  `
  el.textContent = message
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 4000)
}
