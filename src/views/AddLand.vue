<template>
  <div class="primary_content">
    <div class="mx-5 py-5">
      <div class="box">
        <h1 class="title has-text-centered">รายละเอียดที่ดิน</h1>
        <div class="py-3 m-5-mobile">
          <form @submit.prevent="creationSumbit">
            <!-- ซอย -->
            <div class="columns">
              <div class="column">
                <div class="field">
                  <label class="label"><strong class="has-text-danger">*</strong> ที่ตั้งของที่ดิน</label>
                  <div class="control">
                    <div class="select is-fullwidth">
                      <select v-model="formLand.selectedSoi" formPeopleData>
                        <option value="" disabled selected>เลือกซอย</option>
                        <option v-for="soi in sois" :key="soi.value" :value="soi.value">
                          {{ soi.label }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div class="column">
                <div class="field">
                  <label class="label"><strong class="has-text-danger">*</strong> สถานะที่ดิน</label>
                  <div class="control">
                    <div class="select is-fullwidth">
                      <select v-model="formLand.selectedStatus" formPeopleData>
                        <option value="" disabled selected>เลือกซอยสถานะที่ดิน</option>
                        <option v-for="land_status in land_status" :key="land_status.value" :value="land_status.value">
                          {{ land_status.label }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div class="columns">
              <div class="column is-full">
                <div class="field">
                  <label class="label"><strong class="has-text-danger">*</strong> ชื่อจริง-นามสกุล</label>
                  <div class="control">
                    <input class="input is-normal custom-select" v-model="formPeopleData.full_name" type="text"
                      placeholder="กรุณากรอกชื่อจริง" @input="searchNames" @change="checkSelectedName" />
                  </div>
                </div>
              </div>
            </div>

            <!-- แสดงข้อความข้อผิดพลาด -->
            <div v-if="formPeopleData.full_name && filteredNames.length >= 0 && !isNameSelected" class="error-message">
              ไม่มีชื่อที่ตรงกับการค้นหา
            </div>
            <!-- แสดงรายการแนะนำ -->
            <div v-if="filteredNames.length > 0" class="suggestions">
              <ul>
                <li v-for="name in filteredNames" :key="name" @click="selectName(name)">
                  {{ name }}
                </li>
              </ul>
            </div>

            <!-- โฉนดที่ดิน -->
            <div class="columns">
              <div class="column is-3">
                <div class="field">
                  <label class="label"><strong class="has-text-danger">*</strong> แปลงเลขที่</label>
                  <div class="control">
                    <input class="input is-normal custom-select" type="number" placeholder="กรุณากรอกกแปลงเลขที่" />
                  </div>
                </div>
              </div>

              <div class="column is-3">
                <div class="field">
                  <label class="label"><strong class="has-text-danger">*</strong> ระวาง ส.ป.ก ที่</label>
                  <div class="control">
                    <input class="input is-normal" type="text" placeholder="กรุณากรอกกระวาง ส.ป.ก" />
                  </div>
                </div>
              </div>

              <div class="column is-3">
                <div class="field">
                  <label class="label"><strong class="has-text-danger">*</strong> เลขที่</label>
                  <div class="control">
                    <input class="input is-normal custom-select" type="text" placeholder="กรุณากรอกเลขที่" />
                  </div>
                </div>
              </div>

              <div class="column is-3">
                <div class="field">
                  <label class="label"><strong class="has-text-danger">*</strong> เล่ม</label>
                  <div class="control">
                    <input class="input is-normal custom-select" type="number" placeholder="กรุณากรอกเล่มที่" />
                  </div>
                </div>
              </div>
            </div>

            <!-- อยู่บ้านเลขที่ -->
            <div class="columns">
              <div class="column is-4">
                <div class="field">
                  <label class="label">อยู่บ้านเลขที่</label>
                  <div class="control">
                    <input class="input is-normal" type="text" placeholder="กรุณากรอกกอยู่บ้านเลขที่" />
                  </div>
                </div>
              </div>

              <div class="column is-4">
                <div class="field">
                  <label class="label">ตำบล</label>
                  <div class="control">
                    <div class="select is-fullwidth">
                      <select v-model="this.formLand.district" @change="updateVillage">
                        <option value="" selected>เลือกตำบล</option>
                        <option value="หัวตะพาน">หัวตะพาน</option>
                        <option value="ไทรบุรี">ไทรบุรี</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div class="column is-4">
                <div class="field">
                  <label class="label">หมู่ที่</label>
                  <div class="control">
                    <div class="select is-fullwidth">
                      <select v-model="formLand.village">
                        <option value="" selected>เลือกหมู่</option>
                        <option v-for="pfl in village" :key="pfl.value" :value="pfl.value">
                          {{ pfl.label }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- Amount land -->
            <div class="columns">
              <div class="column is-4">
                <div class="field">
                  <label class="label">จำนวนไร่</label>
                  <div class="control">
                    <div class="select is-fullwidth">
                      <select v-model="formLand.rai">
                        <option value="" selected>เลือกจำนวนไร่</option>
                        <option v-for="pfl in rais" :key="pfl.value" :value="pfl.value">
                          {{ pfl.label }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div class="column is-4">
                <div class="field">
                  <label class="label">จำนวนงาน</label>
                  <div class="control">
                    <input class="input is-normal" type="number" placeholder="กรุณากรอกจำนวนงาน" />
                  </div>
                </div>
              </div>

              <div class="column is-4">
                <div class="field">
                  <label class="label">จำนวนตารางวา</label>
                  <div class="control">
                    <input class="input is-normal" type="number" placeholder="กรุณากรอกจำนวนตารางวา" />
                  </div>
                </div>
              </div>
            </div>

            <!-- GIS location -->
            <div class="columns">
              <div class="column is-6">
                <div class="field">
                  <label class="label">Lat</label>
                  <div class="control">
                    <input class="input is-normal" type="number" placeholder="กรุณากรอกรัตติจูด" />
                  </div>
                </div>
              </div>

              <div class="column is-6">
                <div class="field">
                  <label class="label">Long</label>
                  <div class="control">
                    <input class="input is-normal" type="number" placeholder="กรุณากรอกลองติจูด" />
                  </div>
                </div>
              </div>
            </div>

            <!-- more detail -->
            <div class="columns">
              <div class="column">
                <label class="label">หมายเหตุ</label>
                <div class="control">
                  <textarea class="textarea" placeholder="ระบุหมายเหตุ"></textarea>
                </div>
              </div>
            </div>

            <!-- -------------------------------------------- End โฉนด ------------------------------------------ -->
            <!-- submit to create land -->
            <div class="field is-grouped is-grouped-centered mt-4">
              <p class="control">
                <button class="button-41 is-danger is-light is-rounded is-large clear-btn" id="submitLand2"
                  type="button" @click="resetForm">ล้างข้อมูล</button>
              </p>
              <p class="control">
                <button class="button is-fullwidth has-text-white " id="submitLand" :disabled="btnLoad">
                  {{ btnLoad ? 'กำลังตรวจสอบ' : 'สร้างที่ดิน' }}
                </button>
              </p>
            </div>
            <!-- @click="creationSumbit"  -->
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { store } from '@/store'
import { getRai, updateVillageOptions } from '@/utils/addressFunc';
import axios from 'axios';
import { fetchSois, fetchLandStatus } from '@/services/apiLand';

export default {
  data() {
    return {
      formLand: {
        id_card: '',
        selectedSoi: '',
        selectedStatus: '',
        transformNumber: '',
        spk_area: '',
        number: '',
        volume: '',
        address_house: '',
        group_number: '',
        soi: '',
        rai: '', // จำนวนไร่
        ngan: '', // จำนวนงาน
        square_wa: '', // จำนวนตาราง
        district: '',
        village: '',
        long: '',
        lat: '',
        notation: ''
      },
      formPeopleData: {
        id_card: '',
        full_name: ''
      },
      validForm: {
        id_card_err: '',
        transformNumber_err: '',
        spk_area_err: '',
        number_err: '',
        volume_err: '',
        address_house_err: '',
        group_number_err: '',
        soi_err: ''
      },
      rais: getRai(),
      sois: [
        { value: null, label: 'ไม่พบข้อมูล' },
      ],
      land_status: [
        { value: null, label: 'ไม่พบข้อมูล' }
      ],
      prefixListLand: [
        { value: null, label: 'ไม่พบข้อมูล' },
      ],
      village: [],
      namesList: ['John Doe', 'Jane Smith', 'John Son', 'John dom', 'John parjus',
        'James Brown', 'Jack Daniels', 'Jill Green'], // รายชื่อทั้งหมด
      isNameSelected: false, // ใช้เพื่อตรวจสอบว่าเลือกชื่อจากแนะนำหรือยัง
      filteredNames: [], // รายชื่อที่กรองแล้ว
      prefix_name: null,
      btnLoad: false
    }
  },
  methods: {
    checkSelectedName() {
      if (this.formPeopleData.full_name.length < 3) {
        this.filteredNames = this.namesList.filter(name =>
          name.toLowerCase().includes(this.formPeopleData.full_name.toLowerCase())
        );
        this.isNameSelected = false
        filteredNames = []
      }
    },
    searchNames() {
      if (this.formPeopleData.full_name.length > 3) {
        this.filteredNames = this.namesList.filter(name =>
          name.toLowerCase().includes(this.formPeopleData.full_name.toLowerCase())
        );
      } else {
        this.filteredNames = [];
      }

    },
    // ฟังก์ชันเลือกชื่อที่แนะนำ
    selectName(name) {
      this.formPeopleData.full_name = name;
      this.filteredNames = []; // ล้างแนะนำเมื่อเลือกชื่อ
      this.isNameSelected = true
    },
    updateVillage() {
      console.log('village:', this.formLand.district)
      this.village = updateVillageOptions(this.formLand.district)
      // console.log('result-village:', this.village)
      this.formLand.village = ""
    },
    creationSumbit() {
      this.btnLoad = true
      store.status_path_change = true
      console.log('s1:', this.formLand.selectedSoi)
      console.log('s2:', this.formLand.selectedStatus)
      const form_data = {
        sois: this.formLand.selectedSoi,
        land_status: this.formLand.selectedStatus,
        id_card: this.formLand.id_card,
        district: this.formLand.district,
        province: this.formLand.province
      };

      console.log('Form submitted:', form_data);
      // this.resetForm();

      setTimeout(() => {
        this.btnLoad = false
        store.status_path_change = false
        // Reset form fields if needed
      }, 2000)
    },
    resetForm() {
      this.formLand.selectedSoi = '';
      this.formLand.selectedStatus = '';
      this.formLand.id_card = '';
      this.formPeopleData.full_name = '';
    },
  },
  async mounted() {
    this.sois = await fetchSois()
    this.land_status = await fetchLandStatus()

    try {
      // console.log('soi:', this.sois.length)
      // const landStatus = await axios.get('http://localhost:3000/land/land_status');

      // // console.log(landStatus.data)
      // this.land_status = [];
      // if (landStatus.data.length > 0) {
      //   // landStatus.data
      //   for (let ls of landStatus.data) {
      //     // console.log(ls)
      //     this.land_status.push({ value: ls.ID_land_status, label: `${ls.land_status_name}` })
      //   }
      // }

      // console.log(landStatus.data)
      // console.log(sois.data)
      const prefix = await axios.get(`http://localhost:3000/people/prefix`);
      const data = prefix.data; // Handle the response data

      this.prefixListLand = []
      if (data.length > 0) {
        for (let d of data) {
          // console.log(d)
          this.prefixListLand.push({
            value: d.prefix_id,
            label: d.prefix_name
          },)
        }
      }
    } catch (err) {
      this.error = 'Error fetching sois: ' + err.message;
    }
  }
}
</script>

<style scoped>
@media (max-width: 768px) {
  .m-5-mobile {
    padding: 5px;
    /* Adjust as needed */
  }
}

/* Hide the default number input arrows in WebKit browsers */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Hide the default number input arrows in Firefox */
input[type='number'] {
  -moz-appearance: textfield;
  /* Firefox */
}

#submitLand {
  background-color: #4e4b32;
}

#submitLand2 {
  background-color: #4e4b32;
}

.suggestions {
  border: 1px solid #ccc;
  /* margin-top: 10px; */
  max-height: 150px;
  overflow-y: auto;
  position: absolute;
  background-color: white;
  width: 50%;
  z-index: 5;
}

.suggestions ul {
  list-style-type: none;
  padding: 0;
}

.suggestions li {
  padding: 8px;
  cursor: pointer;
}

.suggestions li:hover {
  background-color: #f0f0f0;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}
</style>
