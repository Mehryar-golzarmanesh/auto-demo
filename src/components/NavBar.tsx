import { nav_links } from '@/data'
import { Button } from './ui/button'
import { toPersianNumbers } from '@/lib/utils'
import { Phone } from 'lucide-react'
import Link from 'next/link'
import BookingButton from './BookingButton'

const NavBar = () => {
  return (
    <nav className="bg-[#11141a]">
      <div className="flex justify-between p-5 items-center border-b-[#1b1b1e] border-b-4 max-w-480 mx-auto">
        <div>
          <Link href={'/'}>
            <span className="text-primary text-lg block">دمو خودرو</span>
            <span className="text-[#d2c4b6] text-xs">DEMO KHODRO</span>
          </Link>
        </div>
        <div className="hidden lg:block">
          <ul className="flex gap-5 text-[#d2c4b6] ">
            {nav_links.map((link) => (
              <li key={link.name} className="hover:text-primary">
                <Link href={link.href}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-5">
          <div className="border rounded-xl border-border bg-[#151a20] flex gap-2 items-center px-2 min-h-full text-[#c7baad] text-">
            <Phone className="text-primary" size={20} />
            {toPersianNumbers(0)}
            {toPersianNumbers(9193463658)}
          </div>
          <BookingButton>
            <Button className="min-h-full rounded-xl">درخواست نوبت بازدید</Button>
          </BookingButton>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
