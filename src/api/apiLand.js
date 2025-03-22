import axios from 'axios'
import DOMAIN_NAME from '@/config/domain_setup'

export const fetchSois = async () => {
  try {
    const response = await axios.get(`${DOMAIN_NAME}/land/sois`)
    // console.log('res:', response.data)
    const sois = []
    for (let i = 0; i < response.data.length; i++) {
      let soi = response.data[i].id_alley
      sois.push({ value: soi, label: `ซอย ${soi}` })
    }
    // throw new Error("ค่าที่ส่งมาไม่ถูกต้อง");
    return sois
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}

export const fetchLandStatus = async () => {
  try {
    const response = await axios.get(`${DOMAIN_NAME}/land/land_status`, {
      withCredentials: true
    })
    // console.log('res-land:', response.data)
    const status_land = []
    for (let ls of response.data) {
      status_land.push({ value: ls.ID_land_status, label: `${ls.land_status_name}` })
    }
    // throw new Error("ค่าที่ส่งมาไม่ถูกต้อง");
    return status_land
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}

export const fetchLandStatusActive = async (active = '1') => {
  try {
    const response = await axios.get(`${DOMAIN_NAME}/manage_status_info/active/${active}`, {
      withCredentials: true // ส่งคุกกี้ไปพร้อมกับคำขอ
    })
    console.log('res-land:', response.data)
    const status_land = []
    if (response.data.data.length != 0) {
      for (let ls of response.data.data) {
        status_land.push({ value: ls.ID_land_status, label: `${ls.land_status_name}` })
      }
    } else {
      return (response.data.data = [])
    }
    return status_land
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}

export const fetchOneLandStatus = async (landID) => {
  try {
    const response = await axios.get(`${DOMAIN_NAME}/manage_status_info/${landID}`, {
      withCredentials: true // ส่งคุกกี้ไปพร้อมกับคำขอ
    })
    console.log('res-land:', response.data)
    const status_land = response.data
    return status_land
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}

export const fetchLandOne = async (landID) => {
  try {
    const response = await axios.get(`${DOMAIN_NAME}/land/${landID}`, {
      withCredentials: true
    })
    console.log('res-land:', response.data)
    const status_land = response.data
    return status_land
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}

export const fetchDocumentLandType = async () => {
  try {
    const response = await axios.get(`${DOMAIN_NAME}/manage_land_document_type`)
    const documentLandType = []
    for (let ls of response.data) {
      documentLandType.push({ value: ls.ID_dc_type, label: `${ls.dc_type_name}` })
    }
    return documentLandType
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}

export const fetchRelation = async () => {
  try {
    const response = await axios.get(`${DOMAIN_NAME}/manage_relation`)
    // console.log('res-land:', response.data)
    const status_land = []
    for (let ls of response.data) {
      status_land.push({ value: ls.id, label: `${ls.label}` })
    }
    // throw new Error("ค่าที่ส่งมาไม่ถูกต้อง");
    return status_land
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}
// ดึงข้อมูลจาก dashboard
export const fetchLandUseDashboard = async () => {
  try {
    const response = await axios.get(`${DOMAIN_NAME}/dashboard`)
    console.log('res-land:', response.data)
    return response.data
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลการใช้ประโยชน์ที่ดินได้')
  }
}

export const fetchOneLandUseDashboard = async (soi_id = '-1') => {
  try {
    const response = await axios.get(`${DOMAIN_NAME}/dashboard/${soi_id}`)
    // console.log(response.data)
    const status_land = response.data
    return status_land
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}

export const fetchTableDashboard = async () => {
  try {
    const response = await axios.get(`${DOMAIN_NAME}/dashboard/summary`, {
      withCredentials: true
    })
    // console.log('res-land:', response.data)
    const status_land = []
    const selectedControl = []
    for (let ls of response.data) {
      selectedControl.push(ls.current_soi)
      status_land.push({
        id: ls.current_soi,
        soi: String(ls.current_soi),
        land: parseInt(ls.total_land_status_count),
        spaok: parseInt(ls.current_land_status01),
        agriculture_title: parseInt(ls.current_land_status02),
        occupied_area: parseInt(ls.current_land_status03),
        unclaimed_area: parseInt(ls.current_land_status04),
        rai: ls.rai || 0,
        ngan: ls.ngan || 0,
        square_wa: ls.square_wa || 0
      })
    }
    return [selectedControl, status_land]
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อได้')
  }
}

export const fetchCitizenTableDashboard = async () => {
  try {
    const response = await axios.get(`${DOMAIN_NAME}/dashboard/summary_citizen`, {
      withCredentials: true
    })
    // console.log('res-land:', response.data)
    const status_land = []
    const selectedControl = []
    for (let ls of response.data) {
      selectedControl.push(ls.soi)
      status_land.push({
        id: ls.soi,
        soi: String(ls.soi),
        total_citizen: parseInt(ls.total_citizens),
        huataphan: parseInt(ls.huataphan),
        taiburi: parseInt(ls.taiburi),
        male: parseInt(ls.male),
        female: parseInt(ls.female)
      })
    }
    return [selectedControl, status_land]
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อได้')
  }
}
