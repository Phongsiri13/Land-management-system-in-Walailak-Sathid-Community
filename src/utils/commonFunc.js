export function convertToThaiDate(date) {
  if (!date) return '' // ถ้าไม่มีค่า ให้คืนค่าเป็น string ว่าง

  const thaiDate = new Date(date)

  // ตรวจสอบว่าค่าวันที่ถูกต้องหรือไม่
  if (isNaN(thaiDate)) return 'Invalid Date'

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Bangkok'
  }

  return thaiDate.toLocaleDateString('th-TH', options)
}

