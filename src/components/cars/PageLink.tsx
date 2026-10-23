'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'

// true  = scroll to the very top of the page
// false = scroll to the start of the results grid (the header and search box stay above the screen)
const SCROLL_TO_PAGE_TOP = false

// A normal <Link> that also scrolls the page smoothly when clicked.
export default function PageLink({ onClick, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      scroll={false} // Next.js would jump instantly, so we scroll ourselves
      onClick={(e) => {
        onClick?.(e)
        // Leave ctrl/cmd/shift/middle-click alone: the visitor wants a new tab
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const behavior: ScrollBehavior = reduceMotion ? 'auto' : 'smooth'
        const target = SCROLL_TO_PAGE_TOP ? null : document.getElementById('results')

        if (target) target.scrollIntoView({ behavior, block: 'start' })
        else window.scrollTo({ top: 0, behavior })
      }}
    />
  )
}
