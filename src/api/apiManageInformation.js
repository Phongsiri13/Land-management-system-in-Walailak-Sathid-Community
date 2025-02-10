import axios from 'axios'
const url_status = "http://localhost:3000/manage_status_info/";
const url_relation = "http://localhost:3000/manage_relation/";
const url_document_land_type = "http://localhost:3000/manage_land_document_type/";

export const getOneStatus = async (id) => {
  try {
    const response = await axios.get(url_status+`${id}`)
    return response.data
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}

export const getOneDocumentLandType = async (id) => {
  try {
    const response = await axios.get(url_document_land_type+`${id}`)
    return response.data
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}

export const getOneRelation = async (id) => {
  try {
    const response = await axios.get(url_relation+`${id}`)
    return response.data
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}