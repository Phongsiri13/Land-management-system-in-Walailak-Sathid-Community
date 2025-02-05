<template>
    <div class="primary_content">
        <div class="py-5 is-flex is-justify-content-center">
            <div class="column is-three-quarters-tablet is-four-fifths-desktop is-four-fifths-mobile">
                <div class="card">
                    <div class="card-content">
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
                            <div class="is-flex align-self">
                                <span class="px-1">แสดง </span>
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
                                <span class="px-1"> ตาราง</span>
                            </div>
                        </div>
                        <div class="table-container">
                            <table v-if="citizen_values.length"
                                class="table is-striped is-bordered is-hoverable is-fullwidth">
                                <thead>
                                    <tr>
                                        <th>ลำดับ</th>
                                        <th>ID-CARD</th>
                                        <th>ซอยที่อยู่</th>
                                        <th>ชื่อจริง - นามสกุล</th>
                                        <th>เบอร์โทรศัพท์</th>
                                        <th>ที่อยู่</th>
                                        <th>Action</th>
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
            citizen_values: [],
            searchQuery: '',
            searchFilter: 'name',
            selectedLimit: Number(this.$route.params.limit) || 10,
            currentPage: Number(this.$route.params.page) || 1,
            totalPages: 1
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
        async fetchCitizenData() {
            try {
                const response = await axios.get(`http://localhost:3000/citizen/${this.selectedLimit}/${this.currentPage}`);
                this.citizen_values = response.data.data.results || [];
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
            this.$router.push({ name: 'PersonDetail', params: { id } });
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
</style>