<template>
  <div class="primary_content">
    <div class="mx-5 py-5 is-flex is-justify-content-center">
      <div class="box column is-three-quarters-tablet is-four-fifths-desktop is-four-fifths-mobile">
        <h1 class="title has-text-centered has-text-link py-2">เพิ่มข้อมูลของราษฎร</h1>

        <form @submit.prevent="submitCitizen">
          <div class="columns is-multiline">
            <!-- prefix -->
            <div class="column is-half">
              <div class="field">
                <label class="label">คำนำหน้าชื่อ <strong class="has-text-danger">*</strong></label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="formPeopleData.prefix">
                      <option value="" selected>เลือกคำนำหน้าชื่อ</option>
                      <option v-for="pfl in prefixList" :key="pfl.value" :value="pfl.value">
                        {{ pfl.label }}
                      </option>
                    </select>
                    <DisplayError v-if="errors.prefix" :err_text="errors.prefix" />
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-half">

            </div>

            <div class="column is-half">
              <div class="field">
                <label class="label">ชื่อจริง <strong class="has-text-danger">*</strong></label>
                <div class="control">
                  <input class="input" type="text" @input="validateField('firstName')"
                    v-model="formPeopleData.firstName" placeholder="กรุณากรอกชื่อจริง"
                    :class="{ 'is-danger': errors.firstName }" />
                  <!-- load -->
                  <DisplayError v-if="errors.firstName" :err_text="errors.firstName" />
                </div>
              </div>
            </div>

            <div class="column is-half">
              <div class="field">
                <label class="label">นามสกุล <strong class="has-text-danger">*</strong></label>
                <div class="control">
                  <input class="input" type="text" @input="validateField('lastName')"
                    :class="{ 'is-danger': errors.lastName }" v-model="formPeopleData.lastName"
                    placeholder="กรุณากรอกนามสกุล" />
                  <DisplayError v-if="errors.lastName" :err_text="errors.lastName" />
                </div>
              </div>
            </div>

            <div class="column is-half">
              <div class="birthDate">
                <label class="label">วันเดือนปีเกิด <strong class="has-text-danger">*</strong></label>
                <input class="input" type="date" :class="{ 'is-danger': errors.birthDate }"
                  v-model="formPeopleData.birthDate" @change="validateField('birthDate')" />
                <DisplayError v-if="errors.birthDate" :err_text="errors.birthDate" />
              </div>
            </div>

            <div class="column is-half">
              <div class="field">
                <label class="label has-text-weight-bold">เลือกเพศ <strong class="has-text-danger">*</strong></label>
                <div class="control">
                  <div class="radio-group">
                    <label class="radio has-border-radius-4 p-2 mb-2 is-size-6">
                      <input type="radio" disabled v-model="formPeopleData.gender" value="1"
                        @change="validateField('gender')">
                      <span class="ml-2">ชาย</span>
                    </label>
                    <label class="radio has-border-radius-4 p-2 mb-2 is-size-6">
                      <input type="radio" disabled v-model="formPeopleData.gender" value="0"
                        @change="validateField('gender')">
                      <span class="ml-2">หญิง</span>
                    </label>
                    <DisplayError v-if="errors.gender" :err_text="errors.gender" />
                  </div>
                </div>
              </div>
            </div>

            <div class="column is-half">
              <div class="field">
                <label class="label">เลขบัตรประชาชน <strong class="has-text-danger">*</strong></label>
                <div class="control">
                  <input class="input" type="text" @input="validateField('citizenId')"
                    :class="{ 'is-danger': errors.citizenId }" v-model="formPeopleData.citizenId"
                    placeholder="กรุณากรอกเลขบัตรประชาชน" />
                </div>
                <DisplayError v-if="errors.citizenId" :err_text="errors.citizenId" />
              </div>
            </div>

            <div class="column is-half">
              <div class="field">
                <label class="label">เบอร์โทรศัพท์ <strong class="has-text-danger">*</strong></label>
                <div class="control">
                  <input class="input" type="tel" v-model="formPeopleData.phone" @input="validateField('phone')"
                    :class="{ 'is-danger': errors.phone }" placeholder="กรุณากรอกเบอร์โทรศัพท์" />
                  <DisplayError v-if="errors.phone" :err_text="errors.phone" />
                </div>
              </div>
            </div>

            <div class="column is-half">
              <div class="field">
                <label class="label">บ้านเลขที่ <strong class="has-text-danger">*</strong></label>
                <div class="control">
                  <input class="input" type="text" placeholder="กรุณากรอกบ้านเลขที่"
                    :class="{ 'is-danger': errors.houseNumber }" @input="validateField('houseNumber')"
                    v-model="formPeopleData.houseNumber" />
                  <DisplayError v-if="errors.houseNumber" :err_text="errors.houseNumber" />
                </div>
              </div>
            </div>

            <div class="column is-half">
              <div class="field">
                <label class="label">ตำบล <strong class="has-text-danger">*</strong></label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="formPeopleData.subdistrict" :class="{ 'is-danger': errors.subdistrict }"
                      @change="updateVillageOptions">
                      <option value="" selected>เลือกตำบล</option>
                      <option value="หัวตะพาน">หัวตะพาน</option>
                      <option value="ไทยบุรี">ไทยบุรี</option>
                    </select>
                  </div>
                  <DisplayError v-if="errors.subdistrict" :err_text="errors.subdistrict" />
                </div>
              </div>
            </div>

            <div class="column is-half">
              <div class="field">
                <label class="label">หมู่ที่ <strong class="has-text-danger">*</strong></label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select @change="validateField('village')" v-model="formPeopleData.village">
                      <option value="" selected>เลือกหมู่</option>
                      <option v-for="pfl in village" :key="pfl.value" :value="pfl.value">
                        {{ pfl.label }}
                      </option>
                    </select>
                    <DisplayError v-if="errors.village" :err_text="errors.village" />
                  </div>
                </div>
              </div>
            </div>
            <!-- sois -->
            <div class="column is-half">
              <div class="field">
                <label class="label">ซอย <strong class="has-text-danger">*</strong></label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="formPeopleData.selectedSoi" @change="validateField('selectedSoi')">
                      <option value="" disabled selected>เลือกซอย</option>
                      <option v-for="soi in sois" :key="soi.value" :value="soi.value">
                        {{ soi.label }}
                      </option>
                    </select>
                    <DisplayError v-if="errors.selectedSoi" :err_text="errors.selectedSoi" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Submit -->
          <div class="field is-grouped is-grouped-centered py-3 is-flex is-justify-content-center">
            <!-- Reset Button -->
            <button type="button" class="button is-medium is-size-5 px-5" @click="resetForm" style="min-width: 150px;">
              <span>ยกเลิก</span>
            </button>

            <!-- Submit Button -->
            <button type="submit" class="button is-success is-medium is-size-5 px-5 ml-3" style="min-width: 150px;">
              <span>บันทึก</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import DOMAIN_NAME from '@/config/domain_setup';
