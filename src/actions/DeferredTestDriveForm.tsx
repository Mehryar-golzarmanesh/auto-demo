'use client'

import { useEffect, useRef, useState, type ComponentType } from 'react'

interface Props {
  cars: { id: number; label: string }[]
  defaultCarId?: number
  eager?: boolean
}

export default function DeferredTestDriveForm(props: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [Form, setForm] = useState<ComponentType<Props> | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const loadForm = () => {
      void import('./TestDriveForm').then(({ default: TestDriveForm }) => {
        setForm(() => TestDriveForm)
      })
    }

    if (props.eager) {
      loadForm()
      return
    }

    if (container.getBoundingClientRect().top <= window.innerHeight + 400) {
      loadForm()
      return
    }

    if (!('IntersectionObserver' in window)) {
      loadForm()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadForm()
          observer.disconnect()
        }
      },
      { rootMargin: '400px' },
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef}>
      {Form ? (
        <Form {...props} />
      ) : (
        <div aria-hidden className="h-[248px] animate-pulse rounded-xl bg-[#0b0d12] md:h-32" />
      )}
    </div>
  )
}
