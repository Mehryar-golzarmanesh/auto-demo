'use client'

import Link from 'next/link'

export default function BookingButton({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <Link
      href="/?book=1#test-drive"
      className={className}
      onClick={(event) => {
        const params = new URLSearchParams(window.location.search)
        if (
          window.location.pathname !== '/' ||
          window.location.hash !== '#test-drive' ||
          params.get('book') !== '1'
        ) {
          return
        }

        event.preventDefault()
        document.getElementById('test-drive')?.scrollIntoView()
      }}
    >
      {children}
    </Link>
  )
}
