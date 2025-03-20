<template>
  <div class="sidebar navigator-color is-flex is-flex-direction-column" 
  style="border-top-right-radius: 15px; border-bottom-right-radius: 15px;"
  :class="{ expanded: isExpanded }">
    <div class="sidebar-item py-3" @click="toggleSidebar">
      <div class="sidebar-item">
        <img src='@/assets/icons/hide-sidebar-svgrepo-com-3.png' width="50" height="50" alt="Menu Icon" />
        <span v-if="isExpanded" class="ml-2 has-text-white sidebar-text"></span>
      </div>
    </div>
    <div class="sidebar-content">
      <Accordion>
        <AccordionItem ref="homepage">
          <template #accordion-trigger>
            <RouterLink to="/" class="sidebar-item" active-class="is-active" exact-active-class="is-active">
              <img class="img" src="@/assets/icons/home-white.png" width="30" height="30" alt="Home Icon" />
              <span class="ml-2 sidebar-text has-text-white">หน้าแรก</span>
              <div class="underline"></div>
            </RouterLink>
          </template>
        </AccordionItem>
      </Accordion>

      <Accordion>
        <AccordionItem ref="dashboardItem">
          <template #accordion-trigger>
            <div class="sidebar-item" @click="handleAccordionItemClick('dashboardItem')"
              :class="{ 'is-active': isActiveDashboard }">
              <img class="img" src="@/assets/icons/dashboard-white.png" width="30" height="30" alt="Dashboard Icon" />
              <span class="ml-2 sidebar-text has-text-white">แดชบอร์ด</span>
              <div class="underline"></div>
            </div>
          </template>
          <template #accordion-content>
            <!-- แสดง + เมื่ออยู่ในเส้นทาง /dashboard -->
            <RouterLink to="/dashboard" class="menu-link menu-item">
              <span v-html="dashboardText"></span>
            </RouterLink>

            <!-- แสดง + เมื่ออยู่ในเส้นทาง /table_dashboard -->
            <RouterLink to="/table_dashboard" class="menu-link menu-item">
              <span v-html="tableDashboardText"></span>
            </RouterLink>

            <!-- แสดง + เมื่ออยู่ในเส้นทาง /citizen_dashboard -->
            <RouterLink to="/citizen_dashboard" class="menu-link menu-item">
              <span v-html="citizenDashboardText"></span>
            </RouterLink>
          </template>
        </AccordionItem>
      </Accordion>

      <Accordion>
        <AccordionItem ref="dataItem">
          <template #accordion-trigger>
            <div class="sidebar-item" @click="handleAccordionItemClick('dataItem')"
              :class="{ 'is-active': isActiveDataDisplay }">
              <img class="img" src="@/assets/icons/data-group-white.png" width="30" height="30" alt="Data Group Icon" />
              <span class="ml-2 sidebar-text has-text-white">ข้อมูล สปก.</span>
              <div class="underline"></div>
            </div>
          </template>
          <template #accordion-content>
            <RouterLink to="/land_data" class="menu-link menu-item">
              <span v-html="landDisplayText"></span>
            </RouterLink>
            <RouterLink to="/citizen_data" class="menu-link menu-item">
              <!-- citizenDisplayText -->
              <span v-html="citizenDisplayText"></span>
            </RouterLink>
            <RouterLink to="/heir_data" class="menu-link menu-item">
              <span v-html="heirDisplayText"></span>
            </RouterLink>
          </template>
        </AccordionItem>
      </Accordion>

      <Accordion v-if="userRole === roles[3].role_id">
        <AccordionItem ref="basicData">
          <template #accordion-trigger>
            <div class="sidebar-item" @click="handleAccordionItemClick('dashboardItem')"
              :class="{ 'is-active': currentRoute.startsWith('/manage_default_Information') }">
              <img class="img" src="@/assets/icons/data_foundation.png" width="30" height="30" alt="addItem Icon" />
              <span class="ml-2 sidebar-text has-text-white">ข้อมูลพื้นฐาน</span>
              <div class="underline"></div>
            </div>
          </template>
          <template #accordion-content>
            <RouterLink to="/manage_default_Information/manage_status" class="menu-link menu-item">
              <span v-html="statusDisplayText"></span>
            </RouterLink>
            <RouterLink to="/manage_default_Information/manage_land_usages" class="menu-item menu-item">
              <span v-html="landUsageDisplayText"></span>
            </RouterLink>
            <RouterLink to="/manage_default_Information/manage_relation" class="menu-item menu-item">
              <span v-html="relationDisplayText"></span>
            </RouterLink>
          </template>
        </AccordionItem>
      </Accordion>

      <Accordion v-if="userRole === roles[3].role_id">
        <AccordionItem ref="addItem">
          <template #accordion-trigger>
            <div class="sidebar-item" @click="handleAccordionItemClick('dashboardItem')"
              :class="{ 'is-active': isActiveAddData }">
              <img class="img" src="@/assets/icons/addfile-white.png" width="30" height="30" alt="addItem Icon" />
              <span class="ml-2 sidebar-text has-text-white">เพิ่มข้อมูล</span>
              <div class="underline"></div>
            </div>
          </template>
          <template #accordion-content>
            <RouterLink to="/create_land" class="menu-link menu-item">
              <span v-html="addLandText"></span>
            </RouterLink>
            <RouterLink to="/create_citizen" class="menu-item menu-item">
              <span v-html="addCitizenText"></span>
            </RouterLink>
            <RouterLink to="/create_heir" class="menu-item menu-item">
              <span v-html="addHeirText"></span>
            </RouterLink>
          </template>
        </AccordionItem>
      </Accordion>

      <Accordion v-if="userRole === roles[3].role_id">
        <AccordionItem ref="history">
          <template #accordion-trigger>
            <div class="sidebar-item" @click="handleAccordionItemClick('dashboardItem')"
              :class="{ 'is-active': isActiveHistory }">
              <img class="img" src="@/assets/icons/history-white.png" width="30" height="30" alt="history Icon" />
              <span class="ml-2 sidebar-text has-text-white">ประวัติข้อมูล</span>
              <div class="underline"></div>
            </div>
          </template>
          <template #accordion-content>
            <RouterLink to="/history_land" class="menu-link menu-item">
              <span v-html="landHistoryText"></span>
            </RouterLink>
            <RouterLink to="/history_citizen" class="menu-item menu-item">
              <span v-html="citizenHistoryText"></span>
            </RouterLink>
          </template>
        </AccordionItem>
      </Accordion>

    </div>
    <div class="logout-container mt-auto" v-if="!isLogOut" @click="outOfSystem" style="cursor: pointer;">
      <div class="sidebar-item">
        <img src="@/assets/icons/logout-white.png" width="30" height="30" alt="Logout Icon" />
        <span class="ml-2 sidebar-text has-text-danger">ออกจากระบบ</span>
      </div>
    </div>
  </div>
