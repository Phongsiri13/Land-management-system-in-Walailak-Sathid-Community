<template>
  <div class="sidebar navigator-color is-flex is-flex-direction-column" :class="{ expanded: isExpanded }">
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
              <img class="img" src="@/assets/icons/home-white.png" width="34" height="34" alt="Home Icon" />
              <span class="ml-2 sidebar-text has-text-white">หน้าแรก</span>
              <div class="underline"></div>
            </RouterLink>
          </template>
        </AccordionItem>
      </Accordion>

      <Accordion>
        <AccordionItem ref="admin">
          <template #accordion-trigger>
            <RouterLink to="/user_report" class="sidebar-item" active-class="is-active" exact-active-class="is-active">
              <img class="img" src="@/assets/icons/admin.png" width="34" height="34" alt="Home Icon" />
              <span class="ml-2 sidebar-text has-text-white">ผู้ใช้งาน</span>
              <div class="underline"></div>
            </RouterLink>
          </template>
        </AccordionItem>
      </Accordion>

      <Accordion>
        <AccordionItem ref="admin">
          <template #accordion-trigger>
            <RouterLink to="/manage_role" class="sidebar-item" active-class="is-active" exact-active-class="is-active">
              <img class="img" src="@/assets/icons/user_role.png" width="34" height="34" alt="Home Icon" />
              <span class="ml-2 sidebar-text has-text-white">จัดการสิทธิ์</span>
              <div class="underline"></div>
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
// import Accordion from './accordion.vue';
// import AccordionItem from './accordion-item.vue';
import { useUserStore } from '@/stores/useUserStore';
import { useRoute } from 'vue-router'; // import

import Accordion from './accordion.vue';
import AccordionItem from './accordion-item.vue';

export default {
  name: 'Sidebar',
  components: {
    Accordion,
    AccordionItem
  },
  data() {
    return {
      isExpanded: false,
      isLogOut: false,
      currentRoute: "", // เพิ่ม currentRoute
    };
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
  width: 70px;
  /* เพิ่ม width เริ่มต้นให้ sidebar */
  height: 100%;
  overflow: visible;
  z-index: 10000;
  transition: width 0.3s ease;
  overflow: hidden;
  background-color: #433727;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.2);
}

.sidebar.expanded {
  width: 15%;

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