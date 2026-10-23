import Link from 'next/link'

export default function BookingButton({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <Link href="/?book=1#test-drive" className={className}>
      {children}
    </Link>
  )
}
