import * as yup from 'yup'


export const getHeirModel = {
  heir_fname: '',
  heir_lname: '',
  prefix: '',
}

export const getHeirPeopleModel = {
  card_id: '',
  fullname: ''
}

export const HeirValidSchema = {
  prefix: yup.string().required('กรุณาเลือกคำนำหน้าชื่อ'),
  heir_fname: yup
    .string()
    .required('กรุณากรอกชื่อจริง')
    .min(3, 'ชื่อจริงต้องมีอย่างน้อย 3 ตัวอักษร')
    .max(30, 'ชื่อจริงต้องไม่เกิน 30 ตัวอักษร'),
    heir_lname: yup
    .string()
    .required('กรุณากรอกนามสกุล')
    .min(3, 'นามสกุลต้องมีอย่างน้อย 3 ตัวอักษร')
    .max(30, 'นามสกุลต้องไม่เกิน 30 ตัวอักษร'),
}
