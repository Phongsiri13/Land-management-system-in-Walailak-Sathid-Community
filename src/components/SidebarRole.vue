<template>
    <div class="sidebar navigator-color is-flex is-flex-direction-column" :class="{ expanded: isExpanded }" @mouseover="expandSidebar"
        @mouseleave="collapseSidebar">

        <div v-if="isDashboardMenuVisible" class="dashboard-menu" :style="{ left: isExpanded ? '15%' : '5%' }">
            <RouterLink to="/dashboard">
                <span>สรุปการใช้ประโยชน์ที่ดิน</span>
            </RouterLink>
            <div class="menu-item">สรุปผลการจัดสรรที่ดิน</div>
        </div>

        <div v-if="isDataMenuVisible" class="dashboard-menu" :style="{ left: isExpanded ? '15%' : '5%' }">
            <RouterLink to="/land_data">
                <span>รายละเอียดสิทธิการใช้ที่ดิน</span>
            </RouterLink>
            <div>
                <RouterLink to="/dashboard">
                    <span>ข้อมูลราษฎร</span>
                </RouterLink>
            </div>
            <div>
                <RouterLink to="/dashboard">
                    <span>ข้อมูลทายาท</span>
                </RouterLink>
            </div>
        </div>

        <!-- brand logo -->
        <div class="center-container py-3">
            <div>
                <img src="@/assets/icons/menu-white.png" :width="24" :height="24" alt="Home Icon">
                <span v-if="isExpanded" class="ml-2 has-text-white">burger</span>
            </div>
        </div>

        <!-- Navigation Links -->
        <div class="image-container">
            <RouterLink to="/" class="navbar-item has-text-white" active-class="is-active"
                exact-active-class="is-active">
                <img src="@/assets/icons/home-white.png" :width="34" :height="34" alt="Home Icon">
                <span v-if="isExpanded" class="ml-2 has-text-white">หน้าแรก</span>
            </RouterLink>
            <RouterLink to="/search" class="navbar-item has-text-white" active-class="is-active"
                exact-active-class="is-active">
                <img src="@/assets/icons/search-white.png" :width="34" :height="34" alt="Search Icon">
                <span v-if="isExpanded" class="has-text-white">ค้นหา</span>
            </RouterLink>

            <div @click="toggleDashboardMenu"
                class="is-flex navbar-item is-align-items-center is-justify-content-space-between">
                <img src="@/assets/icons/dashboard-white.png" :width="34" :height="34" alt="Dashboard Icon">
                <span v-if="isExpanded" class="ml-2">แดชบอร์ด</span>
            </div>

            <div @click="toggleDataMenu"
                class="is-flex navbar-item is-align-items-center is-justify-content-space-between">
                <img src="@/assets/icons/data-group-white.png" :width="34" :height="34" alt="Data Group Icon">
                <span v-if="isExpanded">ข้อมูล สปก.</span>
            </div>

            <RouterLink to="/history">
                <img src="@/assets/icons/history-white.png" :width="34" :height="34" alt="History Icon">
                <span v-if="isExpanded">ประวัติข้อมูล</span>
            </RouterLink>
            <RouterLink to="/addfile">
                <img src="@/assets/icons/addfile-white.png" :width="34" :height="34" alt="Add File Icon">
                <span v-if="isExpanded">เพิ่มข้อมูล</span>
            </RouterLink>
        </div>

        <!-- Bottom Navbar (fixed) -->
        <div class="center-container py-3" v-if="!isLogOut" @click="outOfSystem" style="cursor: pointer;">
            <img src="@/assets/icons/logout-white.png" :width="24" :height="24" alt="Logout Icon">
            <span v-if="isExpanded">ออกจากระบบ</span>
        </div>

    </div>
</template>

<script>
import { store } from '../store'
import { useUserStore } from '@/stores/useUserStore';

export default {
    data() {
        return {
            isLogOut: false,
            isDashboardMenuVisible: false,
            isDataMenuVisible: false,
            isExpanded: false,
            isLogOut: false,
        };
    },
    computed: {
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
        toggleDashboardMenu() {
            this.isDashboardMenuVisible = !this.isDashboardMenuVisible;
        },
        toggleDataMenu() {
            this.isDataMenuVisible = !this.isDataMenuVisible;
        },
        expandSidebar() {
            this.isExpanded = true;
        },
        collapseSidebar() {
            this.isExpanded = false;
        },
        changePath() {
            this.store.status_path_change = true
        },
        async outOfSystem() {
            const userStore = useUserStore();
            await userStore.out_of_system();
            isLogOut = !isLogOut
        },
    },
};
</script>

<style scoped>
.sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 5%;
    /* Sidebar takes 10% of the width */
    height: 100%;
    /* Full height */
    /* Example background for Sidebar */
    z-index: 10;
    /* Ensure sidebar stays on top */
    transition: width 0.3s ease;
}

.sidebar.expanded {
    width: 15%;
}

.dashboard-menu {
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    padding: 10px;
    margin-top: 5px;
    z-index: 20;
    position: fixed;
    top: 0;
    /* Adjust based on sidebar width */
}

.menu-item {
    padding: 5px 10px;
    cursor: pointer;
    color: #0C250E;
}

.menu-item:hover {
    background-color: #f0f0f0;
}

@media (max-width: 1280px) {
    .sidebar {
        width: 8%;
    }

    .sidebar.expanded {
        width: 12%;
    }
}

@media (max-width: 768px) {
    .sidebar {
        width: 10%;
    }

    .sidebar.expanded {
        width: 15%;
    }
}

@media (max-width: 500px) {
    .sidebar {
        top: 0;
        left: 0;
        width: 10%;
    }
}

.navbar-item.is-active {
    background-color: #3A3B3D;
    border-radius: 10px;
}

.center-container {
    display: flex;
    justify-content: center;
    /* Centers horizontally */
    align-items: center;
    /* Centers vertically */
}

.image-container {
    display: flex;
    /* Use Flexbox for layout */
    flex-direction: column;
    align-items: center;
    margin: auto;
    /* Center the images vertically */
    gap: 20px;
    /* Optional gap between the images */
    height: 100vh;
    /* Full height to center vertically within the viewport */
}

/* Transition Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 1s ease;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(-10px);
    /* Slide in from above */
}

.fade-slide-enter-to {
    opacity: 1;
    transform: translateY(0);
}

.fade-slide-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
    /* Slide out above */
}
</style>