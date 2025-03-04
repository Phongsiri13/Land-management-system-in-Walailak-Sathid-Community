<template>
    <div class="primary_content">
        <div class="py-5 is-flex is-justify-content-center">
            <div class="modal" :class="{ 'is-active': isFilterModalActive }">
                <div class="modal-background" @click="isFilterModalActive = false"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">กรองข้อมูล</p>
                        <button class="delete" aria-label="close" @click="isFilterModalActive = false"></button>
                    </header>
                    <section class="modal-card-body">
                        <!-- Filter by Soi -->
                        <div class="field">
                            <label class="label">ซอย</label>
                            <div class="control">
                                <div class="select">
                                    <select v-model="selectedSoi">
                                        <option value="">ทั้งหมด</option>
                                        <option v-for="soi in 14" :key="soi" :value="soi - 1">ซอย {{ soi - 1 }}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <!-- Filter by District -->
                        <div class="field">
                            <label class="label">สถานะการใช้ที่ดิน </label>
                            <div class="control">
                                <div class="select">
                                    <select v-model="statusActived">
                                        <option value="">ทั้งหมด</option>
                                        <option value="1">ใช้สิทธิ์อยู่</option>
                                        <option value="0">ถูกยกเลิก</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <!-- content people's data -->
            <div class="column is-three-quarters-tablet is-four-fifths-desktop is-four-fifths-mobile">
                <div class="card">
                    <div class="card-content">
                        <h1 class="is-size-3 has-text-centered">รายการข้อมูลที่ดิน</h1>
                        <!-- f1 -->
                        <div class="is-flex is-justify-content-space-between my-2">
                            <div class="field has-addons full-screen-card">
                                <div class="field">
                                    <div class="control" id="mySelect">
                                        <div class="select is-fullwidth">
                                            <select v-model="searchType">
                                                <option value="LAND">แปลงเลขที่</option>
                                                <option value="NAME">ชื่อ</option>
                                                <option value="LANDSTATUS">สถานะ</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="control">
                                    <div class="select" v-if="searchType == 'LANDSTATUS'">
                                        <select v-model="searchQuery">
                                            <option value="" selected>ทั้งหมด</option>
                                            <option v-for="land_status in land_status" :key="land_status.value"
                                                :value="land_status.value">
                                                {{ land_status.label }}
                                            </option>
                                        </select>
                                    </div>
                                    <input v-model="searchQuery" v-else class="input" type="text"
                                        placeholder="ค้นหา...">
                                    <!-- searchType -->
                                </div>
                                <div class="control">
                                    <button class="button " @click="searchData">
                                        ค้นหา
                                    </button>
                                    <!-- Filter -->
                                    <div
                                        class="is-inline filter-style mx-2 p-1 is-justify-content-center is-align-content-center	">
                                        <!-- Filter Icon -->
                                        <span class="icon is-clickable" @click="isFilterModalActive = true">
                                            <i class="fas fa-filter"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <!-- จำนวนแสดงผล -->
                            <div class="is-flex align-self">
                                <div style="display: flex; justify-content: center; align-items: center;">
                                    <span class="px-1">แสดง </span>
                                </div>
                                <div class="field">
                                    <div class="control">
                                        <div class="select is-fullwidth">
                                            <select v-model="selectedLimit" @change="updateLimit">
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                                <option value="50">50</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div style="display: flex; justify-content: center; 
                                    align-items: center;">
                                    <span class="px-1"> ตาราง</span>
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
                                        :index="(currentPage - 1) * selectedLimit + index + 1"
                                        @view-detail="goToDetail(land.id_land)" />
                                </tbody>
                                <!-- <td>{{ formatPhoneNumber(land.phone_number) || '-'.repeat(10) }}</td> -->
                            </table>
                            <!-- load first data -->
                            <div v-else>
                                <hr class="navbar-divider" />
                                <p class="has-text-danger is-size-4">ไม่พบข้อมูล</p>
                            </div>
                        </div>
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

