<template>
    <div class="primary_content">
        <div class="py-5 is-flex is-justify-content-center">
            <div class="column is-three-quarters-tablet is-three-fifths-desktop is-full-mobile">
                <div class="card">
                    <div class="card-content">
                        <h1 class="is-size-3 has-text-centered">รายการข้อมูลทายาท</h1>
                        <!-- Content -->
                        <div class="table-container">
                            <ResponsiveContainer column-class="is-three-quarters-tablet is-full-desktop is-full-mobile">
                                <!-- Search -->
                                <div class="is-flex is-justify-content-space-between my-2">
                                    <div class="field has-addons full-screen-card">
                                        <div class="field">
                                            <div class="control" id="mySelect">
                                                <div class="select is-fullwidth">
                                                    <select v-model="searchType">
                                                        <option value="name">ชื่อ</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="control">
                                            <input v-model="searchQuery" class="input" type="text"
                                                placeholder="ค้นหา...">
                                        </div>
                                        <div class="control">
                                            <button class="button" @click="searchData">ค้นหา</button>
                                        </div>
                                    </div>
                                    <div class="is-flex is-align-items-center is-justify-content-center">
                                        <span class="px-2">แสดง 50 ตาราง</span>
                                    </div>
                                </div>
                                <table v-if="heir_values.length"
                                    class="table is-striped is-bordered is-hoverable is-fullwidth">
                                    <thead class="table-header">
                                        <tr>
                                            <th>ลำดับ</th>
                                            <!-- <th>รหัส</th> -->
                                            <th>ชื่อจริง - นามสกุล</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <HeirDataRow v-for="(heir, index) in heir_values" :key="heir.heir_id"
                                            :heirs="heir" :index="(currentPage - 1) * selectedLimit + index + 1"
                                            @view-detail="goToDetail(heir.heir_id)" />
                                    </tbody>
                                </table>
                                <div v-else>
                                    <hr class="navbar-divider" />
                                    ไม่พบข้อมูล
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
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import HeirDataRow from '@/components/display_table/HeirDataRow.vue';
import ResponsiveContainer from '@/components/layout/ResponsiveContainer.vue';
import { fullCheckMatchHeir } from '@/api/apiHeir';

export default {
    components: { HeirDataRow, ResponsiveContainer },
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
            search_status: false,
            heir_values: [],
            searchQuery: '',
            searchType: 'name',
            selectedLimit: 50,
            currentPage: Number(this.$route.params.page) || 1,
            totalPages: 1,
        };
    },
    watch: {
        '$route.params': {
            handler() {
                this.selectedLimit = 50;
                this.currentPage = Number(this.$route.params.page) || 1;
                this.fetchHeirData();
            },
            immediate: true
        }
    },
    methods: {
        async searchData() {
            console.log('hihi:',this.searchQuery)
            if (this.searchQuery == '') {
                this.searchQuery = '',
                this.$router.replace({
                        path: '/heir_data/50/1',
                    });
                try {
                    await this.fetchHeirData();
                } catch (error) {

                } finally {
                    return
                }
            }
            try {
                this.currentPage = 1;
                await this.fetchHeirData();
                // หลังจาก fetch ข้อมูลเสร็จแล้ว
                this.$router.replace({
                    path: `/heir_data/${this.selectedLimit}/${this.currentPage}`, // เปลี่ยน URL หลังจาก fetch ข้อมูลเสร็จ
                });
            } catch (error) {
                console.error('Error applying filters:', error);
            }
        },
        async fetchHeirData() {
            try {
                const response = await axios.get(`http://localhost:3000/heir/${this.selectedLimit}/${this.currentPage}`,{
                    params: {
                        searchQuery: this.searchQuery
                    },
                });
                this.heir_values = response.data.data.results || [];
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
            this.$router.push({ name: 'HeirDetail', params: { id } });
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