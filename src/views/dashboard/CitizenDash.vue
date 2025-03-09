<template>
    <div>
        <p class="py-1 is-size-4 is-size-6-mobile has-text-centered titleBgColor">
            สรุปสถานะราษฎรในพื้นที่ชุมชนสาธิตวลัยลักษณ์
        </p>
        <div class="container my-3">
            <div class="column is-three-quarters-tablet is-full-desktop is-four-fifths-mobile">
                <!-- ปุ่มส่งออกข้อมูล -->
                <div class="buttons">
                    <!-- ปุ่มส่งออกเป็น Excel -->
                    <button class="button is-primary" @click="exportToExcel" title="ส่งออกเป็น Excel">
                        <span class="icon">
                            <i class="fas fa-file-excel"></i> <!-- ไอคอน Excel จาก Font Awesome -->
                        </span>
                    </button>

                    <!-- ปุ่มส่งออกเป็น CSV -->
                    <button class="button is-info" @click="exportToCSV" title="ส่งออกเป็น CSV">
                        <span class="icon">
                            <i class="fas fa-file-csv"></i> <!-- ไอคอน CSV จาก Font Awesome -->
                        </span>
                    </button>
                </div>
                <div class="columns">
                    <div class="column is-1 card my-2" style="max-height: 500px; overflow: auto;">
                        <label class="checkbox">
                            <p class="has-text-centered title is-5">ซอย</p>
                            <input type="checkbox" @change="toggleAllVisibility" v-model="isAllVisible" checked />
                        </label>
                        <div v-for="(row, index) in rows" :key="row.id" :class="['my-2', { 'my-0': index === 0 }]">
                            <label class="checkbox is-size-5">
                                <input class="large-checkbox" type="checkbox" v-model="selectedRows" :value="row.id" />
                                {{ row.soi }}
                            </label>
                        </div>
                    </div>
                    <!-- table -->
                    <div class="column">
                        <table class="table is-striped is-bordered is-hoverable is-fullwidth">
                            <thead class="table-header">
                                <tr>
                                    <th>ซอย</th>
                                    <th>ราษฎร</th>
                                    <th>หัวตะพาน</th>
                                    <th>ไทรบุรี</th>
                                    <th>ชาย</th>
                                    <th>หญิง</th>
                                </tr>
                            </thead>
                            <tbody>
                                <transition-group name="slide-fade">
                                    <tr v-for="(row, index) in rows" :key="row.id" v-show="isRowVisible(row)">
                                        <td>{{ row.soi }}</td>
                                        <td>{{ row.total_citizen }}</td>
                                        <td>{{ row.huataphan }}</td>
                                        <td>{{ row.taiburi }}</td>
                                        <td>{{ row.male }}</td>
                                        <td>{{ row.female }}</td>
                                    </tr>
                                </transition-group>

                                <!-- Result Row (Total) -->
                                <tr v-if="selectedRows.length != 0" key="result">
                                    <td>ผลลัพธ์</td>
                                    <td>{{ totalCitizen }}</td>
                                    <td>{{ totalHuataphan }}</td>
                                    <td>{{ totalTaiburi }}</td>
                                    <td>{{ totalMale }}</td>
                                    <td>{{ totalFemale }}</td>
                                </tr>
                                <tr v-else>
                                    <td colspan="7" class="has-text-centered is-4 has-text-danger">กรุณาเลือกข้อมูล</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { fetchCitizenTableDashboard } from '@/api/apiLand';
import { createObjectCsvWriter } from 'csv-writer';
import * as XLSX from 'xlsx';

