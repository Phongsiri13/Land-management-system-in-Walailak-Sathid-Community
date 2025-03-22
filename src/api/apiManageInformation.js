import axios from 'axios'
import DOMAIN_NAME from '@/config/domain_setup'
const url_status = `${DOMAIN_NAME}/manage_status_info/`
const url_relation = `${DOMAIN_NAME}/manage_relation/`
const url_land_use = `${DOMAIN_NAME}/manage_land_usages_info/`
const url_document_land_type = `${DOMAIN_NAME}/manage_land_document_type/`

export const getOneStatus = async (id) => {
  try {
    const response = await axios.get(url_status + `${id}`, {
      withCredentials: true
    })
    return response.data
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}

export const getOneDocumentLandType = async (id) => {
  try {
    const response = await axios.get(url_document_land_type + `${id}`, {
      withCredentials: true
    })
    return response.data
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}

export const getOneRelation = async (id) => {
  try {
    const response = await axios.get(url_relation + `${id}`, {
      withCredentials: true
    })
    return response.data
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}

export const getOneLandUsage = async (id) => {
  try {
    const response = await axios.get(url_land_use + `${id}`, {
      withCredentials: true
    })
    console.log('getOneLandUsage:', response.data)
    return response.data
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}
