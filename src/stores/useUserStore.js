import { defineStore } from 'pinia';
import axios from 'axios';
import DOMAIN_NAME from '@/config/domain_setup';

export const useUserStore = defineStore('user', {
  state: () => ({
    userRole: null,
    userRoleName: null,
    isLoading: false // เพิ่ม Loading State
  }),
  actions: {
    setDefaultRole() {
      this.userRole = null;
      this.userRoleName = null;
    },
    setUserRole(role) {
      this.userRole = role;
    },
    async fetchUserRole() {
      this.isLoading = true; // ตั้งค่า Loading State
      try {
        // 🔍 ตรวจสอบว่า Cookie มี token หรือไม่
        const hasToken = document.cookie
          .split('; ')
          .some(row => row.startsWith('token='));

        if (!hasToken) {
          // console.log('🔴 ไม่มี Token ใน Cookie -> ออกจากระบบทันที');
          this.setDefaultRole();
          return;
        }

        // 🔥 ถ้ามี Token -> ขอข้อมูล Role จาก API
        const response = await axios.get(`${DOMAIN_NAME}/login/profile`, {
          withCredentials: true
        });

        this.userRole = response.data.user.role;
      } catch (error) {
        // console.error('❌ Fetch User Role Error:', error);
        this.setDefaultRole(); // ลบ Role และออกจากระบบ
      } finally {
        this.isLoading = false; // ปิด Loading State
      }
    },
    async out_of_system() {
      try {
        await axios.post(`${DOMAIN_NAME}/login/logout`, {}, {
          withCredentials: true
        });

        this.setDefaultRole(); // รีเซ็ต Role
      } catch (error) {
        this.setDefaultRole(); // รีเซ็ต Role
      }
    }
  },
  getters: {
    isUser: (state) => state.userRole === null,
    // isAdmin: (state) => state.userRole === 'Admin',
    // isOfficer: (state) => state.userRole === 'Officer',
  }
});