export default {
    data() {
        return {
            isAllVisible: true,
            selectedRows: [], // Initialize with all IDs selected
            rows: [],
            totalCitizen: 0,
            totalHuataphan: 0,
            totalTaiburi: 0,
            totalMale: 0,
            totalFemale: 0,
            totalRai: 0,
            totalSelected: 0
        };
    },
    methods: {
        exportToCSV() {
            const headers = ['ซอย', 'ราษฎร', 'หัวตะพาน', 'ไทรบุรี', 'ชาย', 'หญิง'];
            const data = this.rows
                .filter(row => this.selectedRows.includes(row.id)) // กรองเฉพาะแถวที่เลือก
                .map(row => [
                    row.soi,
                    row.total_citizen,
                    row.huataphan,
                    row.taiburi,
                    row.male,
                    row.female,
                ]);

            // เพิ่มข้อมูลสรุป (Totals) ลงในข้อมูล
            const totals = [
                'ผลลัพธ์',
                this.totalCitizen,
                this.totalHuataphan,
                this.totalTaiburi,
                this.totalMale,
                this.totalFemale,
            ];
            data.push(totals); // เพิ่มข้อมูลสรุปเป็นแถวสุดท้าย

            // สร้างเนื้อหา CSV
            const csvContent = [
                headers.join(','), // เพิ่มหัวข้อ
                ...data.map(row => row.join(',')) // เพิ่มข้อมูล
            ].join('\n');

            // เพิ่ม BOM (Byte Order Mark) เพื่อรองรับ UTF-8
            const BOM = '\uFEFF'; // BOM สำหรับ UTF-8
            const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

            // สร้างไฟล์ CSV และให้ผู้ใช้ดาวน์โหลด
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'ข้อมูลราษฎร.csv';
            link.click();
        },
        exportToExcel() {
            // สร้างข้อมูลสำหรับ Excel จากแถวที่เลือก
            const data = this.rows
                .filter(row => this.selectedRows.includes(row.id)) // กรองเฉพาะแถวที่เลือก
                .map(row => ({
                    ซอย: row.soi,
                    ราษฎร: row.total_citizen,
                    หัวตะพาน: row.huataphan,
                    ไทรบุรี: row.taiburi,
                    ชาย: row.male,
                    หญิง: row.female
                }));

            // เพิ่มข้อมูลสรุป (Totals) ลงในข้อมูล
            const totals = {
                ซอย: 'ผลลัพธ์',
                ราษฎร: this.totalCitizen,
                หัวตะพาน: this.totalHuataphan,
                ไทรบุรี: this.totalTaiburi,
                ชาย: this.totalMale,
                หญิง: this.totalFemale,
            };
            data.push(totals); // เพิ่มข้อมูลสรุปเป็นแถวสุดท้าย

            // สร้าง worksheet จากข้อมูล
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'ข้อมูลราษฎร');

            // สร้างไฟล์ Excel และให้ผู้ใช้ดาวน์โหลด
            XLSX.writeFile(workbook, 'ข้อมูลราษฎร.xlsx');
        },
        toggleAllVisibility() {
            if (this.isAllVisible) {
                // ถ้าถูกเลือก → ให้เลือกทั้งหมด
                this.selectedRows = this.rows.map(row => row.id);
            } else {
                // ถ้าไม่ถูกเลือก → เอาออกทั้งหมด
                this.selectedRows = [];
            }
        },
        isRowVisible(row) {
            console.log("select:", this.selectedRows.length)
            if (this.selectedRows.length == this.totalSelected) {
                this.isAllVisible = true;
            } else this.isAllVisible = false;
            // Check if the row's id is in selectedRows
            return this.selectedRows.includes(row.id);
        },
        calculateResults() {
            this.totalCitizen = 0;
            this.totalHuataphan = 0;
            this.totalTaiburi = 0;
            this.totalMale = 0;
            this.totalFemale = 0;
            this.totalRai = 0;

            // Loop through each row and add up the values for rows that are selected (i.e., visible)
            this.rows.forEach(row => {
                if (this.selectedRows.includes(row.id)) {
                    this.totalCitizen += row.total_citizen;
                    this.totalHuataphan += row.huataphan;
                    this.totalTaiburi += row.taiburi;
                    this.totalMale += row.male;
                    this.totalFemale += row.female;
                }
            });
        }
    },
    watch: {
        selectedRows: 'calculateResults'
    },
    async created() {
        // this.calculateResults();
        try {
            const res = await fetchCitizenTableDashboard();
            console.log('res:', res)
            this.selectedRows = res[0]
            this.rows = res[1]
            this.totalSelected = res[0].length

        } catch (error) {
            console.log('err:', error)
        }
    }
};
</script>

<style scoped>
/* Optional: Styling checkboxes */
input[type="checkbox"] {
    margin: 0;
    padding: 0;
    cursor: pointer;
}

.large-checkbox {
    font-size: 1.5rem;
    padding-left: 0.5rem;
}

.large-checkbox-input {
    transform: scale(1.5);
    margin-right: 0.5rem;
}

/* Animation for rows */
.slide-fade-enter-active {
    transition: all 0.5s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.5s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}
</style>