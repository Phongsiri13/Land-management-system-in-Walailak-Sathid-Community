// src/utils.js
export function nganToRai(ngan) {
  return ngan / 4
}

function parseFloatFormInput(value) {
  let num = parseFloat(value)
  return isNaN(num) || num <= 0 ? 0 : num // Return number (not string) and default to 0 for invalid values
}

// return total squarewa
export function calculateLandArea(raiV, nganV, squareWaV) {
  // ตรวจสอบค่าให้เป็นตัวเลข และแทนที่ "" หรือค่า null ด้วย 0
  let rai = raiV ? parseFloat(raiV) : 0 // แปลงไร่เป็น float
  let ngan = nganV ? parseFloat(nganV) : 0 // แปลงงานเป็น float
  let squareWa = squareWaV ? parseFloat(squareWaV) : 0 // แปลงตารางวาเป็น float

  // คำนวณพื้นที่ทั้งหมดเป็น "ตารางวา"
  let totalSquareWa = rai * 400 + ngan * 100 + squareWa

  console.log('Total Square Wa:', totalSquareWa) // แสดงค่าทั้งหมดในตารางวา

  // ตรวจสอบหากเกิน 5 ไร่ (2000 ตารางวา)
  if (totalSquareWa > 2000) {
    return false
  }

  // แปลงตารางวาเป็นงาน (100 ตารางวา = 1 งาน)
  if (squareWa >= 100) {
    ngan += Math.floor(squareWa / 100)
    squareWa = squareWa % 100
  }

  // แปลงงานเป็นไร่ (4 งาน = 1 ไร่)
  if (ngan >= 4) {
    rai += Math.floor(ngan / 4)
    ngan = ngan % 4
  }

  // ตรวจสอบหากเกิน 5 ไร่
  if (rai > 5) {
    return false
  }
  // total squareWa
  return { rai, ngan, squareWa, totalSquareWa }
}

export function calTotalLandArea(raiV, nganV, squareWaV) {
  // ตรวจสอบค่าให้เป็นตัวเลข และแทนที่ "" หรือค่า null ด้วย 0
  let rai = raiV ? parseFloat(raiV) : 0 // Parse as float, handle decimals if needed
  let ngan = parseFloatFormInput(nganV)
  let squareWa = parseFloatFormInput(squareWaV)
  let totalRai = rai + nganV / 4 + squareWa / 400
  return totalRai
}

// return rai Ngan wa
export function convertSquareWaToRaiNganWa(totalSquareWa) {
  if (!totalSquareWa || totalSquareWa < 0) return { rai: 0, ngan: 0, squareWa: 0 }

  // แปลงตารางวาเป็นไร่ งาน และตารางวาส่วนที่เหลือ
  let rai = Math.floor(totalSquareWa / 400) // 1 ไร่ = 400 ตารางวา
  let remainingSquareWa = totalSquareWa % 400

  let ngan = Math.floor(remainingSquareWa / 100) // 1 งาน = 100 ตารางวา
  let squareWa = remainingSquareWa % 100 // ตารางวาส่วนที่เหลือ

  return { rai, ngan, squareWa }

  // ทดสอบฟังก์ชัน
  // console.log(convertSquareWaToRaiNganWa(1532));
  // Output: { rai: 3, ngan: 1, squareWa: 32 }
}
