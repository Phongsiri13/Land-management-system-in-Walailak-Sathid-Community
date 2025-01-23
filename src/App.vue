<template>
  <div>
    <!-- loading when move to another path -->
    <!-- and loading when changing path -->
    <div>
      <progress class="progress is-danger fixed-progress" max="100" v-if="store.status_path_change == true">
        30%
      </progress>
    </div>

    <!-- Navigator -->
    <header>
      <nav v-if="$route.name !== 'Login'" class="navbar headerTitle" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <a class="navbar-item" >
            <!-- Your SVG logo here -->
          </a>

          <div class="navbar-burger" 
          :class="{'is-active': isActive}"
          data-target="nbMenu" :aria-expanded="isActive.toString()" @click="toggleMenu">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div id="nbMenu" class="navbar-menu" :class="{ 'is-active': isActive }">
          <div class="navbar-start">
            <RouterLink to="/" class="navbar-item has-text-white" active-class="is-active" exact-active-class="is-active">
              หน้าแรก
            </RouterLink>

            <div v-if="userRole === roles[2].role_id" class="navbar-item has-dropdown"
              :class="{ 'is-active': isDropdownReportActive }" ref="dropdownReport">
              <a class="navbar-link" :class="{ 'is-active': isDropdownReportActive || isLinkReportActive }"
                @click="toggleReportDropdown">
                <span class="has-text-white">รายงาน</span>
              </a>
              <div class="navbar-dropdown" v-if="isDropdownReportActive">
                <RouterLink to="/table_dashboard" class="navbar-item" active-class="is-active" exact-active-class="is-active"
                  @click="closeReportDropdown">
                  ผลการจัดพื้นที่
                </RouterLink>
                <RouterLink to="/dashboard" class="navbar-item" active-class="is-active" exact-active-class="is-active"
                  @click="closeReportDropdown">
                  การใช้ประโยชน์ที่ดิน
                </RouterLink>
              </div>
            </div>
            <!-- for not user -->
            <RouterLink v-else to="/dashboard" class="navbar-item" active-class="is-active"
              exact-active-class="is-active">
              การใช้ประโยชน์ที่ดิน
            </RouterLink>

            <!-- Add data -->
            <div v-if="userRole === roles[2].role_id" class="navbar-item has-dropdown"
              :class="{ 'is-active': isDropdownActive }" ref="dropdown">
              <a class="navbar-link" :class="{ 'is-active': isDropdownActive || isLinkActive }" @click="toggleDropdown">
                <span class="has-text-white">เพิ่มข้อมูล</span>
              </a>
              <div class="navbar-dropdown" v-if="isDropdownActive">
                <RouterLink to="/create_land" class="navbar-item" active-class="is-active"
                  exact-active-class="is-active" @click="closeDropdown">
                  เพิ่มที่ดิน
                </RouterLink>
                <RouterLink to="/create_people" class="navbar-item" active-class="is-active"
                  exact-active-class="is-active" @click="closeDropdown">
                  เพิ่มราษฎร
                </RouterLink>
                <RouterLink to="/create_heir" class="navbar-item" active-class="is-active"
                  exact-active-class="is-active" @click="closeDropdown">
                  เพิ่มทายาท
                </RouterLink>
                <!-- <hr class="navbar-divider" /> -->
                <!-- <a class="navbar-item" @click="closeDropdown">Report an issue</a> -->
              </div>
            </div>

            <!-- Display data -->
            <div v-if="userRole === roles[2].role_id" class="navbar-item has-dropdown"
              :class="{ 'is-active': isDropdownDisplayActive }" ref="dropdownDisplay">
              <a class="navbar-link" :class="{ 'is-active': isDropdownDisplayActive || isLinkDisplayActive }"
                @click="toggleDisplayDropdown">
                <span class="has-text-white">รายการข้อมูล</span>
              </a>
              <div class="navbar-dropdown" v-if="isDropdownDisplayActive">
                <RouterLink to="/land_data" class="navbar-item" active-class="is-active"
                  exact-active-class="is-active" @click="closeDisplayDropdown">
                  ราษฎร
                </RouterLink>
                <hr class="navbar-divider" />
                <RouterLink to="/history_land" class="navbar-item" active-class="is-active"
                  exact-active-class="is-active" @click="closeDisplayDropdown">
                  ประวัติการแก้ไข ที่ดิน
                </RouterLink>
                <RouterLink to="/up2" class="navbar-item" active-class="is-active"
                  exact-active-class="is-active" @click="closeDisplayDropdown">
                  ประวัติการแก้ไข ราษฎร
                </RouterLink>
              </div>
            </div>

            <!-- <RouterLink v-if="userRole === roles[2].role_id" to="/search" class="navbar-item" active-class="is-active"
              exact-active-class="is-active">
              ค้นหา
            </RouterLink>
            <div v-else class="is-flex-wrap-nowrap is-align-content-center is-justify-content-center">
              <div class="field has-addons">
                <div class="control mx-3">
                  <input class="input" type="text" placeholder="แปลงเลขที่ เช่น 2345">
                </div>
                <div class="control">
                  <button class="button is-dark" @click="goToUserSearchPage">
                    ค้นหา
                  </button>
                </div>
              </div>
            </div> -->

            <!-- <RouterLink v-if="userRole === roles[2].role_id" to="/admin" class="navbar-item" active-class="is-active"
              exact-active-class="is-active">
              <span>admin</span>
            </RouterLink> -->

          </div>

          <!-- login -->
          <div class="navbar-end">
            <div class="navbar-item">
              <div v-if="userRole !== roles[2].role_id" class="buttons">
                <RouterLink to="/login" class="button is-light">
                  <span class="icon-text">
                    <i v-if="!isLoading" class="fas fa-user-alt has-text-dark">
                      <span class="has-text-dark">เข้าสู่ระบบ</span>
                    </i>
                  </span>
                </RouterLink>
              </div>
              <div v-else @click="outOfSystem" class="button is-light">
                <span class="icon mr-1">
                  <i class="fas fa-user-alt p-1 has-text-dark"></i>
                </span>
                <span class="has-text-dark">ออกจากระบบ</span>
              </div>
            </div>
          </div>
        </div>

      </nav>
      <nav v-else>
        <span>
          <RouterLink to="/" class="p-5" active-class="is-active" exact-active-class="is-active">
            หน้าแรก
          </RouterLink>
        </span>
      </nav>
    </header>

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
import Sidebar from './components/Sidebar.vue';

export default {
  data() {
    return {
      roles,
      store,
      isActive: false,
      isDropdownDisplayActive: false,
      isDropdownActive: false,
      isDropdownReportActive: false,
      isLoading: true,
      isLogOut: false
    }
  },
  computed: {
    isLinkActive() {
      return this.$route.path === '/create_people' || this.$route.path === '/create_land'  || this.$route.path === '/create_heir';
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

<style scoped>

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
  background-color: #f0e3d3;
  /* Change to your desired highlight color */
  color: #333 !important;
}

.navbar-item.is-active {
  background-color: #f0e3d3;
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

/* Define the skeleton effect animation */
/* @keyframes skeleton-shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
} */

/* Add skeleton styles */
/* .is-skeleton {
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite linear;
} */

</style>
