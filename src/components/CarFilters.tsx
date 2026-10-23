import Link from 'next/link'
import { cn } from '@/lib/utils'
import { carFilters } from './car-filters'
import LinkLabel from './LinkLabel'

interface Props {
  activeKey: string
  basePath: string // the page these buttons live on, e.g. "/"
  className?: string
}

const CarFilters = ({ activeKey, basePath, className }: Props) => (
  <nav
    aria-label="فیلتر خودروها"
    // one scrollable row on phones, wrapping row on larger screens
    className={cn('flex gap-3 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible md:pb-0', className)}
  >
    {carFilters.map((filter) => {
      const isActive = filter.key === activeKey
      const href = filter.key === 'all' ? basePath : `${basePath}?category=${filter.key}`

      return (
        <Link
          key={filter.key}
          href={href}
          scroll={false} // don't jump to the top of the page when filtering
          aria-current={isActive ? 'true' : undefined}
          className={cn(
            'shrink-0 whitespace-nowrap rounded-xl p-3 text-xs transition-colors',
            isActive
              ? 'bg-[#f5c48a] font-semibold text-[#2a1b05]'
              : 'bg-[#1c2026] text-[#d2c4b6] hover:bg-[#252b33] hover:text-white',
          )}
        >
          <LinkLabel>{filter.label}</LinkLabel>
        </Link>
      )
    })}
  </nav>
)

export default CarFilters
