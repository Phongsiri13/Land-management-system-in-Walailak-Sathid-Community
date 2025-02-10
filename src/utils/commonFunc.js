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

export function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber) return '';
  const phoneStr = String(phoneNumber); // Ensure it's a string
  return phoneStr.slice(0, 3) + '-' + phoneStr.slice(3, 6) + '-' + phoneStr.slice(6);
}

export function formatIDCARD(ID_CARD) {
  if (!ID_CARD) return '';
  const phoneStr = String(ID_CARD).replace(/\D/g, ''); // Ensure it's a clean numeric string

  if (phoneStr.length < 13) return phoneStr; // Return as is if not enough characters

  return (
    phoneStr.slice(0, 1) + '-' +   // หลักที่ 1
    phoneStr.slice(1, 5) + '-' +  // หลักที่ 2 (2-5 ตัว)
    phoneStr.slice(5, 10) + '-' + // หลักที่ 3 (6-10 ตัว)
    phoneStr.slice(10, 12) + '-' + // หลักที่ 4 (11-12 ตัว)
    phoneStr.slice(12)            // หลักที่ 13 (1 ตัว)
  );
}