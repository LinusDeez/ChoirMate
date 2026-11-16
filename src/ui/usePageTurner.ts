import { useCallback, useEffect } from 'react'
import type { RefObject } from 'react'

export type TurnDirection = 'next' | 'previous'

/** Positions can differ by fractions of a pixel after scrolling. */
const TOLERANCE_PX = 1

/** Page-turner foot pedals usually send one of these keys. */
const KEY_DIRECTIONS = new Map<string, TurnDirection>([
  ['PageDown', 'next'],
  ['ArrowRight', 'next'],
  ['PageUp', 'previous'],
  ['ArrowLeft', 'previous'],
])

/**
 * Turns pages by scrolling the window: each turn brings the next or previous
 * row of pages to the top, right below the toolbar. Also handles the keys
 * that page-turner foot pedals send.
 *
 * @param pagesRef Element whose children are the pages
 * @param toolbarRef Sticky toolbar that covers the top of the window
 */
export function usePageTurner(
  pagesRef: RefObject<HTMLElement | null>,
  toolbarRef: RefObject<HTMLElement | null>,
): (direction: TurnDirection) => void {
  const turn = useCallback(
    (direction: TurnDirection) => {
      const container = pagesRef.current
      if (!container) {
        return
      }
      // After scrolling, the toolbar sticks to the top of the window and hides
      // everything above its bottom edge. Use that final position, not the
      // current one: before the first turn, the toolbar is still further down.
      const topEdge = toolbarRef.current?.offsetHeight ?? 0
      // Distance of each page's top from that line. Pages in the same grid
      // row share the same value, so rows need no bookkeeping of their own.
      const offsets = Array.from(
        container.children,
        (page) => page.getBoundingClientRect().top - topEdge,
      )
      const offset =
        direction === 'next'
          ? offsets.find((distance) => distance > TOLERANCE_PX)
          : offsets.findLast((distance) => distance < -TOLERANCE_PX)
      if (offset !== undefined) {
        // Jump instead of animating: during a smooth scroll, a quick second
        // pedal press would measure positions mid-flight
        window.scrollBy({ top: offset, behavior: 'instant' })
      }
    },
    [pagesRef, toolbarRef],
  )

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      // Leave browser shortcuts such as Alt+ArrowLeft (back) alone
      if (event.ctrlKey || event.altKey || event.metaKey) {
        return
      }
      const direction = KEY_DIRECTIONS.get(event.key)
      if (direction === undefined) {
        return
      }
      // Stop the browser's own scrolling for these keys
      event.preventDefault()
      turn(direction)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [turn])

  return turn
}
