'use client'

import { useLinkStatus } from 'next/link'
import { cn } from '@/lib/utils'

// Must be rendered INSIDE a <Link>: useLinkStatus reports on the nearest parent link.
const LinkLabel = ({ children }: { children: React.ReactNode }) => {
  const { pending } = useLinkStatus()

  return <span className={cn(pending && 'animate-pulse opacity-70')}>{children}</span>
}

export default LinkLabel
