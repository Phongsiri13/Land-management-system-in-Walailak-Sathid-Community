<template>
  <div class="primary_content">
    <div class="py-5 is-flex is-justify-content-center">
      <div class="box column is-three-quarters-tablet is-three-quarters-desktop is-four-fifths-mobile">
        <h1 class="title has-text-centered has-text-link py-2">เพิ่มข้อมูลที่ดิน</h1>
        <form @submit.prevent="creationLand" class="px-3">
          <!-- ซอย -->
          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">ซอย <strong class="has-text-danger">*</strong></label>
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
                <label class="label">สถานะที่ดิน <strong class="has-text-danger">*</strong></label>
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
                <label class="label">ชื่อจริง-นามสกุล <strong class="has-text-danger">*</strong></label>
                <div class="control">
                  <input class="input is-normal custom-select" v-model="full_name" type="text"
                    :class="{ 'is-danger': errors.full_name }" placeholder="กรุณากรอกชื่อจริง - นามสกุล"
                    @input="validateField('full_name')" />
                  <DisplayError v-if="errors.full_name" :err_text="errors.full_name" />
                </div>
              </div>
            </div>
          </div>

          <!-- โฉนดที่ดิน -->
          <div class="columns">
            <div class="column is-3">
              <div class="field">
                <label class="label">แปลงเลขที่ <strong class="has-text-danger">*</strong></label>
                <div class="control">
                  <input class="input is-normal custom-select" v-model="tf_number" type="text"
                    @input="validateField('tf_number')" :class="{ 'is-danger': errors.tf_number }"
                    placeholder="กรุณากรอกแปลงเลขที่" />
                  <DisplayError v-if="errors.tf_number" :err_text="errors.tf_number" />
                </div>
              </div>
            </div>

            <div class="column is-3">
              <div class="field">
                <label class="label">ระวาง ส.ป.ก ที่ <strong class="has-text-danger">*</strong></label>
                <div class="control">
                  <input class="input is-normal" :class="{ 'is-danger': errors.spk_area }"
                    @input="validateField('spk_area')" v-model="spk_area" type="text"
                    placeholder="กรุณากรอกกระวาง ส.ป.ก" />
                  <DisplayError v-if="errors.spk_area" :err_text="errors.spk_area" />
                </div>
              </div>
            </div>

            <div class="column is-3">
              <div class="field">
                <label class="label">เลขที่ <strong class="has-text-danger">*</strong></label>
                <div class="control">
                  <input class="input is-normal custom-select" :class="{ 'is-danger': errors.number }"
                    @input="validateField('number')" v-model="number" type="text" placeholder="กรุณากรอกเลขที่" />
                  <DisplayError v-if="errors.number" :err_text="errors.number" />
                </div>
              </div>
            </div>

            <div class="column is-3">
              <div class="field">
                <label class="label">เล่ม <strong class="has-text-danger">*</strong></label>
                <div class="control">
                  <input class="input is-normal custom-select" :class="{ 'is-danger': errors.volume }"
                    @input="validateField('volume')" v-model="volume" type="text" placeholder="กรุณากรอกเล่มที่" />
                  <DisplayError v-if="errors.volume" :err_text="errors.volume" />
                </div>
              </div>
            </div>
          </div>

          <!-- อยู่บ้านเลขที่ -->
          <div class="columns">
            <div class="column is-4">
              <div class="field">
                <label class="label">บ้านเลขที่ <strong class="has-text-danger">*</strong></label>
                <div class="control">
                  <input class="input is-normal" :class="{ 'is-danger': errors.address_house }"
                    @input="validateField('address_house')" v-model="address_house" type="text"
                    placeholder="กรุณากรอกกอยู่บ้านเลขที่" />
                  <DisplayError v-if="errors.address_house" :err_text="errors.address_house" />
                </div>
              </div>
            </div>

            <div class="column is-4">
              <div class="field">
                <label class="label">ตำบล <strong class="has-text-danger">*</strong></label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select v-model="formLand.district" :class="{ 'is-danger': errors.district }"
                      @change="updateVillage">
                      <option value="" selected>เลือกตำบล</option>
                      <option value="หัวตะพาน">หัวตะพาน</option>
                      <option value="ไทรบุรี">ไทรบุรี</option>
                    </select>
                  </div>
                  <DisplayError v-if="errors.district" :err_text="errors.district" />
                </div>
              </div>
            </div>

            <div class="column is-4">
              <div class="field">
                <label class="label">หมู่ที่ <strong class="has-text-danger">*</strong></label>
                <div class="control">
                  <div class="select is-fullwidth">
                    <select @change="validateField('village')" v-model="formLand.village">
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
                <label class="label">ละติจูด</label>
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
                <label class="label">ลองจิจูด</label>
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
            <!-- Reset Button -->
            <button type="button" class="button is-medium is-size-5 px-5" @click="resetForm">
              <span>ยกเลิก</span>
            </button>

            <!-- Submit Button -->
            <button type="submit" class="button is-success is-medium is-size-5 px-5 ml-3" :disabled="btnLoad">
              <span>{{ btnLoad ? 'กำลังตรวจสอบ' : 'บันทึก' }}</span>
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
import { getRai, updateVillageOptions } from '@/utils/addressFunc';
import axios from 'axios';
import { fetchSois, fetchLandStatusActive } from '@/api/apiLand';
import { checkFullnameMatchCitizen, fetchPeopleName } from '@/api/apiPeople';
import DisplayError from '@/components/form_valid/DisplayError.vue';
import { getLandModel, LandValidSchema } from '@/model/landModel';
import { calculateLandArea, convertSquareWaToRaiNganWa } from '@/utils/landFunc';
import { showErrorAlert, showSuccessAlert, showWarningAlert } from '@/utils/alertFunc';
export default {
  // นำเข้า component
  components: {
    DisplayError
  },
  data() {
    return {
      formLand: {
        ...getLandModel
      },
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
      village: [],
      isNameSelected: false, // ใช้เพื่อตรวจสอบว่าเลือกชื่อจากแนะนำหรือยัง
      filteredNames: [], // รายชื่อที่กรองแล้ว
      prefix_name: null,
      btnLoad: false
    }
  },
  computed: {
    full_name: {
      get() {
        return this.formLand.full_name ? this.formLand.full_name.trim() : '';
      },
      set(value) {
        this.formLand.full_name = value ? value.trim() : '';
      }
    },
    tf_number: {
      get() {
        return this.formLand.tf_number ? this.formLand.tf_number.trim() : '';
      },
      set(value) {
        this.formLand.tf_number = value ? value.trim() : '';
      }
    },
    spk_area: {
      get() {
        return this.formLand.spk_area ? this.formLand.spk_area.trim() : '';
      },
      set(value) {
        this.formLand.spk_area = value ? value.trim() : '';
      }
    },
    number: {
      get() {
        return this.formLand.number ? this.formLand.number.trim() : '';
      },
      set(value) {
        this.formLand.number = value ? value.trim() : '';
      }
    },
    volume: {
      get() {
        return this.formLand.volume ? this.formLand.volume.trim() : '';
      },
      set(value) {
        this.formLand.volume = value ? value.trim() : '';
      }
    },
    address_house: {
      get() {
        return this.formLand.address_house ? this.formLand.address_house.trim() : '';
      },
      set(value) {
        this.formLand.address_house = value ? value.trim() : '';
      }
    }
  },
  methods: {
    async updateVillage() {
      // console.log('village:', this.formLand.district)
      // this.village = updateVillageOptions(this.formLand.district)
      // // console.log('result-village:', this.village)
      // this.formLand.village = ""

      if (this.formLand.district === 'หัวตะพาน' || this.formLand.district === 'ไทรบุรี') {
        this.village = updateVillageOptions(this.formLand.district)
      } else {
        this.village = [];
      }
      // if (this.errors['village']) {
      //   // this.errors['village'] = ""
      // }
      this.formLand.village = ""
      await this.validateField("district")
    },
    splitName(fullName) {
      const parts = fullName.trim().split(" ");
      return {
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
      };
    },
    // submit
    async creationLand() {
      // ตรวจสอบข้อมูลที่กรอก
      const isValid = await this.validateForm();
      if (!isValid) {
        await showWarningAlert('การเพิ่มข้อมูลที่ดิน', 'กรุณากรอกข้อมูลให้ถูกต้อง!')
        return; // หยุดการทำงานหากฟอร์มไม่ถูกต้อง
      }

      this.btnLoad = true
      store.status_path_change = true

      console.log(":::", this.formLand.ngan)
      const cal_result = calculateLandArea(
        this.formLand.rai,
        this.formLand.ngan,
        this.formLand.square_wa);
      console.log('cal-re:', cal_result);
      console.log("full_name 1:", this.formLand.full_name.length);
      console.log("full_name 2:", this.formLand.full_name);
      const { firstName, lastName } = this.splitName(this.formLand.full_name);
      console.log("full_name:", this.splitName(this.formLand.full_name));

      try {
        const matchName = await checkFullnameMatchCitizen(firstName, lastName);
        if (!matchName.status) {
          await showErrorAlert('ไม่พบราษฎรท่านนี้', matchName.message + '!');
          return;
        }
        this.formLand.id_card = matchName.data[0].ID_CARD;
      } catch (error) {
        console.error("Error checking citizen:", error);
        await showErrorAlert('เกิดข้อผิดพลาด', 'ไม่สามารถตรวจสอบข้อมูลราษฎรได้');
        return;
      } finally {
        this.btnLoad = false
        store.status_path_change = false
      }
      if (cal_result === false) {
        console.error("จำนวนไร่ต้องไม่เกิน 5");
        await showErrorAlert("จำนวนเกิน 5 ไร่", "พื้นที่รวมเกิน 5 ไร่! โปรดตรวจสอบข้อมูลอีกครั้ง")
        return;
      } else {
        console.log("พื้นที่ที่คำนวณได้:", cal_result);
      }
      // citizen holding
      try {
        let totalArea = 0
        const resLandHold = await axios.get(`http://localhost:3000/citizen/holding/${this.formLand.id_card}`);
        console.log('res-hold:', resLandHold.data);

        if (resLandHold.data.length > 0) {
          // ฟังก์ชันคำนวณพื้นที่รวม
          totalArea = resLandHold.data.reduce((sum, land) => {
            const rai = land.rai ? land.rai * 400 : 0; // แปลงไร่เป็นตารางวา
            const ngan = land.ngan ? land.ngan * 100 : 0; // แปลงงานเป็นตารางวา
            const squareWa = land.square_wa ? land.square_wa : 0; // ตารางวา
            return sum + rai + ngan + squareWa; // รวมเข้ากับผลรวมทั้งหมด
          }, 0);

          console.log("Total Area in Square Wa:", totalArea); // แสดงค่าทั้งหมดในตารางวา
        }
        const totalAreaPrepareAdding = totalArea + cal_result.totalSquareWa;
        console.log('res-prepare-adding:', totalAreaPrepareAdding)
        const max_rai = 2000; // ตารางวา
        // land exist
        if (totalArea > max_rai) {
          await showErrorAlert('จำนวนไร่เกินกำหนด!', 'จำนวนที่ดินที่เพิ่มมาก่อนหน้านี้รวมกันเกิน 5 ไร่แล้ว!');
          return
        }
        // // new land checks total rai
        if (totalAreaPrepareAdding > max_rai) {
          const remainingLand = max_rai - parseInt(totalArea);
          const { rai, ngan, squareWa } = convertSquareWaToRaiNganWa(remainingLand);
          await showWarningAlert(
            'จำนวนไร่ที่เพิ่มใหม่เกินกำหนด!',
            `จำนวนที่ดินคงเหลือ ${rai} ไร่ ${ngan} งาน ${squareWa} ตารางวา`
          );
          return
        }

        const form_data = {
          soi: this.formLand.selectedSoi,
          land_status: this.formLand.selectedStatus,
          id_card: this.formLand.id_card,
          // fullname: this.formLand.full_name,
          tf_number: this.formLand.tf_number,
          spk_area: this.formLand.spk_area,
          volume: this.formLand.volume,
          address: this.formLand.address_house,
          village: this.formLand.village,
          district: this.formLand.district,
          long: this.formLand.long || null,
          lat: this.formLand.lat || null,
          notation: this.formLand.notation,
          rai: cal_result.rai,
          ngan: cal_result.ngan,
          square_wa: cal_result.squareWa,
          number: this.formLand.number
        };
        console.log('Form submitted:', form_data);
        try {
          const response = await axios.post('http://localhost:3000/land', form_data);
          console.log('Response:', response);
          await showSuccessAlert('การเพิ่มข้อมูลที่ดิน', response.data.message)
          this.resetForm();
          return
        } catch (error) {
          console.log('error:', error.response)
          if (error.response) {
            // ตรวจสอบ response status code ที่มาจากเซิร์ฟเวอร์
            if (error.response.status === 400) {
              await showErrorAlert('การเพิ่มข้อมูลที่ดิน', error.response.data.message || 'ข้อมูลไม่ถูกต้อง');
            } else if (error.response.status === 409) {
              await showErrorAlert('การเพิ่มข้อมูลที่ดิน', error.response.data.message || 'ข้อมูลซ้ำ');
            } else {
              await showErrorAlert('การเพิ่มข้อมูลที่ดิน', 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์');
            }
          } else {
            await showErrorAlert('การเพิ่มข้อมูลที่ดิน', 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์');
          }
        } finally {
          this.btnLoad = false
          store.status_path_change = false
        }
      } catch (error) {
        console.error('Error fetching land holding data:', error);

        if (error.response) {
          await showErrorAlert('การตรวจสอบที่ดิน', error.response.data.message || 'เกิดข้อผิดพลาดขณะดึงข้อมูลที่ดิน');
        } else {
          await showErrorAlert('การตรวจสอบที่ดิน', 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์');
        }
        return; // หยุดทำงานต่อถ้า API ล้มเหลว
      } finally {
        this.btnLoad = false
        store.status_path_change = false
      }
    },
    resetForm() {
      // reset formLand
      this.formLand = { ...getLandModel };
      this.errors = {};
    },
    async validateForm() {
      try {
        const schema = this.getValidationSchema();
        await schema.validate(this.formLand, { abortEarly: false }); // ตรวจสอบทุกฟิลด์
        this.errors = {}; // เคลียร์ errors object
        return true; // ฟอร์มถูกต้อง
      } catch (err) {
        // หากพบข้อผิดพลาด
        if (err.inner) {
          this.errors = err.inner.reduce((acc, curr) => {
            acc[curr.path] = curr.message; // เก็บข้อผิดพลาดตามฟิลด์
            return acc;
          }, {});
        } else {
          this.errors = {}; // หากไม่มีข้อผิดพลาด
        }
        return false; // ฟอร์มไม่ถูกต้อง
      }
    },
    async validateField(field) {
      try {
        const schema = this.getValidationSchema();
        await schema.validateAt(field, this.formLand);
        this.errors[field] = ""; // เคลียร์ error หาก valid
      } catch (err) {
        this.errors[field] = err.message; // ตั้งค่า error message
      }
    },
    getValidationSchema() {
      return yup.object().shape({ ...LandValidSchema });
    }
  },
  watch: {
    address_house(newValue) {
      // ตรวจสอบให้พิมพ์ได้เฉพาะตัวเลข หรือ "/" ที่ตามด้วยตัวเลข และจำกัดให้พิมพ์ได้ไม่เกิน 10 ตัวอักษร
      const cleanedValue = newValue.match(/^\d{0,4}(\/\d{0,3})?$/)?.[0] || '';

      // อัปเดตค่าใน formLand
      if (newValue !== cleanedValue) {
        this.formLand.address_house = cleanedValue;
      }
    },
    tf_number(newValue) {
      // ตัดข้อความที่ไม่ใช่ตัวเลขออก
      const cleanedValue = newValue.replace(/[^0-9]/g, '').slice(0, 5);; // กรองเฉพาะตัวเลข
      if (newValue !== cleanedValue) {
        this.formLand.tf_number = cleanedValue; // อัปเดตค่าใหม่ที่มีเฉพาะตัวเลข
      }
    },
    number(newValue) {
      // ตัดข้อความที่ไม่ใช่ตัวเลขออก
      const cleanedValue = newValue.replace(/[^0-9]/g, '').slice(0, 4);; // กรองเฉพาะตัวเลข
      if (newValue !== cleanedValue) {
        this.formLand.number = cleanedValue; // อัปเดตค่าใหม่ที่มีเฉพาะตัวเลข
      }
    },
    'formLand.square_wa'(newValue) {
      if (typeof newValue === 'number' && newValue > 100) {
        this.formLand.square_wa = 99;
      }
    },
    'formLand.ngan'(newValue) {
      if (typeof newValue === 'number' && newValue > 3) {
        this.formLand.ngan = 3;
      }
    },
    'formLand.long'(newValue) {
      if (typeof newValue === 'number' && newValue > 179.999999) {
        this.formLand.long = 179.999999;
      }

      if (typeof newValue === 'number' && newValue < -179.999999) {
        this.formLand.long = -179.999999;
      }
    },
    'formLand.lat'(newValue) {
      if (typeof newValue === 'number' && newValue > 89.999999) {
        this.formLand.lat = 89.999999;
      }

      if (typeof newValue === 'number' && newValue < -89.999999) {
        this.formLand.lat = -89.999999;
      }
    }
  },
  async mounted() {
    try {
      this.sois = await fetchSois()
      this.land_status = await fetchLandStatusActive('1')
    } catch (err) {
      this.error = 'Error fetching sois: ' + err.message;
    }
  }
}
</script>

<style scoped>
.button {
  border-radius: 5px;
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
