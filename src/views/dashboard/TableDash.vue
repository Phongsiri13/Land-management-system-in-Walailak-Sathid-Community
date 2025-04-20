<template>
  <div>
    <p class="py-1 is-size-4 is-size-6-mobile has-text-centered titleBgColor mt-1">
      ผลการจัดสรรที่ดินในเขตปฏิรูปที่ดินในชุมชนสาธิต
    </p>
    <div class="container my-3">
      <div class="column is-three-quarters-tablet is-full-desktop is-four-fifths-mobile">
        <!-- ปุ่มส่งออกข้อมูล -->
        <div class="is-flex is-justify-content-flex-end mb-3">
          <div class="buttons">
            <button class="button is-primary" @click="exportToExcel"><span class="icon">
                <i class="fas fa-file-excel"></i> <!-- ไอคอน Excel จาก Font Awesome -->
              </span></button>
            <button class="button is-info" @click="exportToCSV">
              <span class="icon">
                <i class="fas fa-file-csv"></i> <!-- ไอคอน CSV จาก Font Awesome -->
              </span>
            </button>
          </div>
        </div>
        <div class="columns">
          <!-- control soi box -->
          <div class="column is-1 card my-2" style="overflow: auto; height: 100%;">
            <p class="has-text-centered title is-5">ซอย</p>
            <hr>
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

          <!-- table result -->
          <div class="column">
            <table class="table is-striped is-bordered is-hoverable is-fullwidth">
              <thead class="table-header">
                <tr>
                  <th style="width: 5%;">ซอย</th>
                  <th>สปก 4-01.</th>
                  <th>เกษตร</th>
                  <th>บุกรุก</th>
                  <th>กำลังจัดสรร</th>
                  <th>จำนวนไร่</th>
                  <th>ที่ดิน</th>
                </tr>
              </thead>
              <tbody>
                <transition-group name="slide-fade">
                  <tr v-for="(row, index) in rows" :key="row.id" v-show="isRowVisible(row)">
                    <td>{{ row.soi }}</td>
                    <td>{{ row.spaok }}</td>
                    <td>{{ row.agriculture_title }}</td>
                    <td>{{ row.occupied_area }}</td>
                    <td>{{ row.unclaimed_area }}</td>
                    <td>{{ formatRai(row.rai, row.ngan, row.square_wa) }}</td>
                    <td>{{ row.land }}</td>
                  </tr>
                </transition-group>

                <!-- Result Row (Total) -->
                <tr v-if="selectedRows.length > 1" key="result">
                  <td>ผลลัพธ์</td>
                  <td>{{ totalSpaok }} แปลง</td>
                  <td>{{ totalAgricultureTitle }} แปลง</td>
                  <td>{{ totalOccupiedArea }} แปลง</td>
                  <td>{{ totalUnclaimedArea }} แปลง</td>
                  <td>{{ totalsquare_wa }}</td>
                  <td>{{ totalLand }} แปลง</td>
                </tr>
                <tr v-if="selectedRows.length == 0">
                  <td colspan="7" class="has-text-centered has-text-danger is-size-5">กรุณาเลือกซอย</td>
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
import { convertSquareWaToRaiNganWa } from '@/utils/landFunc';

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
      totalsquare_wa: 0,
    };
  },
  methods: {
    exportToCSV() {
      const headers = ['ซอย', 'สปก 4-01.', 'การเกษตร', 'บุกรุก', 'ไม่มีผู้ถือครอง', 'จำนวนไร่', 'ที่ดิน'];
      const data = this.rows
        .filter(row => this.selectedRows.includes(row.id)) // กรองเฉพาะแถวที่เลือก
        .map(row => [
          row.soi,
          row.spaok,
          row.agriculture_title,
          row.occupied_area,
          row.unclaimed_area,
          this.formatRai(row.rai),
          row.land,
        ]);

      // เพิ่มข้อมูลสรุป (Totals) ลงในข้อมูล
      const totals = [
        'ผลลัพธ์',
        this.totalSpaok,
        this.totalAgricultureTitle,
        this.totalOccupiedArea,
        this.totalUnclaimedArea,
        this.totalsquare_wa,
        this.totalLand
      ];
      data.push(totals); // เพิ่มข้อมูลสรุปเป็นแถวสุดท้าย

      // สร้างเนื้อหา CSV
      const csvContent = [
        headers.join(','), // เพิ่มหัวข้อ
        ...data.map(row => row.join(',')) // เพิ่มข้อมูล
      ].join('console.log');

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
          สปก: row.spaok,
          การเกษตร: row.agriculture_title,
          บุกรุก: row.occupied_area,
          ไม่มีผู้ถือครอง: row.unclaimed_area,
          จำนวนไร่: this.formatRai(row.rai),
          ที่ดิน: row.land
        }));

      // เพิ่มข้อมูลสรุป (Totals) ลงในข้อมูล
      const totals = {
        ซอย: 'ผลลัพธ์',
        สปก: this.totalSpaok,
        การเกษตร: this.totalAgricultureTitle,
        บุกรุก: this.totalOccupiedArea,
        ไม่มีผู้ถือครอง: this.totalUnclaimedArea,
        จำนวนไร่: this.totalsquare_wa,
        ที่ดิน: this.totalLand
      };
      data.push(totals); // เพิ่มข้อมูลสรุปเป็นแถวสุดท้าย

      // สร้าง worksheet จากข้อมูล
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'ข้อมูลที่ดิน');

      // สร้างไฟล์ Excel และให้ผู้ใช้ดาวน์โหลด
      XLSX.writeFile(workbook, 'ข้อมูลที่ดิน.xlsx');
    },
    formatRai(landRai, landNgan, landSquareWa) {
      const raiArea = landRai ? landRai * 400 : 0; // แปลงไร่เป็นตารางวา
      const nganArea = landNgan ? landNgan * 100 : 0; // แปลงงานเป็นตารางวา
      const squareWaArea = landSquareWa ? landSquareWa : 0; // ตารางวา


      // รวมพื้นที่ทั้งหมดในตารางวา
      const totalSquareWa = raiArea + nganArea + squareWaArea;


      const { rai, ngan, squareWa } = convertSquareWaToRaiNganWa(totalSquareWa);
      return `${rai} ไร่ ${ngan} งาน ${squareWa} ตารางวา`;
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
      this.totalsquare_wa = '';

      let raiTotal = 0
      let nganTotal = 0
      let squareWaTotal = 0
      // Loop through each row and add up the values for rows that are selected (i.e., visible)
      this.rows.forEach(row => {
        const raiArea = row.rai ? row.rai * 400 : 0; // แปลงไร่เป็นตารางวา
        const nganArea = row.ngan ? row.ngan * 100 : 0; // แปลงงานเป็นตารางวา
        const squareWaArea = row.square_wa ? row.square_wa : 0; // ตารางวา
        const totalSquareWa = raiArea + nganArea + squareWaArea;
        if (this.selectedRows.includes(row.id)) {
          this.totalLand += row.land;
          this.totalSpaok += row.spaok;
          this.totalAgricultureTitle += row.agriculture_title;
          this.totalOccupiedArea += row.occupied_area;
          this.totalUnclaimedArea += row.unclaimed_area;
          raiTotal += row.rai,
            nganTotal += row.ngan,
            squareWaTotal += row.square_wa
        }
      });
      this.totalsquare_wa = this.formatRai(raiTotal, nganTotal, squareWaTotal);
      this.totalLand = this.totalLand
      this.totalSpaok = this.totalSpaok
      this.totalAgricultureTitle = this.totalAgricultureTitle
      this.totalOccupiedArea =  this.totalOccupiedArea
      this.totalUnclaimedArea =  this.totalUnclaimedArea
    }
  },
  watch: {
    selectedRows: 'calculateResults'
  },
  async created() {
    try {
      const res = await fetchTableDashboard();
      // console.log('res:', res)
      this.selectedRows = res[0]
      this.rows = res[1]
      console.log('res:', this.rows)

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