</template>

<script>
import Accordion from './accordion.vue';
import AccordionItem from './accordion-item.vue';
import { useRoute } from 'vue-router'; // import
import { useUserStore } from '@/stores/useUserStore';
import { store } from '@/store';
import roles from '@/role_config';

export default {
  name: 'Sidebar',
  components: {
    Accordion,
    AccordionItem
  },
  data() {
    return {
      roles,
      isExpanded: false,
      isLogOut: false,
      currentRoute: this.$route.path, // เพิ่ม currentRoute
      sub_route_icon: '<i class="fas fa-circle has-text-primary"></i>'
    };
  },
  computed: {
    dashboardText() {
      let word = 'สรุปผลการใช้ประโยชน์ที่ดิน'
      return this.$route.path === '/dashboard'
        ? `${this.sub_route_icon} ${word}`
        : `${word}`;
    },

    // สำหรับ /table_dashboard: เพิ่ม + ถ้าอยู่ในเส้นทางนี้
    tableDashboardText() {
      let word = 'สรุปผลการจัดสรรพื้นที่'
      return this.$route.path === '/table_dashboard'
        ? `${this.sub_route_icon} ${word}`
        : `${word}`;
    },

    citizenDashboardText() {
      let word = 'สรุปผลราษฎรพื้นที่'
      return this.$route.path === '/citizen_dashboard'
        ? `${this.sub_route_icon} ${word}`
        : `${word}`;
    },

    landDisplayText() {
      let word = 'ข้อมูลที่ดิน'
      return this.$route.path.startsWith('/land_data/')
        ? `${this.sub_route_icon} ${word}`
        : `${word}`;
    },

    citizenDisplayText() {
      let word = 'ข้อมูลราษฎร'
      return this.$route.path.startsWith('/citizen_data/')
        ? `${this.sub_route_icon} ${word}`
        : `${word}`;
    },

    heirDisplayText() {
      let word = 'ข้อมูลทายาท'
      return this.$route.path.startsWith('/heir_data/')
        ? `${this.sub_route_icon} ${word}`
        : `${word}`;
    },

    statusDisplayText() {
      let word = 'ข้อมูลสถานะที่ดิน'
      return this.$route.path === '/manage_default_Information/manage_status'
        ? `${this.sub_route_icon} ${word}`
        : `${word}`;
    },

    landUsageDisplayText() {
      let word = 'ข้อมูลการใช้ประโยชน์ที่ดิน'
      return this.$route.path === '/manage_default_Information/manage_land_usages'
        ? `${this.sub_route_icon} ${word}`
        : `${word}`;
    },

    relationDisplayText() {
      let word = 'ข้อมูลความสัมพันธ์'
      return this.$route.path === '/manage_default_Information/manage_relation'
        ? `${this.sub_route_icon} ${word}`
        : `${word}`;
    },

    addLandText() {
      let word = 'เพิ่มข้อมูลที่ดิน'
      return this.$route.path === '/create_land'
        ? `${this.sub_route_icon} ${word}`
        : `${word}`;
    },

    addCitizenText() {
      let word = 'เพิ่มข้อมูลราษฎร'
      return this.$route.path === '/create_citizen'
        ? `${this.sub_route_icon} ${word}`
        : `${word}`;
    },

    addHeirText() {
      let word = 'เพิ่มข้อมูลทายาท'
      return this.$route.path === '/create_heir'
        ? `${this.sub_route_icon} ${word}`
        : `${word}`;
    },

    landHistoryText() {
      let word = 'ประวัติข้อมูลที่ดิน'
      return this.currentRoute.startsWith('/history_land/')
        ? `${this.sub_route_icon} ${word}`
        : `${word}`;
    },

    citizenHistoryText() {
      let word = 'ประวัติข้อมูลราษฎร'
      return this.currentRoute.startsWith('/history_citizen/')
        ? `${this.sub_route_icon} ${word}`
        : `${word}`;
    },

    userRole() {
      // Access the userRole from your store
      const userStore = useUserStore();
      return userStore.userRole;
    },
    isActiveDashboard() {
      return this.currentRoute.startsWith('/dashboard') ||
        this.currentRoute.startsWith('/table_dashboard') ||
        this.currentRoute.startsWith('/citizen_dashboard');
    },
    isActiveDataDisplay() {
      return this.currentRoute.startsWith('/land_data') ||
        this.currentRoute.startsWith('/citizen_data') ||
        this.currentRoute.startsWith('/heir_data');
    },
    isActiveAddData() {
      return this.currentRoute.startsWith('/create_land') ||
        this.currentRoute.startsWith('/create_citizen') ||
        this.currentRoute.startsWith('/create_heir');
    },
    isActiveHistory() {
      return this.currentRoute.startsWith('/history_land') ||
        this.currentRoute.startsWith('/history_citizen')
    }
  },
  methods: {
    toggleSidebar() {
      this.isExpanded = !this.isExpanded;
      // Always close accordions when clicking the logo
      if (this.$refs.dashboardItem) {
        this.$refs.dashboardItem.close();
      }
      if (this.$refs.dataItem) {
        this.$refs.dataItem.close();
      }
      if (this.$refs.addItem) {
        this.$refs.addItem.close();
      }
      if (this.$refs.history) {
        this.$refs.history.close();
      }
      if (this.$refs.basicData) {
        this.$refs.basicData.close();
      }
    },
    handleAccordionItemClick(itemRef) {
      // Expand the sidebar if it's not already expanded
      if (!this.isExpanded) {
        this.isExpanded = true;
      }
      // *Don't* call toggle here.  Let the @click on sidebar-item handle it.
    },
    async outOfSystem() {
      const userStore = useUserStore();
      await userStore.out_of_system();
      this.isLogOut = true;
    },
  },
  watch: { // เพิ่ม watcher
    '$route'(to, from) {
      this.currentRoute = to.path; // อัปเดต currentRoute เมื่อ route เปลี่ยน
    }
  },
  mounted() { // เพิ่ม mounted hook
    this.currentRoute = useRoute().path; // กำหนดค่าเริ่มต้น currentRoute
  }
};
</script>

