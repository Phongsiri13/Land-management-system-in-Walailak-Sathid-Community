<template>
    <nav class="has-navbar-fixed-top navigator-color" role="navigation" aria-label="main navigation">
        <!-- ใช้ <transition> เพื่อเพิ่มเอฟเฟกต์แสดง/ซ่อน -->
        <transition name="slide-fade">
            <div class="navbar-menu navigator-color" style="border-top-left-radius: 10px; border-bottom-left-radius: 10px;"
            v-show="isNavbarVisible">
                <!-- Start Section -->
                <div class="navbar-item home-tag">
                    <RouterLink to="/" class="navbar-item" active-class="is-active" exact-active-class="is-active">
                        <span class="icon">
                            <i class="fas fa-home" style="color: white;"></i>
                        </span>
                    </RouterLink>
                </div>

                <div class="navbar-item">
                    <RouterLink to="/dashboard" class="navbar-item has-text-white" active-class="is-active"
                        exact-active-class="is-active">
                        <span class="icon">
                            <i class="fas fa-folder" style="color: white;"></i>
                        </span>
                    </RouterLink>
                </div>

                <!-- Middle Section -->
                <div class="navbar-start" style="display: flex; justify-content: center; align-items: center; flex: 1;">
                    <div class="field has-addons" style="width: 40%; max-width: 300px;">
                        <div class="control is-expanded">
                            <!-- search -->
                            <input class="input" type="text" placeholder="ค้นหา แปลงที่ดิน เช่น 7632"
                                v-model="searchQuery" />
                        </div>
                        <div class="control">
                            <button class="button " @click="search">
                                <span class="icon">
                                    <i class="fas fa-search"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>


                <!-- End Section -->
                <div class="navbar-item mx-5">
                    <RouterLink to="/login" class="navbar-item has-text-white" active-class="is-active"
                        exact-active-class="is-active">
                        <span class="icon">
                            <i class="fas fa-sign-out-alt" style="color: white;"></i>
                        </span>
                    </RouterLink>
                </div>
            </div>
        </transition>
    </nav>

    <!-- Icon สำหรับแสดง/ซ่อน Navbar -->
    <button class="toggle-navbar-button p-2 px-3" @click="toggleNavbar">
        <i :class="isNavbarVisible ? 'fas fa-times' : 'fas fa-bars'"></i>
    </button>

</template>

<script>
export default {
    data() {
        return {
            searchQuery: "",
            isNavbarVisible: false
        };
    },
    navbarIcon() {
        return this.isNavbarVisible ? "fas fa-times" : "fas fa-bars";
    },
    methods: {
        toggleNavbar() {
            this.isNavbarVisible = !this.isNavbarVisible;
        },
        search() {
            if (this.searchQuery === "") {
                alert('กรุณาระบุเลขที่ดิน');
                return;
            }
            this.$router.push({ path: '/search', query: { q: this.searchQuery } });
        }
    }
};
</script>

<style>
.navbar-menu {
    position: fixed;
    width: 95vw;
    /* ปรับให้ไม่เกินหน้าจอ */
    /* opacity: 0.9; */
    z-index: 4;
    left: 5vw;
    /* ใช้ left แทน margin-left */
}

.navbar-start {
    display: flex;
    justify-content: center;  /* จัดให้เนื้อหากลาง */
    flex: 1;
}

.field.has-addons {
    width: 60%;        /* ความกว้าง 60% */
    max-width: 500px;  /* ขนาดสูงสุด 500px */
}

/* ปุ่ม Toggle Navbar */
.toggle-navbar-button {
    border-radius: 50%;
    position: fixed;
    top: 10px;
    left: 10px;
    background-color: #333;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 22px;
    z-index: 5;
    min-width: 42x;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2); /* เงารอบปุ่ม */
}


/* Animation สำหรับ Navbar */
.slide-fade-enter-active {
    transition: all 0.5s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.5s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(-100%);
    opacity: 0;
}
</style>
