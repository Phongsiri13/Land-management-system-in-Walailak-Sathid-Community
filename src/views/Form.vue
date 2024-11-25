<template>
  <div class="formColor">
    <div class="container custom-container">
      <div class="py-3 m-5-mobile">
        <form @submit.prevent="creationSumbit">
          <!-- ซอย -->
          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">ซอย</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="formData.selectedSoi">
                      <option value="" disabled selected>เลือกซอย</option>
                      <option v-for="soi in sois" :key="soi.value" :value="soi.value">
                        {{ soi.label }}
                      </option>
                    </select>
                    <!-- <select>
                    <option>เลือกซอย</option>
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                    <option>8</option>
                    <option>9</option>
                    <option>10</option>
                    <option>11</option>
                    <option>12</option>
                    <option>13</option>
                  </select> -->
                  </div>
                </div>
              </div>
            </div>

            <div class="column">
              <div class="field">
                <label class="label">สถานะที่ดิน</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="formData.selectedStatus">
                      <option value="" disabled selected>เลือกซอยสถานะที่ดิน</option>
                      <option v-for="land_status in land_status" :key="land_status.value" :value="land_status.value">
                        {{ land_status.label }}
                      </option>
                    </select>
                    <!-- <select>
                    <option>เลือกซอยสถานะที่ดิน</option>
                    <option>โฉนดสปก 4-01</option>
                    <option>โฉนดเพื่อการเกษตร</option>
                    <option>ไม่มีผู้ถือครอง</option>
                    <option>บุกรุก</option>
                  </select> -->
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Confirm ID-CARD -->
          <div class="columns">
            <div class="column is-3">
              <div class="field">
                <label class="label">เลขบัตรประชาชน</label>
                <div class="control">
                  <input class="input is-normal" v-model="formData.id_card" type="number"
                    placeholder="กรุณากรอกเลขบัตรประชาชน" />
                </div>
              </div>
            </div>

            <!-- To check user exist -->
            <div class="column is-1">
              <div class="field">
                <label class="label">&nbsp;</label>
                <button class="button is-dark is-fullwidth" @click="getCardID" :disabled="btnLoad">
                  ตรวจสอบ
                </button>
              </div>
            </div>

            <div class="column is-2">
              <div class="field">
                <label class="label">คำนำหน้าชื่อ</label>
                <div class="control">
                  <input class="input is-normal" v-model="prefix_name" type="text" style="color: brown;"
                    placeholder="กรุณาตรวจสอบชื่อ" disabled />
                </div>
              </div>
            </div>

            <div class="column is-6">
              <div class="field">
                <label class="label">ชื่อจริง - นามสกุล</label>
                <div class="control">
                  <input class="input is-normal" v-model="formData.full_name" type="text" style="color: brown;"
                    placeholder="กรุณาตรวจสอบชื่อ" disabled />
                </div>
              </div>
            </div>
          </div>

          <!-- โฉนดที่ดิน -->
          <div class="columns">
            <div class="column is-3">
              <div class="field">
                <label class="label">แปลงเลขที่</label>
                <div class="control">
                  <input class="input is-normal" type="number" placeholder="กรุณากรอกกแปลงเลขที่" />
                </div>
              </div>
            </div>

            <div class="column is-3">
              <div class="field">
                <label class="label">ระวาง ส.ป.ก ที่</label>
                <div class="control">
                  <input class="input is-normal" type="text" placeholder="กรุณากรอกกระวาง ส.ป.ก" />
                </div>
              </div>
            </div>

            <div class="column is-3">
              <div class="field">
                <label class="label">เลขที่</label>
                <div class="control">
                  <input class="input is-normal" type="text" placeholder="กรุณากรอกเลขที่" />
                </div>
              </div>
            </div>

            <div class="column is-3">
              <div class="field">
                <label class="label">เล่ม</label>
                <div class="control">
                  <input class="input is-normal" type="number" placeholder="กรุณากรอกเล่มที่" />
                </div>
              </div>
            </div>
          </div>

          <!-- อยู่บ้านเลขที่ -->
          <div class="columns">
            <div class="column is-3">
              <div class="field">
                <label class="label">อยู่บ้านเลขที่</label>
                <div class="control">
                  <input class="input is-normal" type="text" placeholder="กรุณากรอกกอยู่บ้านเลขที่" />
                </div>
              </div>
            </div>

            <div class="column is-3">
              <div class="field">
                <label class="label">หมู่ที่</label>
                <div class="control">
                  <input class="input is-normal" type="text" placeholder="หมู่ที่" />
                </div>
              </div>
            </div>

            <div class="column is-3">
              <div class="field">
                <label class="label">ซอย</label>
                <div class="control">
                  <input class="input is-normal" type="text" placeholder="ซอย" />
                </div>
              </div>
            </div>

            <div class="column is-3">
              <div class="field">
                <label class="label">ถนน</label>
                <div class="control">
                  <input class="input is-normal" type="text" placeholder="ถนน" />
                </div>
              </div>
            </div>
          </div>

          <!-- Address -->
          <div class="columns">
            <div class="column is-4">
              <div class="field">
                <label class="label">ตำบล</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="formData.district">
                      <option value="">เลือกตำบล</option>
                      <option value="หัวตะพาน">หัวตะพาน</option>
                      <option value="ไทรบุรี">ไทรบุรี</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="column is-4">
              <div class="field">
                <label class="label">อำเภอ</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="formData.amphoe">
                      <option value="">เลือกอำเภอ</option>
                      <option value="ท่าศาลา">ท่าศาลา</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="column is-4">
              <div class="field">
                <label class="label">จังหวัด</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="formData.province">
                      <option value="">เลือกจังหวัด</option>
                      <option value="นครศรีธรรมราช">นครศรีธรรมราช</option>
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
                  <input class="input is-normal" type="number" placeholder="กรุณากรอกจำนวนไร่" />
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
              <label class="label">*หมายเหตุ</label>
              <div class="control">
                <textarea class="textarea" placeholder="ระบุหมายเหตุ"></textarea>
              </div>
            </div>
          </div>

          <!-- -------------------------------------------- End โฉนด ------------------------------------------ -->
          <!-- submit to create land -->
          <button class="button is-dark is-fullwidth" :disabled="btnLoad">
            {{ btnLoad ? 'กำลังตรวจสอบ' : 'สร้างที่ดิน' }}
          </button>
          <!-- @click="creationSumbit"  -->
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { store } from '@/store'
import axios from 'axios';


