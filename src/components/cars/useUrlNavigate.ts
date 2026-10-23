'use client'

import { useCallback, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export const setParam = (p: URLSearchParams, key: string, value: string) => {
  if (value) p.set(key, value)
  else p.delete(key)
}

// Every filter control changes the URL through this one hook.
// The URL is the single source of truth; the server page re-renders from it.
export function useUrlNavigate() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const update = useCallback(
    (mutate: (p: URLSearchParams) => void, mode: 'push' | 'replace' = 'push') => {
      const p = new URLSearchParams(searchParams.toString())
      mutate(p)
      p.delete('page') // a new filter always starts from page 1
      const qs = p.toString()
      startTransition(() => {
        router[mode](qs ? `${pathname}?${qs}` : pathname, { scroll: false })
      })
    },
    [router, pathname, searchParams],
  )

  return { update, isPending, searchParams }
}
