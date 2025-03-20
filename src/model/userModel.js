import * as yup from 'yup'

// for edit
export const userEditSchema = yup.object({
  username: yup
    .string()
    .min(8, 'ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 8 ตัวอักษร')
    .max(30, 'ชื่อผู้ใช้ต้องมีความยาวไม่เกิน 30 ตัวอักษร')
    .matches(
      /^[A-Za-z]{4}[A-Za-z0-9]*$/,
      'ชื่อผู้ใช้ต้องขึ้นต้นด้วยตัวอักษรภาษาอังกฤษ 4 ตัว และตามด้วยตัวอักษรหรือตัวเลข'
    )
    .required('กรุณากรอกชื่อผู้ใช้')
    .label('ชื่อผู้ใช้'),

  password: yup
    .string()
    .nullable()
    .notRequired()
    .test(
      'password-validation',
      'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร และมีทั้งตัวอักษรภาษาอังกฤษและตัวเลข',
      (value) => {
        if (!value) return true // ถ้าเป็นค่าว่าง ให้ผ่านการตรวจสอบ
        return (
          value.length >= 8 &&
          value.length <= 30 &&
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(value)
        )
      }
    )
    .label('รหัสผ่าน'),

  confirm_password: yup
    .string()
    .nullable()
    .notRequired()
    .test('confirm-password-validation', 'รหัสผ่านยืนยันไม่ตรงกัน', function (value) {
      const { password } = this.parent
      if (!password) return true // ถ้า password เป็นค่าว่าง ให้ confirm_password ผ่านได้
      return value === password
    })
    .label('ยืนยันรหัสผ่าน'),

  user_prefix: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? null : value)) // แปลง "" เป็น null
    .nullable()
    .integer('คำนำหน้าชื่อต้องเป็นตัวเลขจำนวนเต็ม')
    .max(4, 'คำนำหน้าชื่อต้องมีค่าสูงสุด 1')
    .label('คำนำหน้าชื่อ'),

  first_name: yup
    .string()
    .max(30, 'ชื่อจริงต้องมีความยาวไม่เกิน 30 ตัวอักษร')
    .nullable()
    .label('ชื่อจริง'),

  last_name: yup
    .string()
    .max(30, 'นามสกุลต้องมีความยาวไม่เกิน 30 ตัวอักษร')
    .nullable()
    .label('นามสกุล'),

  phone_number: yup
    .string()
    .nullable() // อนุญาตให้เป็น null ได้
    .test(
      'length',
      'เบอร์โทรศัพท์ต้องมีความยาว 10 ตัวอักษร',
      (value) => !value || value.length === 10 // ถ้ามีค่า ต้องมีความยาว 10 ตัวอักษร
    )
    .label('เบอร์โทรศัพท์'),

  id_role: yup
    .string()
    .max(4, 'บทบาทต้องมีความยาวไม่เกิน 4 ตัวอักษร')
    .required('กรุณาเลือกบทบาท')
    .label('บทบาท')
})

// for create
export const userCreateSchema = yup.object({
  username: yup
    .string()
    .min(8, 'ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 8 ตัวอักษร')
    .max(30, 'ชื่อผู้ใช้ต้องมีความยาวไม่เกิน 30 ตัวอักษร')
    .matches(
      /^[A-Za-z]{4}[A-Za-z0-9]*$/,
      'ชื่อผู้ใช้ต้องขึ้นต้นด้วยตัวอักษรภาษาอังกฤษ 4 ตัว และตามด้วยตัวอักษรหรือตัวเลข'
    )
    .required('กรุณากรอกบัญชีผู้ใช้')
    .label('ชื่อผู้ใช้'),

  password: yup
    .string()
    .min(8, 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร')
    .max(30, 'รหัสผ่านต้องมีความยาวไม่เกิน 30 ตัวอักษร')
    .required('กรุณากรอกรหัสผ่าน')
    .label('รหัสผ่าน'),

  password: yup
    .string()
    .min(8, 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร')
    .max(30, 'รหัสผ่านต้องมีความยาวไม่เกิน 30 ตัวอักษร')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, 'รหัสผ่านต้องมีทั้งตัวอักษรภาษาอังกฤษและตัวเลข')
    .required('กรุณากรอกรหัสผ่าน')
    .label('รหัสผ่าน'),

  confirm_password: yup
    .string()
    .min(8, 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร')
    .max(30, 'รหัสผ่านต้องมีความยาวไม่เกิน 30 ตัวอักษร')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, 'รหัสผ่านต้องมีทั้งตัวอักษรภาษาอังกฤษและตัวเลข')
    .required('กรุณากรอกรหัสผ่าน')
    .oneOf([yup.ref('password'), null], 'รหัสผ่านยืนยันไม่ตรงกัน')
    .label('ยืนยันรหัสผ่าน'),

  user_prefix: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? null : value)) // แปลง "" เป็น null
    .nullable()
    .integer('คำนำหน้าชื่อต้องเป็นตัวเลขจำนวนเต็ม')
    .max(4, 'คำนำหน้าชื่อต้องมีค่าสูงสุด 1')
    .label('คำนำหน้าชื่อ'),

  first_name: yup
    .string()
    .max(30, 'ชื่อจริงต้องมีความยาวไม่เกิน 30 ตัวอักษร')
    .nullable()
    .label('ชื่อจริง'),

  last_name: yup
    .string()
    .max(30, 'นามสกุลต้องมีความยาวไม่เกิน 30 ตัวอักษร')
    .nullable()
    .label('นามสกุล'),

  phone_number: yup
    .string()
    .transform((value, originalValue) => (originalValue === '' ? null : value)) // แปลง "" เป็น null
    .nullable() // อนุญาตให้เป็น null ได้
    .length(10, 'เบอร์โทรศัพท์ต้องมีความยาว 10 ตัวอักษร')
    .label('เบอร์โทรศัพท์'),

  id_role: yup
    .string()
    .max(4, 'บทบาทต้องมีความยาวไม่เกิน 4 ตัวอักษร')
    .required('กรุณาเลือกบทบาท')
    .label('บทบาท')
})
