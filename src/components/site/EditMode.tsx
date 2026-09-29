'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { Eye, LogOut, PencilLine, Settings2 } from 'lucide-react'

type Target = { page: string; section: string; rect: DOMRect }

const noop = () => () => {}

const adminUrl = (page: string, section: string) => `/admin/globals/${page}?section=${encodeURIComponent(section)}`

/**
 * Mode édition (réservé à l’équipe connectée) :
 * - la page se rafraîchit à chaque modification enregistrée dans l’administration ;
 * - survoler une section l’encadre, et « Modifier » ouvre exactement cette section.
 */
export function EditMode() {
  const router = useRouter()
  const pathname = usePathname()
  const [target, setTarget] = useState<Target | null>(null)
  const origin = useSyncExternalStore(noop, () => window.location.origin, () => '')
  const inFrame = useSyncExternalStore(noop, () => window.top !== window.self, () => false)

  const update = useCallback((el: Element | null) => {
    const zone = el?.closest<HTMLElement>('[data-edit-section]')
    if (!zone) return setTarget(null)
    setTarget({ page: zone.dataset.editPage!, section: zone.dataset.editSection!, rect: zone.getBoundingClientRect() })
  }, [])

  useEffect(() => {
    let last: Element | null = null
    const onMove = (e: PointerEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (el?.closest('[data-edit-ui]')) return
      last = el
      update(el)
    }
    const onScroll = () => update(last)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [update])

  const edit = (page: string, section: string) => {
    const url = adminUrl(page, section)
    if (inFrame) {
      try {
        // Dans l’aperçu en direct de la même fiche : on change simplement d’onglet.
        if (window.top!.location.pathname === `/admin/globals/${page}`) {
          window.top!.postMessage({ type: 'mkmi:focus-section', section }, window.location.origin)
          return
        }
        window.top!.location.href = url
        return
      } catch {
        /* cadre d’une autre origine : on ouvre dans la fenêtre courante */
      }
    }
    window.location.href = url
  }

  return (
    <>
      {origin && <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={origin} />}

      {target && (
        <div
          data-edit-ui
          className="pointer-events-none fixed z-[60] rounded-lg outline-2 outline-offset-[-2px] outline-gold-400 outline-dashed"
          style={{ top: target.rect.top, left: target.rect.left, width: target.rect.width, height: target.rect.height }}
        >
          <button
            type="button"
            onClick={() => edit(target.page, target.section)}
            className="pointer-events-auto absolute top-2 right-2 inline-flex items-center gap-2 rounded-full bg-gold-400 px-4 py-2 text-xs font-bold text-navy-900 shadow-lg hover:bg-gold-300"
            style={{ top: Math.max(8, 88 - target.rect.top) }}
          >
            <PencilLine className="h-4 w-4" aria-hidden="true" /> Modifier : {target.section}
          </button>
        </div>
      )}

      {!inFrame && (
        <div
          data-edit-ui
          className="fixed bottom-4 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-full bg-navy-950/95 p-1.5 pl-4 text-sm text-white shadow-2xl ring-1 ring-white/15 backdrop-blur"
        >
          <Eye className="h-4 w-4 text-gold-400" aria-hidden="true" />
          <span className="hidden sm:inline">Mode édition : survolez une section puis cliquez sur « Modifier »</span>
          <span className="sm:hidden">Mode édition</span>
          <Link href="/admin" prefetch={false} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 hover:bg-white/10">
            <Settings2 className="h-4 w-4" aria-hidden="true" /> Admin
          </Link>
          <form action="/api/preview/exit" method="post">
            <input type="hidden" name="path" value={pathname} />
            <button type="submit" className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 hover:bg-white/20">
              <LogOut className="h-4 w-4" aria-hidden="true" /> Quitter
            </button>
          </form>
        </div>
      )}
    </>
  )
}
