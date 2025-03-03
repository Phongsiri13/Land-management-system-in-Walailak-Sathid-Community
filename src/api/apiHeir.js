import axios from 'axios'

// URL to fetch
const relation_url = 'http://localhost:3000/heir/relation'

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
    const res = await axios.get(`http://localhost:3000/heir/${heir_id}`)
    // console.log('res-heir-one:', res.data)
    const relationList = res.data
    return relationList
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลทายาทได้')
  }
}

export const checkFullnameMatchHeir = async (fname, lname) => {
  try {
    const response = await axios.get(`http://localhost:3000/heir/fullname?fname=${encodeURIComponent(fname)}&lname=${encodeURIComponent(lname)}`);
    console.log('send:', response.data)
    if (response.data) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}

export const fullCheckMatchHeir = async (heirsNameList) => {
  console.log("heirsNameList:",heirsNameList)
  try {
    const response = await axios.post('http://localhost:3000/heir/searchHeirAll', {
      heirData: heirsNameList.heirs
    });
    console.log('send:', response.data)
    if (response.data.status) {
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}

export const fullCheckMatchCitizen = async (citizenFullname) => {
  console.log("heirsNameList:",heirsNameList)
  try {
    const response = await axios.post('http://localhost:3000/heir/searchHeirAll', {
      citizenFullname: citizenFullname
    });
    console.log('send:', response.data)
    if (response.data.status) {
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}

export const fetchRelationActive = async (active) => {
  try {
    const response = await axios.get(`http://localhost:3000/manage_relation/active/${active}`);
    console.log('res-land:', response.data)
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
    const response = await axios.get(`http://localhost:3000/manage_land_usages_info/`);
    console.log('res-land:', response.data)
    const status_land = []
    for (let ls of response.data) {
      status_land.push({ value: ls.id_usage, label: `${ls.land_usage_name}` })
    }
    return status_land
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}