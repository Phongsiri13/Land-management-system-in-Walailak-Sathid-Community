<template>
    <div class="formColor">
        <div class="container is-fullhd custom-container">
            <!-- content people's data -->
            <div class="full-screen-card mx-5 py-5">
                <div class="card">
                    <div class="card-content">
                        <div class="content">
                            <!-- f1 -->
                            <div class="is-flex is-justify-content-space-between my-2">
                                <div class="field has-addons full-screen-card">
                                    <div class="field">
                                        <div class="control" id="mySelect">
                                            <div class="select is-fullwidth">
                                                <select>
                                                    <option selected>ชื่อ</option>
                                                    <option>สถานะ</option>
                                                    <option>บัตรประชาชน</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="control">
                                        <input class="input" type="text" placeholder="ค้นหา...">
                                    </div>
                                    <div class="control">
                                        <button class="button is-info">
                                            ค้นหา
                                        </button>
                                    </div>
                                </div>
                                <div class="is-flex align-self">
                                    <div style="display: flex; justify-content: center; align-items: center;">
                                        <span class="px-1">แสดง</span>
                                    </div>
                                    <div class="field">
                                        <div class="control">
                                            <div class="select is-fullwidth">
                                                <select>
                                                    <option selected>10</option>
                                                    <option>20</option>
                                                    <option>50</option>
                                                </select>

                                            </div>
                                        </div>
                                    </div>
                                    <div style="display: flex; justify-content: center; align-items: center;">
                                        <span class="px-1">ตาราง</span>
                                    </div>
                                </div>
                            </div>
                            <!-- f2 -->
                            <div class="table-container">
                                <table v-if="land_values.length != 0"
                                    class="table is-striped is-bordered is-hoverable is-fullwidth">
                                    <thead class="table-header">
                                        <tr class="is-success">
                                            <th>ลำดับ</th>
                                            <th>เลขบัตรประชาชน</th>
                                            <th>ซอย</th>
                                            <th>คำนำหน้าชื่อ</th>
                                            <th>ชื่อจริง - นามสกุล</th>
                                            <th>สถานะ</th>
                                            <th style="width: 270px;">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody v-if="land_values.length == 0">
                                        <tr @click="sayHi" class="hoverable-row">
                                            <td>1</td>
                                            <td>Data 2</td>
                                            <td>Data 3</td>
                                            <td>Data 4</td>
                                            <td>Data 4</td>
                                            <td>Data 4</td>
                                        </tr>
                                        <tr @click="fetchCompleteLandData" class="hoverable-row">
                                            <td>2</td>
                                            <td>Data 6</td>
                                            <td>Data 7</td>
                                            <td>Data 8</td>
                                            <td>Data 8</td>
                                            <td>Data 4</td>
                                        </tr>
                                        <tr>
                                            <td>3</td>
                                            <td>Data 10</td>
                                            <td>Data 11</td>
                                            <td>Data 12</td>
                                            <td>Data 12</td>
                                            <td>Data 4</td>
                                        </tr>
                                    </tbody>
                                    <tbody v-else>
                                        <!-- Dynamically render table rows using v-for -->
                                        <tr v-for="(land, index) in land_values" :key="land.id_land">
                                            <td>{{ ++index }}</td>
                                            <td class="hoverable-row" @click="copyToClipboard(land.ID)">{{ land.ID }}
                                                <span class="copy-icon" aria-hidden="true">📋</span>
                                            </td>
                                            <td>{{ land.current_soi }}</td>
                                            <td>{{ land.prefix_name }}</td>
                                            <td>{{ land.first_name + " " + land.last_name }}</td>
                                            <td>{{ land.land_status_name }}</td>
                                            <td>
                                                <div class="button-group">
                                                    <button class="button is-normal is-primary"
                                                    @click="goToDetail(land.id_land)">
                                                        <span class="icon">
                                                            <i class="fas fa-eye"></i>
                                                        </span>
                                                        <span>ดู</span>
                                                        <!-- <router-link :to="'/people_data/detail/' + land.id_land">
                                                            ดู
                                                        </router-link> -->
                                                    </button>
                                                    <button class="button is-normal is-warning mx-1">
                                                        <span class="icon">
                                                            <i class="fas fa-edit"></i>
                                                        </span>
                                                        <span>แก้ไข</span>
                                                    </button>
                                                    <button class="button is-normal is-danger">
                                                        <span class="icon">
                                                            <i class="fas fa-trash-alt"></i>
                                                        </span>
                                                        <span>ลบ</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <!-- load first data -->
                                <div class="" v-else>
                                    <hr class="navbar-divider" />
                                    <p>กำลังโหลดข้อมูล...</p>
                                </div>
                            </div>
                            <!-- f3 -->
                            <nav class="pagination" role="navigation" aria-label="pagination">
                                <a href="#" class="pagination-previous">Previous</a>
                                <a href="#" class="pagination-next">Next page</a>
                                <ul class="pagination-list">
                                    <li>
                                        <a href="#" class="pagination-link" aria-label="Goto page 1">1</a>
                                    </li>
                                    <li>
                                        <span class="pagination-ellipsis">&hellip;</span>
                                    </li>
                                    <li>
                                        <a href="#" class="pagination-link" aria-label="Goto page 45">45</a>
                                    </li>
                                    <li>
                                        <a class="pagination-link is-current" aria-label="Page 46"
                                            aria-current="page">46</a>
                                    </li>
                                    <li>
                                        <a href="#" class="pagination-link" aria-label="Goto page 47">47</a>
                                    </li>
                                    <li>
                                        <span class="pagination-ellipsis">&hellip;</span>
                                    </li>
                                    <li>
                                        <a href="#" class="pagination-link" aria-label="Goto page 86">86</a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    data() {
        return {
            searchResult: [],
            land_values: []
        }
    },
    mounted() {
        setTimeout(() => {
            this.fetchCompleteLandData()
        }, 1000);
    },
    methods: {
        sayHi() {
            alert('hhhh')
        },
        copyToClipboard(id) {
            // Use the Clipboard API to copy the text
            navigator.clipboard.writeText(id).then(() => {
                // Optionally, you can show a success message
                alert(`Copied: ${id}`);
            }).catch(err => {
                // Handle error, if any
                console.error('Failed to copy: ', err);
            });
        },
        async fetchCompleteLandData() {
            try {
                // Send GET request to the endpoint /land/complete_land
                const response = await axios.get('http://localhost:3000/land/complete_land');

                // Handle the response data
                console.log('Data:', response.data);
                // alert(response.data)
                // this.land_values = response.data
                // Store the HTML row in a variable as a string
                if (response.data.length > 0) {
                    this.land_values = response.data
                    console.log(this.land_values)
                }
            } catch (error) {
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
        goToDetail(id) {
            this.$router.push({ name: 'PersonDetail', params: { id } });
        }
    }
}
</script>
<style scoped>
.header-size-1 {
    width: auto;
    /* 25% width for Header 1 */
}

.table-header {
    background-color: #3273dc;
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
</style>