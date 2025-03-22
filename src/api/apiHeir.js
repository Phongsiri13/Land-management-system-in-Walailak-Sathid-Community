import axios from 'axios'
import DOMAIN_NAME from '@/config/domain_setup'

// URL to fetch
const relation_url = `${DOMAIN_NAME}/heir/relation`

export const fetchRelation = async () => {
  try {
    const response = await axios.get(relation_url)
    // console.log('res-relation:', response.data)
    const relationList = []
    for (let d of response.data) {
      relationList.push({
        value: d.id,
        label: d.label
      })
    }
    return relationList
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลความสัมพันธ์ได้')
  }
}

export const fetchOneHeir = async (heir_id) => {
  try {
    const res = await axios.get(`${DOMAIN_NAME}/heir/${heir_id}`, {
      withCredentials: true
    })
    // console.log('res-heir-one:', res.data)
    const relationList = res.data
    return relationList
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลทายาทได้')
  }
}

export const checkFullnameMatchHeir = async (fname, lname) => {
  try {
    const response = await axios.get(
      `${DOMAIN_NAME}/heir/fullname?fname=${encodeURIComponent(fname)}&lname=${encodeURIComponent(lname)}`,
      { withCredentials: true }
    )
    // console.log('send:', response.data)
    return response
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}

export const fullCheckMatchHeir = async (heirsNameList) => {
  console.log('heirsNameList:', heirsNameList)
  try {
    const response = await axios.post(
      `${DOMAIN_NAME}/heir/searchHeirAll`,
      {
        heirData: heirsNameList.heirs
      },
      { withCredentials: true }
    )
    // console.log('send:', response.data)
    if (response.data.status) {
      return response.data
    } else {
      return response.data
    }
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}
// รับและส่งข้อมูลทายาท เพื่อค้นหาว่ามีทายาทผู้นี้หรือไม่
export const fullCheckMatchCitizen = async (citizenFullname) => {
  console.log('heirsNameList:', heirsNameList)
  try {
    const response = await axios.post(
      `${DOMAIN_NAME}/heir/searchHeirAll`,
      {
        citizenFullname: citizenFullname
      },
      { withCredentials: true }
    )
    // console.log('send:', response.data)
    if (response.data.status) {
      return response.data
    } else {
      return response.data
    }
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}

export const getHeirUsingFullName = async (split_name) => {
  try {
    // แปลงค่าที่เป็นภาษาไทยให้เป็น URL-safe
    const encodedFname = encodeURIComponent(split_name.firstname)
    const encodedLname = encodeURIComponent(split_name.lastname)
    const response = await axios.get(`${DOMAIN_NAME}/heir/fullname`, {
      withCredentials: true,
      params: {
        fname: encodedFname || '',
        lname: encodedLname || ''
      }
    })
    console.log('send:', response)
    return response
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}

export const fetchRelationActive = async (active) => {
  try {
    const response = await axios.get(`${DOMAIN_NAME}/manage_relation/active/${active}`, 
      { withCredentials: true })
    // console.log('res-land:', response.data)
    const status_land = []
    for (let ls of response.data.data) {
      status_land.push({ value: ls.id, label: `${ls.label}` })
    }
    return status_land
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}

export const fetchLandUsageActive = async (active) => {
  try {
    const response = await axios.get(`${DOMAIN_NAME}/manage_land_usages_info/active/${active}`, {
      withCredentials: true
    })
    // console.log('res-land:', response.data)
    const status_land = []
    for (let ls of response.data) {
      status_land.push({ value: ls.id_usage, label: `${ls.land_usage_name}` })
    }
    return status_land
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}

export const citizenRelatedHeir = async (card_id) => {
  try {
    const response = await axios.get(`${DOMAIN_NAME}/heir/citizen/related/heir/${card_id}`, {
      withCredentials: true
    })
    // console.log('send:', response.data)
    return response.data
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}
