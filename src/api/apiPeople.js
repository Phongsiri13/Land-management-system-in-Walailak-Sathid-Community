import axios from 'axios'

import DOMAIN_NAME from '@/config/domain_setup'
const prefix_url = `${DOMAIN_NAME}/citizen/prefix`
const people_search_url = `${DOMAIN_NAME}/citizen/search`

// getPrefix
export const fetchPrefix = async () => {
  try {
    const response = await axios.get(prefix_url)
    const prefixList = []
    for (let d of response.data) {
      prefixList.push({
        value: d.prefix_id,
        label: d.prefix_name
      })
    }
    return prefixList
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}

// Search Like for citizen
export const fetchPeopleName = async (firstName) => {
  const citizen = firstName
  console.log('citizen:', citizen)
  try {
    console.log('link:', people_search_url + `?firstname="${citizen}"`)
    const response = await axios.get(people_search_url + `?firstname="${citizen}"`)
    console.log('res-citizen:', response.data)
    const citizenNameList = []
    for (let d of response.data) {
      // console.log(d)
      // citizenNameList.push(d.first_name +' '+ d.last_name)
      citizenNameList.push({
        value: d.ID_CARD,
        label: d.first_name + ' ' + d.last_name
      })
    }
    console.log('sss:', citizenNameList)
    return citizenNameList
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}

export const checkFullnameMatchCitizen = async (fname, lname) => {
  const response = await axios.get(
    `${DOMAIN_NAME}/citizen/qf?firstname=${fname}&lastname=${lname}`
  )
  // console.log('send:', response.data)
  if (response.data.status) {
    return response.data
  } else {
    return response.data
  }
}

export const fetchPeopleID = async (ID_CARD) => {
  const citizen = ID_CARD
  try {
    const response = await axios.get(`${DOMAIN_NAME}/citizen/${citizen}`, {
      withCredentials: true
    })
    console.log('res-citizen:', response.data)
    const citizenNameList = response.data
    return citizenNameList
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}

