<template>
    <div class="primary_content">
        <div class="py-5 is-flex is-justify-content-center">
            <!-- Modal for land details -->
            <div class="modal" :class="{ 'is-active': isModalActive }">
                <div class="modal-background" @click="closeModal"></div>
                <div class="modal-content">
                    <div class="box">
                        <h3 class="title">ข้อมูลปัจจุบัน</h3>
                        <p :class="highlightDiff('id_card')" class="my-1"><strong>บัตรประชาชน:</strong> {{
                            formatIDCARD(citizen_data.ID_CARD) }}</p>
                        <p :class="highlightDiff('prefix_name')" class="my-1"><strong>คำนำหน้า:</strong> {{
                            citizen_data.prefix_name }}</p>
                        <p :class="highlightDiff('first_name')" class="my-1"><strong>ชื่อจริง:</strong> {{
                            citizen_data.first_name }}</p>
                        <p :class="highlightDiff('last_name')" class="my-1"><strong>นามสกุล:</strong> {{
                            citizen_data.last_name }}</p>
                        <p :class="highlightDiff('birthday')" class="my-1"><strong>วันเกิด:</strong> {{
                            ToThaiDate(citizen_data.birthday) }}</p>
                        <p :class="highlightDiff('house_number')" class="my-1"><strong>บ้านเลขที่:</strong> {{
                            citizen_data.house_number }}</p>
                        <p :class="highlightDiff('soi')" class="my-1"><strong>ซอย:</strong> {{ citizen_data.soi }}</p>
                        <p :class="highlightDiff('village_number')" class="my-1"><strong>หมู่ที่:</strong> {{
                            citizen_data.village_number }}</p>
                        <p :class="highlightDiff('district')" class="my-1"><strong>ตำบล:</strong> {{
                            citizen_data.district }}</p>
                        <p :class="highlightDiff('gender')" class="my-1"><strong>เพศ:</strong> {{ citizen_data.gender == '1' ? "ชาย" : "หญิง" }}
                        </p>

                        <hr>
                        <h3 class="title">ข้อมูลที่แก้ไข</h3>
                        <p :class="highlightDiff('id_card')" class="my-1"><strong>บัตรประชาชน:</strong> {{
                            formatIDCARD(history_data.CARD_ID) }}</p>
                        <p :class="highlightDiff('prefix_name')" class="my-1"><strong>คำนำหน้า:</strong> {{
                            history_data.prefix_name }}</p>
                        <p :class="highlightDiff('first_name')" class="my-1"><strong>ชื่อจริง:</strong> {{
                            history_data.first_name }}</p>
                        <p :class="highlightDiff('last_name')" class="my-1"><strong>นามสกุล:</strong> {{
                            history_data.last_name }}</p>
                        <p :class="highlightDiff('birthday')" class="my-1"><strong>วันเกิด:</strong> {{
                            ToThaiDate(history_data.birthday) }}</p>
                        <p :class="highlightDiff('house_number')" class="my-1"><strong>บ้านเลขที่:</strong> {{
                            history_data.house_number }}</p>
                        <p :class="highlightDiff('soi')" class="my-1"><strong>ซอย:</strong> {{ history_data.soi }}</p>
                        <p :class="highlightDiff('village_number')" class="my-1"><strong>หมู่ที่:</strong> {{
                            history_data.village_number }}</p>
                        <p :class="highlightDiff('district')" class="my-1"><strong>ตำบล:</strong> {{
                            history_data.district }}</p>
                        <p :class="highlightDiff('gender')" class="my-1"><strong>เพศ:</strong> {{ history_data.gender == '1' ? "ชาย" : "หญิง" }}
                        </p>

                        <button class="button is-primary is-dark my-2" @click="closeModal">ปิด</button>
                    </div>


                </div>
                <button class="modal-close is-large" aria-label="close" @click="closeModal"></button>
            </div>
            <div class="column is-three-quarters-tablet is-four-fifths-desktop is-four-fifths-mobile">
                <div class="card">
                    <div class="card-content">
                        <h1 class="is-size-4 has-text-centered">ประวัติการแก้ไขราษฎร</h1>
                        <!-- Search -->
                        <div class="is-flex is-justify-content-space-between my-2">
                            <div class="field has-addons full-screen-card">
                                <div class="field">
                                    <div class="control" id="mySelect">
                                        <div class="select is-fullwidth">
                                            <select v-model="searchFilter">
                                                <option value="name">ชื่อ</option>
                                                <option value="plotNumber">แปลงเลขที่</option>
                                                <option value="status">สถานะ</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="control">
                                    <input v-model="searchQuery" class="input" type="text" placeholder="ค้นหา...">
                                </div>
                                <div class="control">
                                    <button class="button" @click="fetchCitizenData">ค้นหา</button>
                                </div>
                            </div>
                            <div class="is-flex is-align-items-center is-justify-content-center">
                                <span class="px-2">แสดง</span>
                                <div class="field">
                                    <div class="control">
                                        <div class="select is-fullwidth">
                                            <select v-model="selectedLimit" @change="updateLimit">
                                                <option value="50" selected>50</option>
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
                                    <HistoryCitizenDataRow v-for="(citizen, index) in citizen_values"
                                        :key="citizen.ID_CARD" :ct="citizen"
                                        :index="(currentPage - 1) * selectedLimit + index + 1"
                                        @view-detail="goToDetail(citizen.id_h_citizen)" />
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
import HistoryCitizenDataRow from '@/components/display_table/HistoryCitizenDataRow.vue';
import { convertToThaiDate, formatIDCARD } from '@/utils/commonFunc';
import axios from 'axios';

export default {
    components: { HistoryCitizenDataRow },
    data() {
        return {
            citizen_values: [],
            searchQuery: '',
            searchFilter: 'name',
            selectedLimit: Number(this.$route.params.limit) || 10,
            currentPage: Number(this.$route.params.page) || 1,
            totalPages: 1,
            isModalActive: false, // สำหรับเปิด/ปิด modal
            history_data: {},
            citizen_data: {}
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
        }
    },
    methods: {
        formatIDCARD(ID_CARD) {
            return formatIDCARD(ID_CARD)
        },
        ToThaiDate(date) {
            return convertToThaiDate(date)
        },
        async fetchCitizenData() {
            try {
                const response = await axios.get(`http://localhost:3000/citizen/history_citizen/${this.selectedLimit}/${this.currentPage}`);
                this.citizen_values = response.data.data.results || [];
                this.totalPages = Math.ceil(response.data.data.totalCount / this.selectedLimit);
                // console.log(response.data.data.results)
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
        async goToDetail(ID_CARD) {
            console.log('id:', ID_CARD)
            this.isModalActive = true; // เปิด modal
            try {
                const response = await axios.get(`http://localhost:3000/citizen/history_citizen/${ID_CARD}`);
                console.log(response.data)
                this.history_data = response.data.resultsHistoryCitizen[0]
                this.citizen_data = response.data.resultsCitizen[0]
                console.log('history_data:', this.history_data)
                console.log('citizen_data:', this.citizen_data)

            } catch (error) {

            }
        },
        highlightDiff(field) {
            if (this.citizen_data[field] !== this.history_data[field]) {
                return "has-background-danger-light"; // ใช้ class ของ Bulma เพื่อ highlight สีแดง
            }
            return "";
        },
        closeModal() {
            this.isModalActive = false; // ปิด modal
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
    background-color: #fff;
    /* Remove border */
}

.pagination-link.is-current:hover {
    background-color: #333;
    /* Darker yellow/orange on hover */
}
</style>