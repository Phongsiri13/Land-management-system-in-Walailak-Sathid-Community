import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    userRole: null,
    userRoleName: null
  }),
  actions: {
    setDefaultRole() {
      this.userRole = null
      this.userRoleName = null
    },
    setUserRole(role) {
      this.userRole = role // new role
    },
    async fetchUserRole() {
      try {
        // ส่งคำขอไปยัง backend พร้อมกับ cookie (`connect.sid`) อัตโนมัติ
        const response = await  axios.get('http://localhost:3000/login/profile', {
          withCredentials: true // ส่ง cookie พร้อมคำขอ
        })

        console.log(':::', response.data.user.role)
        console.log(':::', response.status)
        this.userRole = response.data.user.role // กำหนดค่า role ที่ได้รับจาก API
      } catch (error) {
        this.userRole = null
      }
    },
    async out_of_system() {
      try {
        // ส่งคำขอแบบ POST ไปยัง backend พร้อมกับ cookie (`connect.sid`) อัตโนมัติ
        const response = await axios.post(
          'http://localhost:3000/login/logout',
          {},
          {
            withCredentials: true // ส่ง cookie พร้อมคำขอ
          }
        )
        console.log('message:', response.data)
        this.userRole = null
        this.userRoleName = null
      } catch (error) {
        this.userRole = null
        this.userRoleName = null
      }
    }
  },
  getters: {
    isUser: (state) => state.userRole === null,
    isAdmin: (state) => state.userRole === 'Admin',
    isOfficer: (state) => state.userRole === 'Officer'
  }
})
