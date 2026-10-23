// components/BookingButton.tsx
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function BookingButton({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    if (pathname === '/') {
      // Already on homepage — scroll directly
      document.getElementById('main-page-form')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    } else {
      // Navigate to homepage with hash
      router.push('/#main-page-form')
    }
  }

  return (
    <Link href="/#main-page-form" onClick={handleClick} className={className}>
      {children}
    </Link>
  )
}
