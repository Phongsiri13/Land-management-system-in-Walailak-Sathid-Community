import axios from 'axios'
import DOMAIN_NAME from '@/config/domain_setup'

const user_role_url = '/admin/role/active/'
const user_role_one_url = '/admin/role/'
const all_users_url = '/admin/user/'
// const people_search_url = '/citizen/search'

// Search Like for citizen
export const fetchUserRoleActive = async (role_actived) => {
  try {
    const response = await axios.get(`${DOMAIN_NAME}${user_role_url}${role_actived}`, {
      withCredentials: true
    })
    console.log('res-role-actived:', response.data.data)
    const roleList = []
    for (let d of response.data.data) {
      roleList.push({
        value: d.role_id,
        label: d.role_name
      })
    }
    console.log('hihi')
    return roleList
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสิทธิ์ของผู้ใช้ได้')
  }
}

export const getOneUserRole = async (id) => {
  console.log('id:', id)
  try {
    const response = await axios.get(`${DOMAIN_NAME}${user_role_one_url}${id}`, {
      withCredentials: true
    })
    console.log('response:', response)
    return response
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${DOMAIN_NAME}${all_users_url}`, {
      withCredentials: true
    })
    // console.log('res-role-actived:', response.data.data)
    const roleList = []
    response.data.data.forEach((d, index) => {
      d.id = ++index
      roleList.push({
        ...d
      })
    })

    return roleList
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสิทธิ์ของผู้ใช้ได้')
  }
}
