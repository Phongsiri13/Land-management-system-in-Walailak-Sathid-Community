<template>
  <div>
    <!-- and loading when changing path -->
    <div>
      <progress class="progress is-danger fixed-progress" max="100" v-if="store.status_path_change == true">
        30%
      </progress>
    </div>

    <!-- Navigator -->
    <Sidebar class="sidebar" v-if="userRole === roles[3].role_id" />
    <!-- <PeopleBar v-else /> -->
    <PeopleBar v-if="!isLoginPage && userRole === null" /> <!-- ซ่อน PeopleBar เมื่ออยู่หน้า /login -->

    <!-- content -->
    <div>
      <router-view />
    </div>

    <div class="modal" v-if="isLogOut">
      <div class="modal-background"></div>
      <div class="modal-content">
        <p class="image is-4by3">
          <img src="https://bulma.io/assets/images/placeholders/1280x960.png" alt="">
        </p>
      </div>
      <button class="modal-close is-large" aria-label="close"></button>
    </div>

    <!-- The copy right part -->
    <!-- <footer></footer> -->
  </div>
</template>

<script>
import roles from './role_config';
import { store } from './store'
import { useUserStore } from '@/stores/useUserStore';

import Sidebar from './components/SidebarRole.vue';
import PeopleBar from './components/PeopleBar.vue';

export default {
  components: {
    Sidebar,
    PeopleBar
  },
  data() {
    return {
      roles,
      store,
      isActive: false,
      isDropdownDisplayActive: false,
      isDropdownActive: false,
      isDropdownReportActive: false,
      isLoading: true,
      isLogOut: false,
    }
  },
  computed: {
    // ตรวจสอบว่าเป็นหน้า /login หรือไม่
    isLoginPage() {
      return this.$route.path === '/login';
    },
    isLinkActive() {
      return this.$route.path === '/create_people' || this.$route.path === '/create_land' || this.$route.path === '/create_heir';
    },
    isLinkDisplayActive() {
      return this.$route.path === '/land_data' || this.$route.path === '/upload_files'
        || /^\/land_data\/detail\/\d+$/.test(this.$route.path)
        || /^\/land_data\/upload_files\/\d+$/.test(this.$route.path);
    },
    isLinkReportActive() {
      return this.$route.path === '/table_dashboard' || this.$route.path === '/oh' || this.$route.path === '/dashboard';
    },
    userRole() {
      // Access the userRole from your store
      const userStore = useUserStore();
      return userStore.userRole;
    }
  },
  methods: {
    toggleDropdown() {
      this.isDropdownActive = !this.isDropdownActive;
    },
    closeDropdown() {
      this.isDropdownActive = false;
    },
    toggleDisplayDropdown() {
      this.isDropdownDisplayActive = !this.isDropdownDisplayActive;
    },
    closeDisplayDropdown() {
      this.isDropdownDisplayActive = false;
    },
    toggleReportDropdown() {
      this.isDropdownReportActive = !this.isDropdownReportActive;
    },
    closeReportDropdown() {
      this.isDropdownReportActive = false;
    },
    changePath() {
      this.store.status_path_change = true
    },
    toggleMenu() {
      this.isActive = !this.isActive;
    },
    handleClickOutside(event) {
      if (this.$refs.dropdown && !this.$refs.dropdown.contains(event.target)) {
        this.closeDropdown();
      }
      if (this.$refs.dropdownDisplay && !this.$refs.dropdownDisplay.contains(event.target)) {
        this.closeDisplayDropdown()
      }
      if (this.$refs.dropdownReport && !this.$refs.dropdownReport.contains(event.target)) {
        this.closeReportDropdown()
      }
    },
    async outOfSystem() {
      const userStore = useUserStore();
      await userStore.out_of_system();
      isLogOut = !isLogOut
    },
    goToUserSearchPage() {
      this.$router.push('/uq');
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    setTimeout(() => {
      this.isLoading = false; // Simulate loading completion
    }, 500); // Adjust time as needed
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  }
}
</script>

<style>
/* global css */
.navbar-burger {
  cursor: pointer;
}

/* burger color */
.navbar-burger span {
  color: rebeccapurple;
}

.chart-card {
  cursor: pointer;
}

.headerTitle {
  /* background-color: #93a6af; */
  background-color: #4e4b32;
}

.navbar-link.is-active {
  background-color: #333;
  /* Change to your desired highlight color */
  color: #333 !important;
}

.navbar-item.is-active {
  background-color: #333;
  border-radius: 5px;
  /* Change this to your desired active background color */
  color: #333 !important;
  /* Change text color for better contrast */
}

.progress {
  height: 5px;
  /* Set the height to 10px */
}

.fixed-progress {
  position: fixed;
  /* Use 'absolute' if you want it relative to a container */
  top: 0;
  /* Aligns to the top of the viewport */
  left: 50%;
  /* Center horizontally */
  transform: translateX(-50%);
  /* Centers the element */
  width: 100%;
  /* Full width of the viewport */
  z-index: 1000;
  /* Keeps it above other content */
}

@media screen and (max-width: 768px) {
  .primary_content {
    margin-left: 5%;
  }
}
</style>
