// validationSchema.js
import * as yup from 'yup'

export const personModel = {
  fullname: ''
}

export const personHeirModel = { fullname: '', relationSlected: '' }

export const personValidSchema = {
  fullname: yup
    .string()
    .matches(/^\S+\s+\S+$/, 'กรุณาใส่ชื่อจริงและนามสกุล โดยต้องมีช่องว่างระหว่างกัน')
    .required('กรุณาเลือกชื่อจริง-นามสกุล')
}

export const heirListValidSchema = yup.object().shape({
  formHeirData: yup.object().shape({
    heirs: yup.array().of(
      yup.object().shape({
        fullname: yup
          .string()
          .matches(/^\S+\s+\S+$/, 'กรุณาใส่ชื่อจริงและนามสกุล โดยต้องมีช่องว่างระหว่างกัน')
          .required('กรุณากรอกชื่อจริง-นามสกุล'),
        relationSlected: yup
          .string()
          .required('กรุณาเลือกความสัมพันธ์'),
      })
    ).min(1, 'ต้องมีทายาทอย่างน้อย 1 คน'),
  }),
});

