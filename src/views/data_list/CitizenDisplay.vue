<template>
    <div class="primary_content">
        <div class="py-5 is-flex is-justify-content-center">
            <!-- Filter Modal -->
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
                            <label class="label">ตำบล</label>
                            <div class="control">
                                <div class="select">
                                    <select v-model="selectedDistrict">
                                        <option value="">ทั้งหมด</option>
                                        <option value="Huataphan">หัวตะพาน</option>
                                        <option value="Taiburi">ไทรบุรี</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <!-- content -->
            <div class="column is-three-quarters-tablet is-four-fifths-desktop is-four-fifths-mobile">
                <div class="card">
                    <div class="card-content">
                        <h1 class="is-size-3 has-text-centered">รายการข้อมูลราษฎร</h1>
                        <!-- Search -->
                        <div class="is-flex is-justify-content-space-between my-2">
                            <div class="field has-addons full-screen-card">
                                <div class="field">
                                    <div class="control" id="mySelect">
                                        <div class="select is-fullwidth">
                                            <select v-model="searchFilter">
                                                <option value="NAME">ชื่อ</option>
                                                <option value="PHONE">เบอร์โทรศัพท์</option>
                                                <option value="IDCARD">บัตรประชาชน</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="control">
                                    <input v-model="searchQuery" class="input" type="text" placeholder="ค้นหา...">
                                </div>
                                <div class="control">
                                    <button class="button" @click="searchData">ค้นหา</button>
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
                            <div class="is-flex is-align-items-center is-justify-content-center">
                                <span class="px-2">แสดง</span>
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
                                <span class="px-2">ตาราง</span>
                            </div>
                        </div>
                        <!-- Content -->
                        <div class="table-container">
                            <table v-if="citizen_values.length"
                                class="table is-striped is-bordered is-hoverable is-fullwidth">
                                <thead class="table-header">
                                    <tr>
                                        <th>ลำดับ</th>
                                        <th>ID-CARD</th>
                                        <th>ซอยที่อยู่</th>
                                        <th>ชื่อจริง - นามสกุล</th>
                                        <th>เบอร์โทรศัพท์</th>
                                        <th>ที่อยู่</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <CitizenDataRow v-for="(citizen, index) in citizen_values" :key="citizen.ID_CARD"
                                        :ct="citizen" :index="(currentPage - 1) * selectedLimit + index + 1"
                                        @view-detail="goToDetail(citizen.ID_CARD)" />
                                </tbody>
                            </table>
                            <div v-else>
                                <hr class="navbar-divider" />
                                ไม่พบข้อมูล
                            </div>
                        </div>

                        <!-- Control Page -->
                        <nav class="pagination" role="navigation" aria-label="pagination">
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
import CitizenDataRow from '@/components/display_table/CitizenDataRow.vue';

export default {
    components: { CitizenDataRow },
    data() {
        return {
            isFilterModalActive: false, // ควบคุมการแสดง modal
            filteredCitizens: [], // เก็บข้อมูลราษฎรหลังการกรอง
            selectedSoi: '', // เก็บค่าซอยที่เลือก
            // selectedGender: '', // เก็บค่าเพศที่เลือก
            selectedDistrict: '', // เก็บค่าเพศที่เลือก
            btnSearchStatus: false,
            citizen_values: [],
            searchQuery: '',
            searchFilter: 'NAME',
            selectedLimit: Number(this.$route.params.limit) || 10,
            currentPage: Number(this.$route.params.page) || 1,
            totalPages: 1,
        };
    },
    watch: {
        '$route.params': {
            handler() {
                this.selectedLimit = Number(this.$route.params.limit) || 10;
                this.currentPage = Number(this.$route.params.page) || 1;
                this.fetchCitizenData();
            },
            immediate: true
        },
        selectedSoi(newVal, oldVal) {
            this.$router.replace({
                path: '/citizen_data/10/1',
            });
            console.log('selectedSoi changed from', oldVal, 'to', newVal);
            this.currentPage = 1; // รีเซ็ตหน้าเป็น 1 เมื่อมีการกรอง
            this.fetchCitizenData(); // ดึงข้อมูลใหม่
        },
        selectedDistrict(newVal, oldVal) {
            this.$router.replace({
                path: '/citizen_data/10/1',
            });
            console.log('selectedDistrict changed from', oldVal, 'to', newVal);
            this.currentPage = 1; // รีเซ็ตหน้าเป็น 1 เมื่อมีการกรอง
            this.fetchCitizenData(); // ดึงข้อมูลใหม่
        },
    },
    methods: {
        async searchData() {
            if (this.searchQuery == '') {
                this.selectedSoi = '', // เก็บค่าซอยที่เลือก
                    this.selectedDistrict = '', // เก็บค่าเพศที่เลือก
                    this.searchQuery = '',
                    this.searchFilter = 'NAME',
                    this.$router.replace({
                        path: '/citizen_data/10/1',
                    });
                try {
                    await this.fetchCitizenData();
                } catch (error) {

                } finally {
                    return
                }
            }
            try {
                this.currentPage = 1;
                await this.fetchCitizenData();
                // หลังจาก fetch ข้อมูลเสร็จแล้ว
                this.$router.replace({
                    path: `/citizen_data/${this.selectedLimit}/${this.currentPage}`, // เปลี่ยน URL หลังจาก fetch ข้อมูลเสร็จ
                });
            } catch (error) {
                console.error('Error applying filters:', error);
            }
        },
        // เปิด modal และรีเซ็ตค่าการกรอง
        openFilterModal() {
            this.isFilterModalActive = true;
        },
        async fetchCitizenData() {
            try {
                const response = await axios.get(`http://localhost:3000/citizen/${this.selectedLimit}/${this.currentPage}`, {
                    params: {
                        searchType: this.searchFilter,
                        searchQuery: this.searchQuery,
                        soi: this.selectedSoi,
                        district: this.selectedDistrict,
                    },
                });
                this.citizen_values = response.data.data.results || [];
                console.log('response.data.data.results:', response.data.data.results)
                this.totalPages = Math.ceil(response.data.data.totalCount / this.selectedLimit);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        setPage(page) {
            if (page !== this.currentPage) {
                this.$router.push({ params: { limit: this.selectedLimit, page } });
            }
        },
        updateLimit() {
            this.$router.push({ params: { limit: this.selectedLimit, page: 1 } });
        },
        goToDetail(id) {
            this.$router.push({ name: 'CitizenDetail', params: { id } });
        }
    }
};
</script>

<style scoped>
.header-size-1 {
    width: auto;
    /* 25% width for Header 1 */
}

.table-header {
    background-color: rgba(4, 83, 10, 0.664);
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
    background-color: rgba(4, 83, 10, 0.664);
    /* Bulma's warning color */
    color: white;
    /* Make the text color white for contrast */
}

.pagination-link {
    border: none;
    background-color: #fff;
    /* Remove border */
}

.pagination-link.is-current:hover {
    background-color: #333;
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

/* สไตล์ modal */
.modal-card {
    width: 400px;
}
</style>