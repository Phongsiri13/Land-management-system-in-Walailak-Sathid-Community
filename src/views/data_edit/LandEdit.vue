<template>
  <div class="primary_content">
    <div class="py-5 is-flex is-justify-content-center">
      <div class="box column is-three-quarters-tablet is-three-quarters-desktop is-four-fifths-mobile">
        <h1 class="title has-text-centered py-2 has-text-link">แก้ไขรายละเอียดที่ดิน</h1>
        <form @submit.prevent="updateLand" class="px-3">
          <!-- ซอย -->
          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label"><strong class="has-text-danger">*</strong> ที่ตั้งของที่ดิน</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="formLand.selectedSoi" @change="validateField('selectedSoi')">
                      <option value="" selected>เลือกซอย</option>
                      <option v-for="soi in sois" :key="soi.value" :value="soi.value">
                        {{ soi.label }}
                      </option>
                    </select>
                    <DisplayError v-if="errors.selectedSoi" :err_text="errors.selectedSoi" />
                  </div>
                </div>
              </div>
            </div>

            <!-- เลือกซอยสถานะที่ดิน -->
            <div class="column">
              <div class="field">
                <label class="label"><strong class="has-text-danger">*</strong> สถานะที่ดิน</label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="formLand.selectedStatus" :class="{ 'is-danger': errors.selectedStatus }"
                      @change="validateField('selectedStatus')">
                      <option value="" selected>เลือกซอยสถานะที่ดิน</option>
                      <option v-for="land_status in land_status" :key="land_status.value" :value="land_status.value">
                        {{ land_status.label }}
                      </option>
                    </select>
                    <DisplayError v-if="errors.selectedStatus" :err_text="errors.selectedStatus" />
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
                  <input class="input is-normal custom-select" v-model="formLand.full_name" type="text"
                    placeholder="กรุณากรอกชื่อจริง - นามสกุล" />
                  <DisplayError v-if="errors.full_name" :err_text="errors.full_name" />
                </div>
              </div>
            </div>
          </div>

          <!-- โฉนดที่ดิน -->
          <div class="columns">
            <div class="column is-3">
              <div class="field">
                <label class="label"><strong class="has-text-danger">*</strong> แปลงเลขที่</label>
                <div class="control">
                  <input class="input is-normal custom-select" v-model="formLand.tf_number" type="text"
                    @input="validateField('tf_number')" :class="{ 'is-danger': errors.tf_number }"
                    placeholder="กรุณากรอกแปลงเลขที่" disabled />
                  <!-- <DisplayError v-if="errors.tf_number" :err_text="errors.tf_number" /> -->
                </div>
              </div>
            </div>

            <div class="column is-3">
              <div class="field">
                <label class="label"><strong class="has-text-danger">*</strong> ระวาง ส.ป.ก ที่</label>
                <div class="control">
                  <input class="input is-normal" :class="{ 'is-danger': errors.spk_area }"
                    @input="validateField('spk_area')" v-model="formLand.spk_area" type="text"
                    placeholder="กรุณากรอกกระวาง ส.ป.ก" disabled/>
                  <DisplayError v-if="errors.spk_area" :err_text="errors.spk_area" />
                </div>
              </div>
            </div>

            <div class="column is-3">
              <div class="field">
                <label class="label"><strong class="has-text-danger">*</strong> เลขที่</label>
                <div class="control">
                  <input class="input is-normal custom-select" :class="{ 'is-danger': errors.number }"
                    @input="validateField('number')" v-model="formLand.number" type="text"
                    placeholder="กรุณากรอกเลขที่" disabled />
                  <DisplayError v-if="errors.number" :err_text="errors.number" />
                </div>
              </div>
            </div>

            <div class="column is-3">
              <div class="field">
                <label class="label"><strong class="has-text-danger">*</strong> เล่ม</label>
                <div class="control">
                  <input class="input is-normal custom-select" :class="{ 'is-danger': errors.volume }"
                    @input="validateField('volume')" v-model="formLand.volume" type="text"
                    placeholder="กรุณากรอกเล่มที่" disabled/>
                  <DisplayError v-if="errors.volume" :err_text="errors.volume" />
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
                  <input class="input is-normal" :class="{ 'is-danger': errors.address_house }"
                    @input="validateField('address_house')" v-model="formLand.address_house" type="text"
                    placeholder="กรุณากรอกกอยู่บ้านเลขที่" />
                  <DisplayError v-if="errors.address_house" :err_text="errors.address_house" />
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
                    <select v-model="formLand.rai" :class="{ 'is-danger': errors.rai }" @change="validateField('rai')">
                      <option value="" selected>เลือกจำนวนไร่</option>
                      <option v-for="pfl in rais" :key="pfl.value" :value="pfl.value">
                        {{ pfl.label }}
                      </option>
                    </select>
                    <DisplayError v-if="errors.rai" :err_text="errors.rai" />
                  </div>
                </div>
              </div>
            </div>
            <!-- งาน -->
            <div class="column is-4">
              <div class="field">
                <label class="label">จำนวนงาน</label>
                <div class="control">
                  <input class="input is-normal" v-model="formLand.ngan" @input="validateField('ngan')"
                    :class="{ 'is-danger': errors.ngan }" step="0.01" max="4" type="number"
                    placeholder="กรุณากรอกจำนวนงาน" />
                  <DisplayError v-if="errors.ngan" :err_text="errors.ngan" />
                </div>
              </div>
            </div>
            <!-- ตารางวา -->
            <div class="column is-4">
              <div class="field">
                <label class="label">จำนวนตารางวา</label>
                <div class="control">
                  <input class="input is-normal" @input="validateField('square_wa')" step="0.01"
                    :class="{ 'is-danger': errors.square_wa }" v-model="formLand.square_wa" type="number"
                    placeholder="กรุณากรอกจำนวนตารางวา" max="100" />
                  <DisplayError v-if="errors.square_wa" :err_text="errors.square_wa" />
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
                  <input class="input is-normal" @input="validateField('lat')" step="0.000000001"
                    :class="{ 'is-danger': errors.lat }" v-model="formLand.lat" type="number"
                    placeholder="กรุณากรอกรัตติจูด" />
                  <DisplayError v-if="errors.lat" :err_text="errors.lat" />
                </div>
              </div>
            </div>

            <div class="column is-6">
              <div class="field">
                <label class="label">Long</label>
                <div class="control">
                  <input class="input is-normal" @input="validateField('long')" step="0.000000001"
                    :class="{ 'is-danger': errors.long }" v-model="formLand.long" type="number"
                    placeholder="กรุณากรอกลองติจูด" />
                  <DisplayError v-if="errors.long" :err_text="errors.long" />
                </div>
              </div>
            </div>
          </div>

          <!-- more detail -->
          <div class="columns">
            <div class="column">
              <label class="label">หมายเหตุ</label>
              <div class="control">
                <textarea class="textarea" @input="validateField('notation')" :class="{ 'is-danger': errors.notation }"
                  v-model="formLand.notation" placeholder="ระบุหมายเหตุ"></textarea>
                <DisplayError v-if="errors.notation" :err_text="errors.notation" />
              </div>
            </div>
          </div>

          <!-- -------------------------------------------- End โฉนด ------------------------------------------ -->
          <!-- submit to create land -->
          <div class="field is-grouped is-grouped-centered mt-4">

            <!-- Submit Button -->
            <button type="submit" class="button is-success is-medium is-size-5 is-rounded px-5 ml-3"
              :disabled="btnLoad">
              <span class="icon">
                <i class="fas fa-check"></i>
              </span>
              <span>{{ btnLoad ? 'กำลังตรวจสอบ' : 'ส่งข้อมูล' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { store } from '@/store';
import * as yup from "yup";
import { getRai } from '@/utils/addressFunc';
import axios from 'axios';
import { fetchSois, fetchLandStatus, fetchLandOne } from '@/api/apiLand';
import { fetchPeopleID, fetchPeopleName } from '@/api/apiPeople';
import Swal from 'sweetalert2';
import DisplayError from '@/components/form_valid/DisplayError.vue';
import { getLandModel, LandValidSchema } from '@/model/landModel';
import { calculateLandArea } from '@/utils/landFunc';
import { showErrorAlert, showWarningAlert, showSuccessAlert } from '@/utils/alertFunc';

export default {
  components: {
    DisplayError
  },
  data() {
    return {
      ID_LAND: "",
      formLand: {},
      oldFormLand: {},
      errors: {}, // Stores validation errors
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
      activedList: [
        { value: null, label: 'ไม่พบข้อมูล' },
      ],
      village: [],
      isNameSelected: false, // ใช้เพื่อตรวจสอบว่าเลือกชื่อจากแนะนำหรือยัง
      filteredNames: [], // รายชื่อที่กรองแล้ว
      prefix_name: null,
      btnLoad: false,
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
      }
    }
  },
  methods: {
    async updateVillageOptions(district) {
      // Update the village list based on subdistrict
      if (district === 'หัวตะพาน' || district === 'ไทรบุรี') {
        this.village = this.villageOptions[district];

        // If the current village is not in the new list, reset the village selection
        const isValidVillage = this.village.some(v => String(v.value) === String(this.formLand.village));

        if (!isValidVillage) {
          this.formLand.village = "";  // Reset if the current village is not valid for this subdistrict
        }
      } else {
        this.village = [];  // Clear village options if no valid subdistrict
        this.formLand.village = "";  // Reset village selection
      }

      // Reset error for village
      if (this.errors['village']) {
        this.errors['village'] = "";
      }

      // Trigger validation for subdistrict
      await this.validateField("district");
    },
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
    async updateLand() {
      console.log('ds')
      // ตรวจสอบข้อมูลที่กรอก
      const isValid = await this.validateForm();
      if (!isValid) {
        this.showErrorAlert();
        return;
      };
      // Compare form data with old data
      const hasChanges = this.compareData(this.formLand, this.oldFormLand);

      if (!hasChanges) {
        await showWarningAlert('ข้อมูลไม่มีการเปลี่ยน', 'กรุณาเปลี่ยนแปลงข้อมูลก่อนแก้ไข');
        return; // No changes to submit
      }

      const resCitizenID = await fetchPeopleID(this.formLand.id_card)
      console.log("res-d:",resCitizenID);

      if(!resCitizenID[0]){
        await showWarningAlert('ไม่มีราษฎรผู้นี้ในระบบ!', 'กรุณาเพิ่มราษฎรผู้นี้ก่อน');
      }

      // Check rai amount of land
      const cal_result = calculateLandArea(
        this.formLand.rai,
        this.formLand.ngan,
        this.formLand.square_wa);
      console.log('cal-re:', cal_result);
      if (cal_result === false) {
        console.error("จำนวนไร่ต้องไม่เกิน 5");
        await showErrorAlert("จำนวนเกิน 5 ไร่", "พื้นที่รวมเกิน 5 ไร่! โปรดตรวจสอบข้อมูลอีกครั้ง")
        return;
      } else {
        console.log("พื้นที่ที่คำนวณได้:", cal_result);
      }

      this.btnLoad = true
      store.status_path_change = true
      const form_data = {
        soi: this.formLand.selectedSoi,
        land_status: this.formLand.selectedStatus,
        id_card: this.formLand.id_card,
        address: this.formLand.address_house,
        village: this.formLand.village,
        district: this.formLand.district,
        long: this.formLand.long || null,
        lat: this.formLand.lat || null,
        notation: this.formLand.notation,
        rai: cal_result.rai,
        ngan: cal_result.ngan,
        square_wa: cal_result.squareWa,
      };

      console.log('Form submitted:', form_data);
      // this.resetForm();
      try {
        const response = await axios.put(`http://localhost:3000/land/${this.ID_LAND}`, form_data);
        console.log('Response:', response.data);
        // this.resetForm()
        this.showSuccessAlert()
      } catch (error) {
        console.error('Error:', error);
        this.showErrorAlert()
      }finally{
        this.btnLoad = false
        store.status_path_change = false
      }
    },
    resetForm() {
      // reset formLand
      this.formLand = { ...getLandModel };
      this.errors = {};
    },
    // Validate the whole form
    async validateField(field) {
      try {
        const schema = this.getValidationSchema();
        await schema.validateAt(field, this.formLand);
        console.log('field:', field)
        this.errors[field] = ""; // Clear error if valid
      } catch (err) {
        this.errors[field] = err.message; // Set error message
      }
    },
    async validateForm() {
      try {
        const schema = this.getValidationSchema();
        await schema.validate(this.formLand, { abortEarly: false });
        this.errors = {}; // Clear all errors
        return true;
      } catch (err) {
        this.errors = err.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          console.log('check-error:', curr.message)
          return acc;
        }, {});
        return false;
      }
    },
    async validateField(field) {
      try {
        const schema = this.getValidationSchema();
        await schema.validateAt(field, this.formLand);
        this.errors[field] = ""; // Clear error if valid
      } catch (err) {
        this.errors[field] = err.message; // Set error message
      }
    },
    getValidationSchema() {
      return yup.object().shape({ ...LandValidSchema });
    },
    compareData(newData, oldData) {
      for (const key in newData) {
        if (newData[key] !== oldData[key]) {
          return true; // If any field is different, return true (indicating a change)
        }
      }
      return false; // No changes detected
    }
  },
  watch: {
    // Watch for changes to square_wa
    'formLand.square_wa'(newValue) {
      if (newValue > 100) {
        this.formLand.square_wa = 100;
      }
    },
    // Watch for changes to ngan
    'formLand.ngan'(newValue) {
      if (newValue > 4) {
        this.formLand.ngan = 4;
      }
    },
    'formLand.long'(newValue) {
      if (newValue > 179.999999) {
        this.formLand.long = 179.999999;
      }
    },
    'formLand.lat'(newValue) {
      if (newValue > 89.999999) {
        this.formLand.lat = 89.999999;
      }
    },
    'formLand.district': async function (newSubdistrict) {
      // Update the village options when subdistrict changes
      await this.updateVillageOptions(newSubdistrict);
    }
  },
  async created() {
    try {
      const landID = this.$route.params.id;
      this.sois = await fetchSois()
      this.land_status = await fetchLandStatus()
      console.log('landID:', landID)
      const resLand = await fetchLandOne(landID)
      this.ID_LAND = resLand[0].id_land;
      const originalData = {
        full_name: '', // Full name needs to be provided separately if available
        id_card: resLand[0].id_card,
        selectedSoi: resLand[0].current_soi,
        selectedStatus: resLand[0].current_land_status,
        tf_number: resLand[0].tf_number,
        spk_area: resLand[0].spk_area,
        number: resLand[0].number,
        volume: resLand[0].volume,
        address_house: resLand[0].l_house_number,
        group_number: resLand[0].l_village_number,
        soi: resLand[0].current_soi, // Assuming 'soi' is equivalent to 'current_soi'
        rai: resLand[0].rai,
        ngan: resLand[0].ngan,
        square_wa: resLand[0].square_wa,
        district: resLand[0].l_district,
        village: resLand[0].l_village_number, // If 'village' needs to be the village number
        long: resLand[0].long,
        lat: resLand[0].lat,
        notation: resLand[0].notation,
      };
      this.formLand = { ...originalData };
      this.oldFormLand = { ...originalData };
      console.log(this.formLand.id_card)
      const resCitizenID = await fetchPeopleID(this.formLand.id_card)
      this.formLand['full_name'] = resCitizenID[0].first_name + ' ' + resCitizenID[0].last_name;
      this.oldFormLand['full_name'] = resCitizenID[0].first_name + ' ' + resCitizenID[0].last_name;
    } catch (err) {
      this.error = 'Error fetching sois: ' + err.message;
    }
  }
}
</script>

<style scoped>
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
  background-color: #2196F3;
}

#submitLand2 {
  background-color: #FFA726;
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

@media screen and (min-width: 1024px) and (max-width: 1215px) {
  .primary_content {
    margin-left: 5%;
  }
}
</style>
