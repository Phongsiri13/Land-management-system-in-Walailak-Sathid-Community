<template>
    <div class="primary_content">
        <div class="py-5 is-flex is-justify-content-center">
            <!-- Modal for land details -->
            <div class="modal" :class="{ 'is-active': isModalActive }">
                <div class="modal-background" @click="closeModal"></div>
                <div class="modal-content">
                    <div class="box">
                        <div class="is-flex is-justify-content-space-between">
                            <h3 class="title">ข้อมูลปัจจุบัน</h3>
                            <p>วันที่แก้ไข: {{ ToThaiDate(history_data.updated_at) }}</p>
                        </div>
                        <p :class="highlightDiff('tf_number')" class="my-1"><strong>แปลงเลขที่:</strong> {{
                            land_data.tf_number }}
                        </p>
                        <p :class="highlightDiff('spk_area')" class="my-1"><strong>ระวาง:</strong> {{ land_data.spk_area
                            }}</p>
                        <p :class="highlightDiff('number')" class="my-1"><strong>เลขที่ดิน:</strong> {{ land_data.number
                            }}</p>
                        <p :class="highlightDiff('volume')" class="my-1"><strong>เล่ม:</strong> {{ land_data.volume }}
                        </p>
                        <p :class="highlightDiff('current_soi')" class="my-1"><strong>ซอย:</strong> {{
                            land_data.current_soi }}</p>
                        <p :class="highlightDiff('id_card')"><strong>บัตรประชาชน:</strong> {{ land_data.id_card }}</p>
                        <p :class="highlightDiff('land_status_name')" class="my-1"><strong>สถานะการใช้ที่ดิน:</strong>
                            {{
                                land_data.land_status_name }}</p>
                        <p :class="highlightDiff('l_house_number')" class="my-1"><strong>บ้านเลขที่:</strong> {{
                            land_data.l_house_number }}</p>
                        <p :class="highlightDiff('l_village_number')" class="my-1"><strong>หมู่ที่:</strong> {{
                            land_data.l_village_number }}</p>
                        <p :class="highlightDiff('l_district')" class="my-1"><strong>ตำบล:</strong> {{
                            land_data.l_district }}</p>
                        <p :class="highlightDiff('rai')" class="my-1"><strong>ไร่:</strong> {{ land_data.rai }}</p>
                        <p :class="highlightDiff('ngan')" class="my-1"><strong>งาน:</strong> {{ land_data.ngan }}</p>
                        <p :class="highlightDiff('square_wa')" class="my-1"><strong>ตารางวา:</strong> {{
                            land_data.square_wa }}</p>
                        <p :class="highlightDiff('lat')" class="my-1"><strong>lat:</strong> {{ land_data.lat }}</p>
                        <p :class="highlightDiff('long')" class="my-1"><strong>long:</strong> {{ land_data.long }}</p>
                        <p :class="highlightDiff('notation')" class="my-1"><strong>หมายเหตุ:</strong> {{
                            land_data.notation }}</p>
                        <p :class="highlightDiff('active')" class="my-1"><strong>กำลังใช้งาน:</strong> {{
                            land_data.active == '1' ? "ใช้สิทธิ์อยู่" : "ถูกยกเลิก" }}</p>

                        <hr>

                        <h3 class="title">ข้อมูลที่แก้ไข</h3>
                        <p :class="highlightDiff('tf_number')" class="my-1"><strong>แปลงเลขที่:</strong> {{
                            history_data.tf_number }}
                        </p>
                        <p :class="highlightDiff('spk_area')" class="my-1"><strong>ระวาง:</strong> {{
                            history_data.spk_area }}</p>
                        <p :class="highlightDiff('number')" class="my-1"><strong>เลขที่ดิน:</strong> {{
                            history_data.number }}</p>
                        <p :class="highlightDiff('volume')" class="my-1"><strong>เล่ม:</strong> {{ history_data.volume
                            }}</p>
                        <p :class="highlightDiff('current_soi')" class="my-1"><strong>ซอย:</strong> {{
                            history_data.current_soi }}
                        </p>
                        <p :class="highlightDiff('id_card')" class="my-1"><strong>บัตรประชาชน:</strong> {{
                            history_data.id_card }}</p>
                        <p :class="highlightDiff('land_status_name')" class="my-1"><strong>สถานะการใช้ที่ดิน:</strong>
                            {{
                                history_data.land_status_name }}</p>
                        <p :class="highlightDiff('l_house_number')" class="my-1"><strong>บ้านเลขที่:</strong> {{
                            history_data.l_house_number }}</p>
                        <p :class="highlightDiff('l_village_number')" class="my-1"><strong>หมู่ที่:</strong> {{
                            history_data.l_village_number }}</p>
                        <p :class="highlightDiff('l_district')" class="my-1"><strong>ตำบล:</strong> {{
                            history_data.l_district }}</p>
                        <p :class="highlightDiff('rai')" class="my-1"><strong>ไร่:</strong> {{ history_data.rai }}</p>
                        <p :class="highlightDiff('ngan')" class="my-1"><strong>งาน:</strong> {{ history_data.ngan }}</p>
                        <p :class="highlightDiff('square_wa')" class="my-1"><strong>ตารางวา:</strong> {{
                            history_data.square_wa }}
                        </p>
                        <p :class="highlightDiff('lat')"><strong>lat:</strong> {{ history_data.lat }}</p>
                        <p :class="highlightDiff('long')"><strong>long:</strong> {{ history_data.long }}</p>
                        <p :class="highlightDiff('notation')"><strong>หมายเหตุ:</strong> {{ history_data.notation }}</p>
                        <p :class="highlightDiff('active')"><strong>กำลังใช้งาน:</strong> {{ history_data.active == '1'
                            ? "ใช้สิทธิ์อยู่" : "ถูกยกเลิก" }}</p>

                        <button class="button is-link my-2" @click="closeModal">ปิด</button>
                    </div>

                </div>
                <button class="modal-close is-large" aria-label="close" @click="closeModal"></button>
            </div>

            <!-- content people's data -->
            <div class="column is-three-quarters-tablet is-four-fifths-desktop is-four-fifths-mobile">
                <div class="card">
                    <div class="card-content">
                        <h1 class="is-size-4 has-text-centered has-text-link">ประวัติการแก้ไขที่ดิน</h1>
                        <!-- f1 -->
                        <div class="is-flex is-justify-content-space-between my-2">
                            <div class="field has-addons full-screen-card">
                                <div class="field">
                                    <div class="control" id="mySelect">
                                        <div class="select is-fullwidth">
                                            <select v-model="searchType">
                                                <option value="LAND">แปลงเลขที่</option>
                                                <option value="NAME">ชื่อ</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="control">
                                    <input v-model="searchQuery" class="input" type="text" placeholder="ค้นหา...">
                                </div>
                                <div class="control">
                                    <button class="button " @click="searchData">
                                        ค้นหา
                                    </button>
                                </div>
                            </div>
                            <!-- จำนวนแสดงผล -->
                            <div class="is-flex align-self">
                                <div style="display: flex; justify-content: center; align-items: center;">
                                    <span class="px-1">แสดง 50 ตาราง</span>
                                </div>
                            </div>
                        </div>
                        <!-- f2 -->
                        <div class="table-container">
                            <table v-if="land_values.length != 0"
                                class="table is-striped is-bordered is-hoverable is-fullwidth">
                                <thead class="table-header">
                                    <tr>
                                        <th>ลำดับ</th>
                                        <th>แปลงเลขที่</th>
                                        <th>ซอยที่ดิน</th>
                                        <th>ชื่อจริง - นามสกุล</th>
                                        <th>เบอร์โทรศัพท์</th>
                                        <th>สถานะ</th>
                                        <th>สถานะการใช้ที่ดิน</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <LandDataRow v-for="(land, index) in land_values" :key="land.id_land" :land="land"
                                        :index="(currentPage - 1) * selectedLimit + index + 1" @view-detail="goToDetail(land.id_h_land)" />
                                </tbody>
                                <!-- <td>{{ formatPhoneNumber(land.phone_number) || '-'.repeat(10) }}</td> -->
                            </table>
                            <!-- load first data -->
                            <div v-else>
                                <hr class="navbar-divider" />
                                <span class="is-size-4 has-text-danger">ไม่พบข้อมูล</span>
                            </div>
                        </div>
                        <!-- pages -->
                        <!-- pages -->
                        <nav v-if="land_values.length != 0" class="pagination" role="navigation"
                            aria-label="pagination">
                            <ul class="pagination-list">
                                <li v-for="page in totalPages" :key="page">
                                    <a class="pagination-link" :class="{ 'is-current': page === currentPage }"
                                        @click="setPage(page)">
                                        {{ page }}
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DOMAIN_NAME from '@/config/domain_setup';
import axios from 'axios';
import LandDataRow from '@/components/display_table/LandDataRow.vue';
import { convertToThaiDate } from '@/utils/commonFunc';

