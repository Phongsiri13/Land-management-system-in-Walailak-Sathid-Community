<template>
    <div class="primary_content">
        <div class="py-5 is-flex is-justify-content-center">
            <div class="column is-three-quarters-tablet is-four-fifths-desktop is-four-fifths-mobile">
                <div class="card">
                    <div class="card-content">
                        <h1 class="is-size-3 has-text-centered has-text-link">จัดการข้อมูลพื้นฐาน</h1>

                        <!-- Navigation Tabs -->
                        <nav class="tabs is-centered py-2">
                            <ul>
                                <li :class="{ 'is-active': $route.path.includes('manage_status') }">
                                    <router-link to="/manage_default_Information/manage_status">สถานะ</router-link>
                                </li>
                                <li :class="{ 'is-active': $route.path.includes('manage_file_type') }">
                                    <router-link to="/manage_default_Information/manage_file_type">ไฟล์ที่ดิน</router-link>
                                </li>
                                <li :class="{ 'is-active': $route.path.includes('manage_land_usage') }">
                                    <router-link to="/manage_default_Information/manage_land_usage">ประโยชน์การใช้ที่ดิน</router-link>
                                </li>
                                <li :class="{ 'is-active': $route.path.includes('manage_relation') }">
                                    <router-link to="/manage_default_Information/manage_relation">ความสัมพันธ์</router-link>
                                </li>
                            </ul>
                        </nav>

                        <!-- Nested Route View -->
                        <router-view />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ManageDefaultData'
}
</script>

<style scoped></style>