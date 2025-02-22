<template>
    <div class="primary_content">
        <div class="py-5 is-flex is-justify-content-center">
            <!-- content people's data -->
            <div class="column is-three-quarters-tablet is-four-fifths-desktop is-four-fifths-mobile">
                <div class="card">
                    <div class="card-content">
                        <h1 class="is-size-4 has-text-centered">ประวัติการแก้ไขที่ดิน</h1>
                        <!-- f1 -->
                        <div class="is-flex is-justify-content-space-between my-2">
                            <div class="field has-addons full-screen-card">
                                <div class="field">
                                    <div class="control" id="mySelect">
                                        <div class="select is-fullwidth">
                                            <select>
                                                <option selected>ชื่อ</option>
                                                <option>แปลงเลขที่</option>
                                                <option>สถานะ</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="control">
                                    <input class="input" type="text" placeholder="ค้นหา...">
                                </div>
                                <div class="control">
                                    <button class="button ">
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
                                        :index="index + 1" @view-detail="goToDetail(land.id_land)" />
                                </tbody>
                                <!-- <td>{{ formatPhoneNumber(land.phone_number) || '-'.repeat(10) }}</td> -->
                            </table>
                            <!-- load first data -->
                            <div v-else>
                                <hr class="navbar-divider" />
                                ไม่พบข้อมูล
                            </div>
                        </div>
                        <!-- pages -->
                        <nav class="pagination" role="navigation" aria-label="pagination">
                            <ul class="pagination-list">
                                <li>
                                    <a class="pagination-link is-current" aria-label="Page 1" aria-current="page">1</a>
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
            searchResult: [],
            land_values: [],
            server_failed: false,
            landDataList: [],
            selectedLimit: 50
        }
    },
    async mounted() {
        try {
            await this.fetchCompleteLandData()
        } catch (error) {

        }
    },
    watch: {
        // อัปเดตค่า `selectedLimit` เมื่อ URL เปลี่ยน
        limit(newLimit) {
            this.selectedLimit = newLimit;
        }
    },
    methods: {
        updateLimit() {
            // อัปเดต URL ให้ตรงกับค่าที่ผู้ใช้เลือก
            this.$router.push(`/history_land/${this.selectedLimit}/${this.page}`);
        },
        async fetchCompleteLandData() {
            try {
                const page = this.page;
                // Send GET request to the endpoint /land/complete_land
                const response = await axios.get(`http://localhost:3000/land/history_land/${this.selectedLimit}/${page}`);

                // Handle the response data
                if (response.data) {
                    const landList = response.data.data;
                    if (response.data.data.length > 0) {
                        this.land_values = [...landList]
                        console.log(this.land_values)
                        console.log(this.land_values.length)
                    }
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