<style scoped>
/* styles remain the same (styles เหมือนเดิม) */
.sidebar {
  position: fixed;
  flex-direction: column;
  flex-wrap: nowrap;
  top: 0;
  left: 0;
  width: 80px;
  /* เพิ่ม width เริ่มต้นให้ sidebar */
  height: 100%;
  overflow: visible;
  z-index: 100;
  transition: width 0.3s ease;
  overflow: hidden;
  background-color: #433727;

  /* 🔥 เพิ่มเงาสำหรับ Sidebar */
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.2);
}


.sidebar.expanded {
  width: 15vw;

  .menu-item {
    font-size: 1rem;
  }
}

.sidebar-content {
  flex-grow: 1;
  /* ให้ส่วนเนื้อหาขยายเต็มพื้นที่ */
  overflow-y: auto;
  /* เพิ่ม scroll เมื่อเนื้อหาล้น */
}

/* ปรับแต่ง scrollbar (optional) */
.sidebar-content::-webkit-scrollbar {
  width: 8px;
}

.sidebar::-webkit-scrollbar {
  width: 10px;
  /* ความกว้างของ Scroll Bar */
}

.sidebar::-webkit-scrollbar-track {
  background: #433727;
  /* สีพื้นหลังของ track */
}

.sidebar::-webkit-scrollbar-thumb {
  background: #888;
  /* สีของ thumb */
  border-radius: 5px;
  /* มุมโค้ง */
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #555;
  /* สีเมื่อ hover */
}

