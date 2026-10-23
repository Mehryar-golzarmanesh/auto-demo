// 22900000000 -> "بیست و دو میلیارد و نهصد میلیون"
const ones = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه']
const teens = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده']
const tens = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود']
const hundreds = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد']
const scales = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون']

// 0..999 -> words
const threeDigits = (n: number) => {
  const parts: string[] = []
  if (n >= 100) parts.push(hundreds[Math.floor(n / 100)])
  const rest = n % 100
  if (rest >= 10 && rest < 20) parts.push(teens[rest - 10])
  else {
    if (rest >= 20) parts.push(tens[Math.floor(rest / 10)])
    if (rest % 10) parts.push(ones[rest % 10])
  }
  return parts.join(' و ')
}

export function priceInWords(value: number): string {
  let n = Math.floor(value)
  if (!Number.isFinite(n) || n <= 0) return ''

  const groups: string[] = []
  for (let i = 0; n > 0 && i < scales.length; i++) {
    const chunk = n % 1000
    if (chunk) groups.unshift(`${threeDigits(chunk)}${scales[i] ? ' ' + scales[i] : ''}`)
    n = Math.floor(n / 1000)
  }
  return groups.join(' و ')
}