export default {
  data() {
    return {
      formData: {
        full_name: '',
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
        amphoe: '',
        province: '',
        long: '',
        lat: '',
        notation: ''
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
      sois: [
        { value: null, label: 'ไม่พบข้อมูล' },
      ],
      land_status: [
        { value: null, label: 'ไม่พบข้อมูล' }
      ],
      prefix_name: null,
      btnLoad: false
    }
  },
  methods: {
    creationSumbit() {
      this.btnLoad = true
      store.status_path_change = true
      console.log('s1:', this.formData.selectedSoi)
      console.log('s2:', this.formData.selectedStatus)
      const form_data = {
        sois: this.formData.selectedSoi,
        land_status: this.formData.selectedStatus,
        id_card: this.formData.id_card,
        district: this.formData.district,
        amphoe: this.formData.amphoe,
        province: this.formData.province
      };

      console.log('Form submitted:', form_data);
      this.resetForm();

      setTimeout(() => {
        this.btnLoad = false
        store.status_path_change = false
        // Reset form fields if needed
      }, 2000)
    },
    resetForm() {
      this.formData.selectedSoi = '';
      this.formData.selectedStatus = '';
      this.formData.id_card = '';
      this.formData.full_name = '';
    },
    async getCardID() {
      this.btnLoad = true
      store.status_path_change = true

      try {
        // if(this.id_card){

        // }
        const response = await axios.get(`http://localhost:3000/people/${this.formData.id_card}`);
        const data = response.data; // Handle the response data

        console.log('people:',data)
        this.formData.full_name = data.first_name + " " + data.last_name
        this.prefix_name = data.prefix_name

      } catch (err) {
        this.error = 'Error fetching data: ' + err.message;
      } finally {
        store.status_path_change = false
        this.btnLoad = false
      }
      // setTimeout(() => {
      //   this.btnLoad = false
      //   store.status_path_change = false
      //   if (this.id_card == "1900101241550") this.full_name = "เดวิด มาติเนส"
      //   else this.full_name = "Not Found"

      // }, 3000)
    }
  },
  async mounted() {
    try {
      const sois = await axios.get('http://localhost:3000/land/sois');
      // this.soils = response.data; // Assuming response.data is an array of objects
      if (sois.data.length > 0) {

      }
      this.sois = [];
      for (let i = 0; i < sois.data.length; i++) {
        let soi = sois.data[i].id_alley
        this.sois.push({ value: soi, label: `ซอย ${soi}` });
        // { value: 0, label: 'ซอย 0' },        
      }

      const landStatus = await axios.get('http://localhost:3000/land/land_status');

      // console.log(landStatus.data)
      this.land_status = [];
      if (landStatus.data.length > 0) {
        // landStatus.data
        for (let ls of landStatus.data) {
          // console.log(ls)
          this.land_status.push({ value: ls.ID_land_status, label: `${ls.land_status_name}` })
        }
      }

      console.log(landStatus.data)
      console.log(sois.data)
    } catch (err) {
      this.error = 'Error fetching sois: ' + err.message;
    }
  }
}
</script>

<style>
@media (max-width: 768px) {
  .m-5-mobile {
    padding: 5px;
    /* Adjust as needed */
  }
}

.formColor {
  /* #b0bec5 #66bb6a*/
  background-color: #b0bec5;
}

.custom-container {
  min-height: 100vh;
  /* Set the height to 1000px */
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
</style>