/* สไตล์ Scroll Bar สำหรับ sidebar-content */
.sidebar-content::-webkit-scrollbar {
  width: 10px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: #433727;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  cursor: pointer;
  justify-content: center;
  /* จัดให้อยู่ตรงกลางเมื่อ sidebar ถูกย่อ */
  position: relative;
  /* เพิ่ม position relative */
}

/* จัดให้ item ชิดซ้ายเมื่อ sidebar ขยาย */
.sidebar.expanded .sidebar-item {
  justify-content: flex-start;
}

.sidebar-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar-item.is-active .underline {
  display: block;
}

.sidebar-item img {
  max-width: 100%;
  height: auto;
  display: flex;
}

.image-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  /* จัดให้อยู่ตรงกลางเมื่อ sidebar ถูกย่อ */
}

/* จัดให้ items ชิดซ้ายเมื่อ sidebar ขยาย */
.sidebar.expanded .image-container {
  align-items: flex-start;
}

.menu-link,
.menu-item {
  padding: 5px 10px;
  cursor: pointer;
  color: #ffffff;
  display: block;
  /* ทำให้ RouterLink เป็น block-level */
  font-size: 0.875rem;
}

.menu-link:hover,
.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ซ่อนข้อความเมื่อ sidebar ถูกย่อ */
.sidebar:not(.expanded) .sidebar-text {
  display: none;
}

/* แสดงข้อความเมื่อ sidebar ขยาย */
.sidebar.expanded .sidebar-text {
  display: inline;
  /* หรือ display: block; ขึ้นอยู่กับ layout ที่ต้องการ */
}

/* ลด padding-left ของ accordion__item เมื่อ sidebar ถูกย่อ*/
.sidebar:not(.expanded) .accordion__item {
  padding-left: 10px;
  /* ลด padding-left ลง */

}

.sidebar:not(.expanded) .sidebar-item img {
  max-width: none !important;
  /* ยกเลิก max-width */
}

.underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: white;
  display: none;
  /* ซ่อนไว้เริ่มต้น */
}

.mt-auto {
  margin-top: auto;
}
</style>