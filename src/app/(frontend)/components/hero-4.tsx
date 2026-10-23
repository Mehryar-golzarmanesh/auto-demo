import { toPersianNumbers } from '@/lib/utils'
import { CheckCheck, Medal, Wallet } from 'lucide-react'

const HeroFour = () => {
  return (
    <div className="bg-[#10141a] py-10 mt-10 px-10 2xl:px-0">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-3 items-center justify-center mx-auto">
          <p className="text-xs text-gold">تعهد و تضمین شفافیت</p>
          <h2 className="text-3xl font-bold text-[#dfe2eb]">
            چرا خریداران خاص «دمو خودرو» را انتخاب می‌کنند؟
          </h2>
          <p className="text-xs text-[#d2c4b6]">
            ما استانداردهای معامله خودرو را در کشور بازتعریف کرده‌ایم؛ بدون واسطه، با کارشناسی معتبر
            حقوقی و تعهد بدون قید و شرط.
          </p>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 pt-10">
          <div className="flex flex-col gap-3 w-full bg-[#181c22] p-5 rounded-xl">
            <div className="bg-[#3e3a34] rounded-2xl p-3 w-fit">
              <CheckCheck className="text-gold" size={30} />
            </div>
            <p className="text-gold text-xs">استاندارد بازرسی ۲۱۰ آیتمی</p>
            <h4 className="font-bold text-[#dfe2eb]">کارشناسی تخصصی رنگ، بدنه و دیاگ</h4>
            <p className="text-xs text-[#d2c4b6] leading-6">
              تمامی خودروها قبل از ورود به نمایشگاه توسط مهندسین مجرب با پیشرفته‌ترین دستگاه‌های
              ضخامت‌سنج دیجیتال و دیاگ اختصاصی بررسی شده و برگه ضمانت کتبی بدون ابهام صادر می‌شود.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full bg-[#181c22] p-5 rounded-xl">
            <div className="bg-[#3e3a34] rounded-2xl p-3 w-fit">
              <Medal className="text-gold" size={30} />
            </div>
            <p className="text-gold text-xs">تضمین بازگشت وجه</p>
            <h4 className="font-bold text-[#dfe2eb]">گارانتی طلایی و استرداد ۴۸ ساعته</h4>
            <p className="text-xs text-[#d2c4b6] leading-6">
              در صورت وجود هرگونه مغایرت فنی یا بدنه با برگه کارشناسی ارائه شده توسط مجموعه دمو
              خودرو، تا ۴۸ ساعت امکان عودت کامل خودرو و استرداد بی‌قید و شرط کل مبلغ معامله فراهم
              است.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full bg-[#181c22] p-5 rounded-xl">
            <div className="bg-[#3e3a34] rounded-2xl p-3 w-fit">
              <Wallet className="text-gold" size={30} />
            </div>
            <p className="text-gold text-xs">انعطاف در پرداخت</p>
            <h4 className="font-bold text-[#dfe2eb]">تسهیلات اقساطی منعطف و تهاتر ملک</h4>
            <p className="text-xs text-[#d2c4b6] leading-6">
              امکان خرید اقساطی برای انواع خودروهای لوکس و تولید داخل با چک صیادی و اقساط ۶ الی ۳۶
              ماهه بدون نیاز به ضامن، همراه با امکان تهاتر با املاک ارزنده در مناطق ۱ تا ۳ تهران.
            </p>
          </div>
        </div>
        <div className="w-full grid grid-cols-2 gap-5 lg:grid-cols-4 bg-[#1d2127] p-10 rounded-3xl mt-10">
          <div className="flex flex-col gap-3">
            <p className="text-3xl font-bold text-gold mx-auto ">+{toPersianNumbers(12)}</p>
            <p className="mx-auto">سال سابقه درخشان در پایتخت</p>
          </div>
          <div className="flex flex-col gap-3 ">
            <p className="text-3xl font-bold text-gold mx-auto ">+{toPersianNumbers('4,800')}</p>
            <p className="mx-auto">خودروی تحویل شده بدون شکایت</p>
          </div>
          <div className="flex flex-col gap-3 ">
            <p className="text-3xl font-bold text-gold mx-auto ">{toPersianNumbers(210)}</p>
            <p className="mx-auto">نقطه بازرسی دقیق شاسی و موتور</p>
          </div>
          <div className="flex flex-col gap-3 ">
            <p className="text-3xl font-bold text-gold mx-auto ">{toPersianNumbers(100)}%</p>
            <p className="mx-auto">رضایت مشتریان و خریداران VIP</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroFour
