import axios from 'axios'

const prefix_url = 'http://localhost:3000/people/prefix';
const people_search_url = 'http://localhost:3000/people/search';

export const fetchPrefix = async () => {
  try {
    const response = await axios.get(prefix_url)
    // console.log('res-prefix:', response.data)
    const prefixList = []
    for (let d of response.data) {
      // console.log(d)
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

export const fetchPeopleName = async (firstName) => {
  const citizen = firstName;
  try {
    const response = await axios.get(people_search_url)
    console.log('res-citizen:', response.data)
    const prefixList = []
    // for (let d of response.data) {
    //   // console.log(d)
    //   prefixList.push({
    //     value: d.prefix_id,
    //     label: d.prefix_name
    //   })
    // }
    return prefixList
  } catch (error) {
    throw new Error('ไม่สามารถดึงข้อมูลสถานะที่ดินได้')
  }
}