import axios from 'axios';
import LandDataRow from '@/components/display_table/LandDataRow.vue';
import { fetchLandStatus } from '@/api/apiLand';

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
            isFilterModalActive: false, // ควบคุมการแสดง modal
            searchResult: [],
            land_values: [],
            land_status: { value: null, label: 'ไม่พบข้อมูล' },
            server_failed: false,
            searchQuery: '',
            searchType: 'LAND',
            landDataList: [
                {
                    number: 219,
                    current_soi: 12,
                    fullname: "นายถนอม พนาลี",
                    phone: "083-2489-748",
                    landType: "โฉนดสปก 4-01",
                    usageStatus: 1,
                },
                {
                    number: 302,
                    current_soi: 20,
                    fullname: "นางสมหญิง ใจดี",
                    phone: "089-1234-567",
                    landType: "โฉนด น.ส.3 ก",
                    usageStatus: 0,
                },
            ],
            selectedLimit: Number(this.$route.params.limit) || 10,
            currentPage: Number(this.$route.params.page) || 1,
            totalPages: 1,
            selectedSoi: '', // เก็บค่าซอยที่เลือก
            statusActived: ''
        }
    },
    async mounted() {
        try {
            // await this.fetchCompleteLandData()
            const res = await fetchLandStatus();
            // console.log('res-status:', res)
            this.land_status = res
        } catch (error) {

        }
    },
    watch: {
        '$route.params': {
            handler() {
                this.selectedLimit = Number(this.$route.params.limit) || 10;
                this.currentPage = Number(this.$route.params.page) || 1;
                this.fetchCompleteLandData();
            },
            immediate: true
        },
        selectedSoi(newVal, oldVal) {
            this.$router.replace({
                path: '/land_data/10/1',
            });
            // console.log('selectedSoi changed from', oldVal, 'to', newVal);
            this.currentPage = 1; // รีเซ็ตหน้าเป็น 1 เมื่อมีการกรอง
            this.fetchCompleteLandData(); // ดึงข้อมูลใหม่
        },
        statusActived(newVal, oldVal) {
            this.$router.replace({
                path: '/land_data/10/1',
            });
            // console.log('selectedSoi changed from', oldVal, 'to', newVal);
            this.currentPage = 1; // รีเซ็ตหน้าเป็น 1 เมื่อมีการกรอง
            this.fetchCompleteLandData(); // ดึงข้อมูลใหม่
        }
    },
    methods: {
        openFilterModal() {
            this.isFilterModalActive = true;
        },
        updateLimit() {
            // อัปเดต URL ให้ตรงกับค่าที่ผู้ใช้เลือก
            this.$router.push(`/land_data/${this.selectedLimit}/${this.page}`);
        },
        setPage(page) {
            if (page !== this.currentPage) {
                this.$router.push({ params: { limit: this.selectedLimit, page } });
            }
        },
        async searchData() {
            if (this.searchQuery == '') {
                console.log('hi')
                this.selectedSoi = '', // เก็บค่าซอยที่เลือก
                    this.statusActived = '', // เก็บค่าเพศที่เลือก
                    this.searchQuery = '',
                    this.searchType = 'LAND',
                    this.$router.replace({
                        path: '/land_data/10/1',
                    });
                try {
                    await this.fetchCompleteLandData();
                } catch (error) {

                } finally {
                    return
                }
            }
            try {
                this.currentPage = 1;
                await this.fetchCompleteLandData();
                // หลังจาก fetch ข้อมูลเสร็จแล้ว
                this.$router.replace({
                    path: `/land_data/${this.selectedLimit}/${this.currentPage}`, // เปลี่ยน URL หลังจาก fetch ข้อมูลเสร็จ
                });
            } catch (error) {
                console.error('Error applying filters:', error);
            }
        },
        async fetchCompleteLandData() {
            try {
                const limit = this.limit;
                const page = this.page;
                // Send GET request to the endpoint /land/complete_land
                const response = await axios.get(`http://localhost:3000/land/complete_land/${limit}/${page}`, {
                    params: {
                        searchType: this.searchType,
                        searchQuery: this.searchQuery,
                        soi: this.selectedSoi,
                        statusActived: this.statusActived,
                    },
                });

                // Handle the response data
                console.log('Data:', response.data.data.results);
                if (response.data.data.results.length > 0) {
                    const landList = response.data.data.results;
                    if (response.data.data.results.length > 0) {
                        this.land_values = [...landList]
                        console.log(this.land_values)
                        console.log(this.land_values.length)
                    }
                    this.totalPages = Math.ceil(response.data.data.totalCount / this.selectedLimit);
                } else {
                    console.log('no data')
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
        goToDetail(id_land) {
            console.log('id:', id_land)
            console.log('id:', encodeURIComponent(id_land))
            // this.$router.push({ path: `/complete_view/${id_land}` });
            this.$router.push({ name: 'PersonDetail', params: { id: id_land } });
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
    background-color: rgba(24, 1, 29, 0.664);
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
    background-color: rgba(24, 1, 29, 0.664);
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

.filter-style {
    background-color: burlywood;
    border-radius: 5px;
    transition: background-color 0.3s ease-in-out, transform 0.2s ease-in-out;
}

.filter-style:hover {
    background-color: ghostwhite;
    transform: scale(1.05);
    /* ขยายเล็กน้อยเมื่อโฮเวอร์ */
}
</style>