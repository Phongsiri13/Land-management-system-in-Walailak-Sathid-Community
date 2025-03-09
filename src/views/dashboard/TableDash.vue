<template>
  <div>
    <p class="py-1 is-size-4 is-size-6-mobile has-text-centered titleBgColor mt-1">
      ผลการจัดพื้นที่ในเขตปฏิรูปที่ดินในชุมชนสาธิต
    </p>
    <div class="container my-3">
      <div class="column is-three-quarters-tablet is-full-desktop is-four-fifths-mobile">
        <!-- ปุ่มส่งออกข้อมูล -->
        <div class="buttons">
          <button class="button is-primary" @click="exportToExcel">ส่งออกเป็น Excel</button>
          <button class="button is-info" @click="exportToCSV">ส่งออกเป็น CSV</button>
        </div>
        <div class="columns">
          <div class="column is-1 card my-2" style="max-height: 500px; overflow: auto;">
            <p class="has-text-centered title is-5">ซอย</p>
            <label class="checkbox">
              <input type="checkbox" @change="toggleAllVisibility" v-model="isAllVisible" checked />
            </label>
            <div v-for="(row, index) in rows" :key="row.id" class="my-2">
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
                  <th>ที่ดิน</th>
                  <th>สปก</th>
                  <th>การเกษตร</th>
                  <th>บุกรุก</th>
                  <th>ไม่มีผู้ถือครอง</th>
                  <th>จำนวนไร่</th>
                </tr>
              </thead>
              <tbody>
                <transition-group name="slide-fade">
                  <tr v-for="(row, index) in rows" :key="row.id" v-show="isRowVisible(row)">
                    <td>{{ row.soi }}</td>
                    <td>{{ row.land }}</td>
                    <td>{{ row.spaok }}</td>
                    <td>{{ row.agriculture_title }}</td>
                    <td>{{ row.occupied_area }}</td>
                    <td>{{ row.unclaimed_area }}</td>
                    <td>{{ formatRai(row.rai) }}</td>
                  </tr>
                </transition-group>

                <!-- Result Row (Total) -->
                <tr v-if="selectedRows.length != 0" key="result">
                  <td>ผลลัพธ์</td>
                  <td>{{ totalLand }}</td>
                  <td>{{ totalSpaok }}</td>
                  <td>{{ totalAgricultureTitle }}</td>
                  <td>{{ totalOccupiedArea }}</td>
                  <td>{{ totalUnclaimedArea }}</td>
                  <td>{{ formatRai(totalRai) }}</td>
                </tr>
                <tr v-else>
                  <td>กรุณาเลือกข้อมูล</td>
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
import { fetchTableDashboard } from '@/api/apiLand';
import * as XLSX from 'xlsx';
export default {
  data() {
    return {
      isAllVisible: true,
      selectedRows: [], // Initialize with all IDs selected
      rows: [],
      totalLand: 0,
      totalSpaok: 0,
      totalAgricultureTitle: 0,
      totalOccupiedArea: 0,
      totalUnclaimedArea: 0,
      totalRai: 0,
    };
  },
  methods: {
    exportToCSV() {
      const headers = ['ซอย', 'ที่ดิน', 'สปก', 'การเกษตร', 'บุกรุก', 'ไม่มีผู้ถือครอง', 'จำนวนไร่'];
      const data = this.rows
        .filter(row => this.selectedRows.includes(row.id)) // กรองเฉพาะแถวที่เลือก
        .map(row => [
          row.soi,
          row.land,
          row.spaok,
          row.agriculture_title,
          row.occupied_area,
          row.unclaimed_area,
          this.formatRai(row.rai)
        ]);

      // เพิ่มข้อมูลสรุป (Totals) ลงในข้อมูล
      const totals = [
        'ผลลัพธ์',
        this.totalLand,
        this.totalSpaok,
        this.totalAgricultureTitle,
        this.totalOccupiedArea,
        this.totalUnclaimedArea,
        this.formatRai(this.totalRai)
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
      link.download = 'ข้อมูลที่ดิน.csv';
      link.click();
    },
    exportToExcel() {
      // สร้างข้อมูลสำหรับ Excel จากแถวที่เลือก
      const data = this.rows
        .filter(row => this.selectedRows.includes(row.id)) // กรองเฉพาะแถวที่เลือก
        .map(row => ({
          ซอย: row.soi,
          ที่ดิน: row.land,
          สปก: row.spaok,
          การเกษตร: row.agriculture_title,
          บุกรุก: row.occupied_area,
          ไม่มีผู้ถือครอง: row.unclaimed_area,
          จำนวนไร่: this.formatRai(row.rai)
        }));

      // เพิ่มข้อมูลสรุป (Totals) ลงในข้อมูล
      const totals = {
        ซอย: 'ผลลัพธ์',
        ที่ดิน: this.totalLand,
        สปก: this.totalSpaok,
        การเกษตร: this.totalAgricultureTitle,
        บุกรุก: this.totalOccupiedArea,
        ไม่มีผู้ถือครอง: this.totalUnclaimedArea,
        จำนวนไร่: this.formatRai(this.totalRai)
      };
      data.push(totals); // เพิ่มข้อมูลสรุปเป็นแถวสุดท้าย

      // สร้าง worksheet จากข้อมูล
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'ข้อมูลที่ดิน');

      // สร้างไฟล์ Excel และให้ผู้ใช้ดาวน์โหลด
      XLSX.writeFile(workbook, 'ข้อมูลที่ดิน.xlsx');
    },
    formatRai(value) {
      // แปลงเป็นทศนิยม 2 ตำแหน่งและไม่ปัดเศษ
      return parseFloat(value.toFixed(2));
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
      // Check if the row's id is in selectedRows
      return this.selectedRows.includes(row.id);
    },
    calculateResults() {
      this.totalLand = 0;
      this.totalSpaok = 0;
      this.totalAgricultureTitle = 0;
      this.totalOccupiedArea = 0;
      this.totalUnclaimedArea = 0;
      this.totalRai = 0;

      // Loop through each row and add up the values for rows that are selected (i.e., visible)
      this.rows.forEach(row => {
        if (this.selectedRows.includes(row.id)) {
          this.totalLand += row.land;
          this.totalSpaok += row.spaok;
          this.totalAgricultureTitle += row.agriculture_title;
          this.totalOccupiedArea += row.occupied_area;
          this.totalUnclaimedArea += row.unclaimed_area;
          this.totalRai += row.rai;
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
      const res = await fetchTableDashboard();
      console.log('res:', res)
      this.selectedRows = res[0]
      this.rows = res[1]

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