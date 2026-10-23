'use client'

import { useEffect, useRef, useState } from 'react'
import { SearchIcon, XIcon } from 'lucide-react'
import { setParam, useUrlNavigate } from './useUrlNavigate'

export default function SearchBox() {
  const { update, searchParams } = useUrlNavigate()
  const urlQ = searchParams.get('q') ?? ''
  const [value, setValue] = useState(urlQ)
  const lastPushed = useRef(urlQ) // the last value WE put in the URL

  // The URL changed from outside (e.g. a filter chip was removed): mirror it in the input.
  useEffect(() => {
    if (urlQ !== lastPushed.current) {
      lastPushed.current = urlQ
      setValue(urlQ)
    }
  }, [urlQ])

  // Debounce: wait until the visitor stops typing for 400ms before changing the URL.
  useEffect(() => {
    const next = value.trim()
    if (next === lastPushed.current) return
    const id = setTimeout(() => {
      lastPushed.current = next
      update((p) => setParam(p, 'q', next), 'replace') // replace: typing shouldn't fill the back-button history
    }, 400)
    return () => clearTimeout(id)
  }, [value, update])

  return (
    <div className="w-full lg:w-[420px] shrink-0">
      <label htmlFor="car-search" className="mb-1.5 block text-xs text-[#d2c4b6]">
        جستجوی بلادرنگ در انبار
      </label>
      <div className="relative flex items-center">
        <SearchIcon size={18} className="pointer-events-none absolute start-3.5 text-[#f7ce97]" aria-hidden />
        <input
          id="car-search"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="جستجو در مدل، برند، رنگ یا سال (مثلاً: پورشه ۲۰۲۳)"
          className="w-full rounded-xl bg-[#31353c]/80 py-3 ps-11 pe-10 text-sm text-[#dfe2eb] placeholder:text-[#d2c4b6]/60 focus:bg-[#262a31] focus:outline-none"
        />
        {value && (
          <button
            type="button"
            aria-label="پاک کردن جستجو"
            onClick={() => setValue('')}
            className="absolute end-3 text-[#d2c4b6] hover:text-[#f7ce97]"
          >
            <XIcon size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
