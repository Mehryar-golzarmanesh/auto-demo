import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { HomeIcon } from 'lucide-react'
import { getFacets } from '@/lib/car-filters/facets'
import { parseFilters, toQueryString, type CarFilters, type Facets, type RawParams } from '@/lib/car-filters/schema'
import ActiveFilters from '@/components/cars/ActiveFilters'
import CarsResults from '@/components/cars/CarsResults'
import FilterSidebar from '@/components/cars/FilterSidebar'
import SearchBox from '@/components/cars/SearchBox'
import SortSelect from '@/components/cars/SortSelect'
import { ResultsSkeleton, SidebarSkeleton } from '@/components/cars/Skeletons'

export const metadata: Metadata = {
  title: 'نمایشگاه و لیست خودروها | دمو خودرو',
  description: 'موجودی کامل خودروهای سوپراسپرت وارداتی، لوکس و تولید داخل با برگه کارشناسی ۳۶۰ درجه و ضمانت رسمی.',
}

// The sidebar needs the facets, so it waits for them on its own. The rest of the page does not wait.
async function Sidebar({ filters, facets }: { filters: CarFilters; facets: Promise<Facets> }) {
  return (
    // The key restarts the sidebar when the applied filters change in the URL.
    // Search text, sort and page are left out so typing in the search box doesn't wipe unapplied choices.
    <FilterSidebar key={toQueryString({ ...filters, q: '', page: 1, sort: undefined })} filters={filters} facets={await facets} />
  )
}

export default async function CarsPage({ searchParams }: { searchParams: Promise<RawParams> }) {
  const filters = parseFilters(await searchParams)

  // Start the facets query NOW but don't wait for it: the page shell can be sent immediately.
  const facets = getFacets()

  return (
    <main className="mx-auto w-full max-w-[1440px] px-5 pb-14 pt-5 lg:px-12">
      <nav aria-label="راهنمای مسیر" className="mb-3 flex items-center gap-1.5 text-xs text-[#d2c4b6]">
        <Link href="/" className="flex items-center gap-1 hover:text-[#f7ce97]">
          <HomeIcon size={14} /> صفحه اصلی
        </Link>
        <span className="text-[#4e453b]">/</span>
        <span className="font-medium text-[#f7ce97]">نمایشگاه و لیست خودروها</span>
      </nav>

      <header className="flex flex-col justify-between gap-5 rounded-xl bg-[#181c22] p-5 lg:flex-row lg:items-end lg:p-8">
        <div className="max-w-2xl">
          <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#f7ce97]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#f7ce97]" /> SHOWROOM &amp; CURATED INVENTORY
          </p>
          <h1 className="text-3xl font-bold text-white">
            نمایشگاه تخصصی خودروهای <span className="text-[#f7ce97]">دمو خودرو</span>
          </h1>
          <p className="mt-2 text-sm leading-7 text-[#d2c4b6]">
            موجودی کامل انواع خودروهای سوپراسپرت وارداتی، لوکس آلمانی و صفر کیلومتر تولید داخل به همراه برگه کارشناسی ۳۶۰ درجه و ضمانت رسمی شاسی و سلامت.
          </p>
        </div>
        <SearchBox />
      </header>

      <div className="mt-5 flex flex-col justify-between gap-3 rounded-xl bg-[#1c2026]/60 px-5 py-3 md:flex-row md:items-center">
        <Suspense fallback={<div className="h-6" />}>
          <ActiveFilters filters={filters} facets={facets} />
        </Suspense>
        <SortSelect />
      </div>

      <div className="mt-6 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* In RTL the first column sits on the right, so the sidebar is first in the code */}
        <div className="lg:col-span-4 xl:col-span-3">
          <Suspense fallback={<SidebarSkeleton />}>
            <Sidebar filters={filters} facets={facets} />
          </Suspense>
        </div>

        <section id="results" className="scroll-mt-24 lg:col-span-8 xl:col-span-9" aria-label="نتایج">
          {/* key = the filters. A new key makes React show the skeleton immediately while new results load. */}
          <Suspense key={toQueryString(filters)} fallback={<ResultsSkeleton />}>
            <CarsResults filters={filters} />
          </Suspense>
        </section>
      </div>
    </main>
  )
}
