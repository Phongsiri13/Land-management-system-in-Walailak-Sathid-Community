<template>
    <div class="login-background">
        <div>
            <div class="login-container box">
                <div @click="goHome" class="go-back has-background-primary is-inline-block p-1">
                    <p>
                        <i class="fas fa-home"></i>
                        หน้าแรก
                    </p>
                </div>
                <div class="is-flex is-justify-content-center my-2">
                    <img src="../assets/plant_logo.png" alt="plant_logo" height="66" width="66">
                </div>
                <h2 class="title is-3 has-text-centered my-2">ยินดีต้อนรับ</h2>
                <form @submit.prevent="handleLogin">
                    <div class="field">
                        <label class="label" for="username">Username</label>
                        <div class="control has-icons-left">
                            <input class="input" type="text" id="username" v-model="username"
                                placeholder="Enter username" required />
                            <span class="icon is-small is-left">
                                <i class="fas fa-user"></i>
                            </span>
                        </div>
                        <p v-if="usernameError" class="help is-danger">{{ usernameError }}</p>
                    </div>

                    <div class="field">
                        <label class="label" for="password">Password</label>
                        <div class="control has-icons-left">
                            <input class="input" type="password" id="password" v-model="password"
                                placeholder="Enter password" required />
                            <span class="icon is-small is-left">
                                <i class="fas fa-lock"></i>
                            </span>
                        </div>
                        <p v-if="passwordError" class="help is-danger">{{ passwordError }}</p>
                    </div>

                    <div class="field">
                        <div class="control">
                            <button class="button is-primary is-fullwidth mt-5" :class="{ 'is-loading': btn_load }"
                                :disabled="btn_load" style="border-radius: 5px;">
                                {{ btn_load ? '...' : 'เข้าสู่ระบบ' }}
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '@/stores/useUserStore';

export default {
    data() {
        return {
            username: '',
            password: '',
            usernameError: '',
            passwordError: '',
            btn_load: false
        };
    },
    computed: {
        // ใช้ computed เพื่อเข้าถึง userRole ใน userStore state
        userRole() {
            return this.userStore.userRole;
        },
        isUser() {
            return this.userStore.isUser;
        }
    },
    methods: {
        goHome() {
            this.$router.push('/');
        },
        validateForm() {
            this.usernameError = this.username ? '' : 'Username is required';
            this.passwordError = this.password ? '' : 'Password is required';
            return !this.usernameError && !this.passwordError;
        },
        async handleLogin() {
            this.btn_load = true
            if (this.validateForm()) {
                console.log('username:', this.username)
                console.log('password:', this.password)
                // Add API call for login here if needed
            }
            this.userStore = useUserStore();
            const payload = { username: this.username, password: this.password };
            try {
                const response = await axios.post('http://localhost:3000/login', payload, { withCredentials: true });
                console.log("res:", response)
                console.log("role:", response.data.role)
                if(response.data.role){
                    this.userStore.setUserRole(response.data.role); // กำหนดค่า userRole เป็น "Admin"
                }
                // console.log("state:", this.userStore.userRole)
                // setTimeout(() => {
                //     this.btn_load = false
                // }, 2000);
                alert('Logged in successfully!');
                this.btn_load = false
                this.goHome();
            } catch (error) {
                console.error('Failed to fetch role', error);
                useUserStore.userRole = null;
                alert('Logged is failed!');
            } finally{
                this.btn_load = false;
            }
        }
    }
};
</script>

<style scoped>
.login-container {
    min-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(241, 229, 229, 0.37);
    position: relative;
    /* กำหนดให้เป็น relative เพื่อให้อยู่เหนือเลเยอร์สีทับ */
    z-index: 2;
    /* ให้กล่อง Login อยู่เหนือเลเยอร์สีทับ */
}

.login-background::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(22, 18, 18, 0.5);
    /* สีดำทับภาพพื้นหลังพร้อมความโปร่งแสง 50% */
    z-index: 1;
    /* ให้เลเยอร์สีทับอยู่บนภาพพื้นหลัง */
}

.login-background {
    background-image: url('../assets/land_img.jpg');
    /* เปลี่ยนเป็น path ของภาพของคุณ */
    background-size: cover;
    /* ทำให้ภาพครอบคลุมทั้งพื้นหลัง */
    background-position: center;
    /* จัดตำแหน่งภาพให้อยู่กลาง */
    min-height: 100vh;
    /* ทำให้พื้นหลังครอบคลุมทั้งหน้าจอ */
    display: flex;
    /* align-items: center; */
    justify-content: center;
}

.go-back {
    cursor: pointer;
    border-radius: 5px;
}
</style>