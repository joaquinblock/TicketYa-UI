import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export function useMobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const { pathname } = useLocation()
  const [lastPathname, setLastPathname] = useState(pathname)

  // Al cambiar de ruta el menú se cierra (se ajusta durante el render, sin un efecto extra).
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setIsOpen(false)
  }

  useEffect(() => {
    if (!isOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [isOpen])

  return {
    isOpen,
    toggle: () => setIsOpen((wasOpen) => !wasOpen),
    close: () => setIsOpen(false),
  }
}
