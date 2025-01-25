<template>
  <div class="primary_content">
    <div class="mx-5 py-5">
      <div class="box">
        <h1 class="title has-text-centered">รายละเอียดของราษฎร</h1>

        <form @submit.prevent="submitCitizen">
          <div class="columns is-multiline">

            <div class="column is-half">
              <div class="field">
                <label class="label"><strong class="has-text-danger">*</strong> คำนำหน้าชื่อ</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="formPeopleData.prefix">
                      <option value="" selected>เลือกคำนำหน้าชื่อ</option>
                      <option v-for="pfl in prefixList" :key="pfl.value" :value="pfl.value">
                        {{ pfl.label }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-half">

            </div>

            <div class="column is-half">
              <div class="field">
                <label class="label"><strong class="has-text-danger">*</strong> ชื่อจริง</label>
                <div class="control">
                  <input class="input" type="text" v-model="formPeopleData.firstName" placeholder="กรุณากรอกชื่อจริง" />
                </div>
              </div>
            </div>

            <div class="column is-half">
              <div class="field">
                <label class="label"><strong class="has-text-danger">*</strong> นามสกุล</label>
                <div class="control">
                  <input class="input" type="text" v-model="formPeopleData.lastName" placeholder="กรุณากรอกนามสกุล" />
                </div>
              </div>
            </div>

            <div class="column is-half">
              <div class="field">
                <label class="label"><strong class="has-text-danger">*</strong> วันเดือนปีเกิด</label>
                <input class="input" type="date" v-model="formPeopleData.birthDate" />
                <div class="control">
                </div>
              </div>
            </div>

            <div class="column is-half">
              <div class="field">
                <label class="label has-text-weight-bold"><strong class="has-text-danger">*</strong> เลือกเพศ</label>
                <div class="control">
                  <div class="radio-group">
                    <label class="radio has-border-radius-4 p-2 mb-2 is-size-6">
                      <input type="radio" v-model="formPeopleData.gender" value="male">
                      <span class="ml-2">ชาย</span>
                    </label>
                    <label class="radio has-border-radius-4 p-2 mb-2 is-size-6">
                      <input type="radio" v-model="formPeopleData.gender" value="female">
                      <span class="ml-2">หญิง</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="column is-half">
              <div class="field">
                <label class="label"><strong class="has-text-danger">*</strong> เลขบัตรประชาชน</label>
                <div class="control">
                  <input class="input" type="text" v-model="formPeopleData.citizenId"
                    placeholder="กรุณากรอกเลขบัตรประชาชน" />
                </div>
              </div>
            </div>

            <div class="column is-half">
              <div class="field">
                <label class="label"><strong class="has-text-danger">*</strong> เบอร์โทรศัพท์</label>
                <div class="control">
                  <input class="input" type="tel" v-model="formPeopleData.phone" placeholder="กรุณากรอกเบอร์โทรศัพท์" />
                </div>
              </div>
            </div>

            <div class="column is-half">
              <div class="field">
                <label class="label">บ้านเลขที่</label>
                <div class="control">
                  <input class="input" type="text" placeholder="กรุณากรอกบ้านเลขที่"
                    v-model="formPeopleData.houseNumber" />
                </div>
              </div>
            </div>

            <div class="column is-half">
              <div class="field">
                <label class="label"><strong class="has-text-danger">*</strong> ตำบล</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="formPeopleData.subdistrict" @change="updateVillageOptions">
                      <option value="" selected>เลือกตำบล</option>
                      <option value="หัวตะพาน">หัวตะพาน</option>
                      <option value="ไทรบุรี">ไทรบุรี</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="column is-half">
              <div class="field">
                <label class="label"><strong class="has-text-danger">*</strong> หมู่ที่</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="formPeopleData.village">
                      <option value="" selected>เลือกหมู่</option>
                      <option v-for="pfl in village" :key="pfl.value" :value="pfl.value">
                        {{ pfl.label }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="column is-half">
              <div class="field">
                <label class="label"><strong class="has-text-danger">*</strong> อาศัยอยู่ในซอยใด</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="formPeopleData.selectedSoi">
                      <option value="" disabled selected>เลือกซอย</option>
                      <option v-for="soi in sois" :key="soi.value" :value="soi.value">
                        {{ soi.label }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Submit -->
          <div class="field is-grouped is-grouped-centered mt-4">
            <p class="control">
              <button class="button-41 is-light is-rounded is-large clear-btn" type="button"
                @click="resetForm">ล้างข้อมูล</button>
            </p>
            <p class="control">
              <button class="button-41 is-rounded is-large" type="submit">เพิ่มข้อมูล</button>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      formPeopleData: {
        prefix: '',
        firstName: '',
        lastName: '',
        birthDate: '',
        phone: '',
        citizenId: '',
        gender: '',
        selectedSoi: '',
        prefix: '',
        subdistrict: '',
        village: '',
        subdistrict: ''
      },
      sois: [
        { value: null, label: 'ไม่พบข้อมูล' },
      ],
      prefixList: [
        { value: null, label: 'ไม่พบข้อมูล' },
      ],
      village: [], // เพื่อเก็บหมู่ที่ตามตำบลที่เลือก
      villageOptions: {
        'หัวตะพาน': [
          { value: 1, label: 'หมู่ที่ 1 บ้านคลองดิน' },
          { value: 2, label: 'หมู่ที่ 2 บ้านฉิมพลี' },
          { value: 3, label: 'หมู่ที่ 3 บ้านคลองขุด' },
          { value: 4, label: 'หมู่ที่ 4 บ้านทุ่งตก' },
          { value: 5, label: 'หมู่ที่ 5 บ้านดอนยาง' },
          { value: 6, label: 'หมู่ที่ 6 บ้านทุ่งชน' },
          { value: 7, label: 'หมู่ที่ 7 บ้านวัดประดู่' },
          { value: 8, label: 'หมู่ที่ 8 บ้านสวนหมาก' },
          { value: 9, label: 'หมู่ที่ 9 บ้านคลองเกียบ' }
        ],
        'ไทรบุรี': [
          { value: 1, label: 'หมู่ที่ 1 บ้านโพธิ์' },
          { value: 2, label: 'หมู่ที่ 2 บ้านคูเถร' },
          { value: 3, label: 'หมู่ที่ 3 บ้านประตูช้างออก' },
          { value: 4, label: 'หมู่ที่ 4 บ้านในหัน' },
          { value: 5, label: 'หมู่ที่ 5 บ้านไม้มูก' },
          { value: 6, label: 'หมู่ที่ 6 บ้านปลักจอก' },
          { value: 7, label: 'หมู่ที่ 7 บ้านศาลาต้นท้อน' },
          { value: 8, label: 'หมู่ที่ 8 บ้านลุ่มนา' },
          { value: 9, label: 'หมู่ที่ 9 บ้านโคกเหล็ก' },
          { value: 10, label: 'หมู่ที่ 10 บ้านประตูช้างตก' }
        ]
      },
    };
  },
  methods: {
    showSuccessAlert() {
      Swal.fire({
        title: 'เพิ่มข้อมูลสำเร็จ!',
        text: 'ข้อมูลของคุณได้ถูกบันทึกเรียบร้อยแล้ว',
        icon: 'success', // ใช้ 'success' เพื่อแสดงไอคอนสีเขียว
        confirmButtonText: 'ตกลง'
      });
    },
    showErrorAlert() {
      Swal.fire({
        title: 'เพิ่มข้อมูลไม่สำเร็จ!',
        text: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง',
        icon: 'error', // ใช้ 'error' เพื่อแสดงไอคอนสีแดง
        confirmButtonText: 'ตกลง'
      });
    },
    updateVillageOptions() {
      if (this.formPeopleData.subdistrict === 'หัวตะพาน' || this.formPeopleData.subdistrict === 'ไทรบุรี') {
        this.village = this.villageOptions[this.formPeopleData.subdistrict];
      } else {
        this.village = [];
      }
    },
    submitForm() {
      alert('ข้อมูลถูกส่งเรียบร้อย: ' + JSON.stringify(this.formPeopleData));
    },
    async submitCitizen() {
      // ตรวจสอบข้อมูลที่กรอก
      if (!this.formPeopleData.firstName || !this.formPeopleData.lastName || !this.formPeopleData.citizenId) {
        alert("กรุณากรอกข้อมูลที่จำเป็น!");
        return;
      }

      console.log("p-data:", JSON.stringify(this.formPeopleData))

      // ส่งข้อมูลไปที่ API
      try {
        const response = await axios.post('http://localhost:3000/people', this.formPeopleData);
        console.log('Response:', response.data);
        this.showSuccessAlert()
      } catch (error) {
        console.error('Error:', error);
        this.showErrorAlert()
      }
    },
    resetForm() {
      this.formPeopleData = {
        prefix: '',
        firstName: '',
        lastName: '',
        birthDate: '',
        phone: '',
        citizenId: '',
        gender: '',
        selectedSoi: '',
        prefix: '',
        subdistrict: '',
        village: '',
        subdistrict: ''
      };
    },
  },
  async mounted() {
    try {
      const sois = await axios.get('http://localhost:3000/land/sois');

      this.sois = [];
      for (let i = 0; i < sois.data.length; i++) {
        let soi = sois.data[i].id_alley
        this.sois.push({ value: soi, label: `ซอย ${soi}` });
      }
    } catch (err) {
      this.error = 'Error fetching sois: ' + err.message;
    }

    try {
      const prefix = await axios.get(`http://localhost:3000/people/prefix`);
      const data = prefix.data; // Handle the response data

      this.prefixList = []
      if (data.length > 0) {
        for (let d of data) {
          // console.log(d)
          this.prefixList.push({
            value: d.prefix_id,
            label: d.prefix_name
          },)
        }
      }
    } catch (error) {
      this.error = 'Error fetching sois: ' + err.message;
    }
  }
};
</script>

<style scoped></style>