export default {
    components: { LandDataRow },
    props: {
        limit: {
            type: String, // Vue Router params จะเป็น String เสมอ
            required: true
        },
        page: {
            type: String,
            default: "1"
        }
    },
    data() {
        return {
            searchQuery: '',
            searchType: 'LAND',
            searchResult: [],
            land_values: [],
            server_failed: false,
            landDataList: [],
            selectedLimit: 50,
            isModalActive: false, // สำหรับเปิด/ปิด modal
            history_data: {},
            land_data: {},
            totalPages: 1,
            currentPage: Number(this.$route.params.page) || 1,
        }
    },
    async mounted() {
        try {
            await this.fetchCompleteLandData()
        } catch (error) {

        }
    },
    watch: {
        '$route.params': {
            handler() {
                this.selectedLimit = Number(this.$route.params.limit) || 50;
                this.currentPage = Number(this.$route.params.page) || 1;
                this.fetchCompleteLandData();
            },
            immediate: true
        },
        // อัปเดตค่า `selectedLimit` เมื่อ URL เปลี่ยน
        limit(newLimit) {
            this.selectedLimit = newLimit;
        }
    },
    methods: {
        ToThaiDate(date) {
            return convertToThaiDate(date)
        },
        highlightDiff(field) {
            if (this.land_data[field] !== this.history_data[field]) {
                return "has-background-danger-light"; // ใช้ class ของ Bulma เพื่อ highlight สีแดง
            }
            return "";
        },
        updateLimit() {
            // อัปเดต URL ให้ตรงกับค่าที่ผู้ใช้เลือก
            this.$router.push(`/history_land/${this.selectedLimit}/${this.page}`);
        },
        setPage(page) {
            if (page !== this.currentPage) {
                this.$router.push({ params: { limit: this.selectedLimit, page } });
            }
        },
        async fetchCompleteLandData() {
            try {
                const page = this.page;
                // Send GET request to the endpoint /land/complete_land
                const response = await axios.get(`${DOMAIN_NAME}/land/history_land/${this.selectedLimit}/${page}`, {
                    withCredentials: true,
                    params: {
                        searchType: this.searchType,
                        searchQuery: this.searchQuery,
                    },
                });

                console.log("res:", response.data.data)

                // Handle the response data
                if (response.data.data.results.length > 0) {
                    const landList = response.data.data.results;
                    this.land_values = [...landList]
                    this.totalPages = Math.ceil(response.data.data.totalCount / this.selectedLimit);
                    console.log('this.totalPages:', this.totalPages)
                } else {
                    this.land_values = []
                }
            }
            catch (error) {
                this.server_failed = true
                // Handle errors
                if (error.response) {
                    // The request was made and the server responded with a status code outside the range of 2xx
                    console.error('Response error:', error.response.data);
                    console.error('Status:', error.response.status);
                    console.error('Headers:', error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error('Request error:', error.request);
                } else {
                    // Something else went wrong while setting up the request
                    console.error('General error:', error.message);
                }
            }
        },
        async goToDetail(id_land) {
            // console.log('id:', id_land)
            this.isModalActive = true; // เปิด modal
            try {
                const response = await axios.get(`${DOMAIN_NAME}/land/history_land/${id_land}`, {
                    withCredentials: true
                });
                // console.log(response.data)
                this.history_data = response.data.results_history[0]
                this.land_data = response.data.results_land[0]
                // console.log('history_data:', this.history_data)
                // console.log('land_data:', this.land_data)

            } catch (error) {

            }
        },
        closeModal() {
            this.isModalActive = false; // ปิด modal
        },
        async searchData() {
            if (this.searchQuery == '') {
                this.searchQuery = '',
                    this.searchType = 'LAND',
                    this.$router.replace({
                        path: '/history_land/50/1',
                    });
                try {
                    await this.fetchCompleteLandData();
                } catch (error) {

                } finally {

                }
            }
            try {
                this.currentPage = 1;
                await this.fetchCompleteLandData();
                // หลังจาก fetch ข้อมูลเสร็จแล้ว
                this.$router.replace({
                    path: `/history_land/${this.selectedLimit}/${this.currentPage}`, // เปลี่ยน URL หลังจาก fetch ข้อมูลเสร็จ
                });
            } catch (error) {
                console.error('Error applying filters:', error);
            }
        }
    },
}
</script>

<style scoped>
.header-size-1 {
    width: auto;
    /* 25% width for Header 1 */
}

.table-header {
    background-color: rgba(21, 26, 90, 0.664);
}

.table-header>tr>th {
    color: #fff;
}

#mySelect select {
    border-radius: 0;
}

.hoverable-row {
    transition: background-color 0.3s;
}

.hoverable-row:hover {
    cursor: pointer;
    /* Change this color for the hover effect */
    background-color: #333;
    color: #fff;
}

/* The icon should be hidden by default */
.copy-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
    transition: opacity 0.3s ease;
}

/* Make the td element clickable and show the icon on hover */
td.hoverable-row {
    position: relative;
}

td.hoverable-row:hover .copy-icon {
    opacity: 1;
}

.pagination-link.is-current {
    border-color: none;
    background-color: rgba(21, 26, 90, 0.664);
    /* Bulma's warning color */
    color: white;
    /* Make the text color white for contrast */
}

.pagination-link {
    border: none;
    /* Remove border */
}

.pagination-link.is-current:hover {
    background-color: #ffca28;
    /* Darker yellow/orange on hover */
}
</style>