import axios from 'axios';
import { Form, Field, ErrorMessage} from "vee-validate";
import * as yup from "yup";
import { getPeopleModel } from '@/model/citizenModel';
import { CitizenValidSchema } from '@/model/citizenModel';
import DisplayError from '@/components/form_valid/DisplayError.vue';
import { showErrorAlert, showSuccessAlert } from '@/utils/alertFunc';

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
    DisplayError
  },
  data() {
    return {
      isSubmitting: false,
      errors: {}, // Stores validation errors
      formPeopleData: { ...getPeopleModel },
      sois: [
        { value: null, label: 'ไม่พบข้อมูล' },
      ],
      prefixList: [
        { value: null, label: 'ไม่พบข้อมูล' },
      ],
      village: [], // เพื่อเก็บหมู่ที่ตามตำบลที่เลือก
      villageOptions: {
        'หัวตะพาน': [
          { value: '1', label: 'หมู่ที่ 1 บ้านคลองดิน' },
          { value: '2', label: 'หมู่ที่ 2 บ้านฉิมพลี' },
          { value: '3', label: 'หมู่ที่ 3 บ้านคลองขุด' },
          { value: '4', label: 'หมู่ที่ 4 บ้านทุ่งตก' },
          { value: '5', label: 'หมู่ที่ 5 บ้านดอนยาง' },
          { value: '6', label: 'หมู่ที่ 6 บ้านทุ่งชน' },
          { value: '7', label: 'หมู่ที่ 7 บ้านวัดประดู่' },
          { value: '8', label: 'หมู่ที่ 8 บ้านสวนหมาก' },
          { value: '9', label: 'หมู่ที่ 9 บ้านคลองเกียบ' }
        ],
        'ไทยบุรี': [
          { value: '1', label: 'หมู่ที่ 1 บ้านโพธิ์' },
          { value: '2', label: 'หมู่ที่ 2 บ้านคูเถร' },
          { value: '3', label: 'หมู่ที่ 3 บ้านประตูช้างออก' },
          { value: '4', label: 'หมู่ที่ 4 บ้านในหัน' },
          { value: '5', label: 'หมู่ที่ 5 บ้านไม้มูก' },
          { value: '6', label: 'หมู่ที่ 6 บ้านปลักจอก' },
          { value: '7', label: 'หมู่ที่ 7 บ้านศาลาต้นท้อน' },
          { value: '8', label: 'หมู่ที่ 8 บ้านลุ่มนา' },
          { value: '9', label: 'หมู่ที่ 9 บ้านโคกเหล็ก' },
          { value: '10', label: 'หมู่ที่ 10 บ้านประตูช้างตก' }
        ]
      },
    };
  },
  methods: {
    genderSelection() {
      // console.log('genderSelection:', this.formPeopleData.prefix)
      if (this.formPeopleData.prefix == '') {
        this.formPeopleData.gender = ''
      } else if (this.formPeopleData.prefix == 1) {
        this.formPeopleData.gender = '1'
      } else if (this.formPeopleData.prefix == 2) {
        this.formPeopleData.gender = '0'
      } else if (this.formPeopleData.prefix == 3) {
        this.formPeopleData.gender = '0'
      }
    },
    // Validate individual fields
    async validateField(field) {
      console.log('prefix:', field)
      try {
        const schema = this.getValidationSchema();
        await schema.validateAt(field, this.formPeopleData);
        console.log('field:', field)
        this.errors[field] = ""; // Clear error if valid
      } catch (err) {
        this.errors[field] = err.message; // Set error message
      }
    },
    // Validate the whole form
    async validateForm() {
      try {
        const schema = this.getValidationSchema();
        await schema.validate(this.formPeopleData, { abortEarly: false });
        this.errors = {}; // Clear all errors
        return true;
      } catch (err) {
        this.errors = err.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        return false;
      }
    },
    async updateVillageOptions() {
      if (this.formPeopleData.subdistrict === 'หัวตะพาน' || this.formPeopleData.subdistrict === 'ไทยบุรี') {
        this.village = this.villageOptions[this.formPeopleData.subdistrict];
      } else {
        this.village = [];
      }
      if (this.errors['village']) {
        this.errors['village'] = ""
      }
      this.formPeopleData.village = ""
      await this.validateField("subdistrict")
    },
    // schema
    getValidationSchema() {
      return yup.object().shape({ ...CitizenValidSchema });
    },
    async submitCitizen() {
      // ตรวจสอบข้อมูลที่กรอก
      const isValid = await this.validateForm();
      if (!isValid) return;

      // console.log("p-data:", JSON.stringify(this.formPeopleData))

      // ส่งข้อมูลไปที่ API
      try {
        const response = await axios.post(`${DOMAIN_NAME}/citizen`, this.formPeopleData, {
          withCredentials: true
        });
        console.log('Response:', response);
        await showSuccessAlert('การเพิ่มข้อมูลสำเร็จ!', response.data.message);
        this.resetForm();
      } catch (error) {
        console.error('Error:', error.response);
        let errorMessage = 'ไม่สำเร็จ';

        // ตรวจสอบว่ามี response กลับมาหรือไม่ (จาก backend)
        if (error.response) {
          if (error.response.status === 409) {
            errorMessage = error.response.data.message || 'ข้อมูลซ้ำในระบบ กรุณาตรวจสอบ';
          } else if (error.response.status === 500) {
            errorMessage = error.response.data.message || 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์';
          } else {
            errorMessage = error.response.data.message || 'เกิดข้อผิดพลาดที่ไม่คาดคิด';
          }
        } else if (error.request) {
          errorMessage = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้';
        } else {
          errorMessage = error.message || 'เกิดข้อผิดพลาดในการดำเนินการ';
        }
        await showErrorAlert('การเพิ่มข้อมูลไม่สำเร็จ!', errorMessage);
      } finally {
        this.errors = {}
      }
    },
    resetForm() {
      this.formPeopleData = {
        ...getPeopleModel
      };
      this.errors = {};
    },
  },
  async mounted() {
    try {
      const sois = await axios.get(`${DOMAIN_NAME}/land/sois`);

      this.sois = [];
      for (let i = 0; i < sois.data.length; i++) {
        let soi = sois.data[i].id_alley
        this.sois.push({ value: soi, label: `ซอย ${soi}` });
      }
    } catch (err) {
      this.error = 'Error fetching sois: ' + err.message;
    }
    try {
      const prefix = await axios.get(`${DOMAIN_NAME}/citizen/prefix`);
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
      this.error = 'Error fetching sois: ' + error.message;
    }
  },
  watch: {
    'formPeopleData.prefix'(newVal, oldVal) {
      this.genderSelection(); // เรียกฟังก์ชันเมื่อค่า prefix เปลี่ยน
      this.validateField('prefix'); // ตรวจสอบฟิลด์
    }
  }
};
</script>

<style scoped>
.button {
  border-radius: 5px;
}

.is-invalid {
  border-color: red;
}

.text-danger {
  font-size: 0.875rem;
}
</style>
