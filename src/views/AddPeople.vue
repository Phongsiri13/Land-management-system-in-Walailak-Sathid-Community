<template>
  <div class="formColor">
    <div class="container is-max-widescreen custom-container">
      <!-- People's name -->
      <div class="columns pt-3">
        <div class="column is-2">
          <div class="field">
            <label class="label">คำนำหน้าชื่อ</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select v-model="formData.prefix">
                  <option value="">เลือกคำนำหน้าชื่อ</option>
                  <option v-for="pfl in prefixList" :key="pfl.value" :value="pfl.value">
                    {{ pfl.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="column is-5">
          <div class="field">
            <label class="label">ชื่อจริง</label>
            <div class="control">
              <input class="input is-normal" v-model="formData.fname" type="text" placeholder="กรุณากรอกชื่อจริง" />
            </div>
          </div>
        </div>

        <div class="column is-5">
          <div class="field">
            <label class="label">นามสกุล</label>
            <div class="control">
              <input class="input is-normal" v-model="formData.lname" type="text" placeholder="กรุณากรอกนามสกุล" />
            </div>
          </div>
        </div>
      </div>

      <!-- id_card -->
      <div class="columns">
        <div class="column is-4">
          <div class="field">
            <label class="label">เลขบัตรประชาชน</label>
            <div class="control">
              <input class="input is-normal" v-model="formData.id_card" type="text"
                placeholder="กรุณากรอกเลขบัตรประชาชน" />
            </div>
          </div>
        </div>

        <div class="column is-4">
          <div class="field">
            <label class="label">วันเดือนปีเกิด</label>
            <div class="date-picker-container">
              <input class="input is-normal date-input" type="date" id="date" v-model="formData.selectedDate"
                @change="convertToBuddhistEra">
              <!-- <p class="date-display">วันที่เลือก: <span>{{ displayDate }}</span></p> -->
            </div>
          </div>
        </div>

        <div class="column is-4">
          <div class="field">
            <label class="label">เบอร์โทรศัพท์</label>
            <div class="control">
              <input class="input is-normal" v-model="formData.phone" type="text"
                placeholder="กรุณากรอกเบอร์โทรศัพท์" />
            </div>
          </div>
        </div>


      </div>

      <!-- address 1 -->
      <div class="columns">
        <div class="column is-3">
          <div class="field">
            <label class="label">บ้านเลขที่</label>
            <div class="control">
              <input class="input is-normal" v-model="formData.house_number" type="text"
                placeholder="กรุณากรอกเลขบัตรประชาชน" />
            </div>
          </div>
        </div>

        <div class="column is-3">
          <div class="field">
            <label class="label">หมู่ที่</label>
            <div class="control">
              <input class="input is-normal" v-model="formData.village_number" type="text"
                placeholder="กรุณากรอกเลขบัตรประชาชน" />
            </div>
          </div>
        </div>

        <div class="column is-3">
          <div class="field">
            <label class="label">ซอย</label>
            <div class="control">
              <input class="input is-normal" v-model="formData.soi" type="text" placeholder="กรุณากรอกซอย" />
            </div>
          </div>
        </div>

        <div class="column is-3">
          <div class="field">
            <label class="label">ถนน</label>
            <div class="control">
              <input class="input is-normal" v-model="formData.road" type="text" placeholder="กรุณากรอกถนน" />
            </div>
          </div>
        </div>

      </div>

      <!-- address 2 -->
      <div class="columns">
        <div class="column is-3">
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

        <div class="column is-3">
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

        <div class="column is-3">
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

        <div class="column is-3">
          <div class="field">
            <label class="label">รหัสไปรษณีย์</label>
            <div class="control">
              <input class="input is-normal" v-model="formData.zip_code" type="number"
                placeholder="กรุณากรอกรหัสไปรษณีย์" />
            </div>
          </div>
        </div>

      </div>


      <!-- submit -->
      <button class="button is-dark is-fullwidth" @click="creationPeople" :disabled="btnLoad">
        {{ btnLoad ? 'กำลังตรวจสอบ' : 'เพิ่มราษฎร' }}
      </button>

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
        fname: '',
        lname: '',
        prefix: '',
        id_card: '',
        phone: '',
        house_number: '',
        village_number: '',
        soi: '',
        road: '',
        district: '',
        amphoe: '',
        province: '',
        zip_code: '',
        selectedDate: '',
      },
      displayDate: '',
      btnLoad: false,
      prefixList: [
        { value: null, label: 'ไม่พบข้อมูล' },
      ]
    }
  },
  computed: {

  },
  methods: {
    creationPeople() {
      this.btnLoad = true
      store.status_path_change = true
      const form_data = {
        id_card: this.formData.id_card.toString() || null,
        date: this.formData.selectedDate || null,
        prefix: this.formData.prefix || null,
        first_name: this.formData.fname || null,
        last_name: this.formData.lname || null,
        phone: this.formData.phone || null,
        house_number: this.formData.house_number || null,
        village_number: this.formData.village_number || null,
        soi: this.formData.soi || null,
        road: this.formData.road || null,
        district: this.formData.district || null,
        amphoe: this.formData.amphoe || null,
        province: this.formData.province || null,
        zip_code: this.formData.zip_code || null
      };

      console.log(form_data)

      setTimeout(() => {
        this.btnLoad = false
        store.status_path_change = false
      }, 1000)
    },
    convertToBuddhistEra() {
      if (this.formData.selectedDate) {
        const date = new Date(this.formData.selectedDate);
        const yearBE = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
        const month = date.getMonth() + 1;
        const day = date.getDate();
        this.displayDate = `${day}/${month}/${yearBE}`;
      }
    }
  },
  async mounted() {
    try {
      const response = await axios.get(`http://localhost:3000/people/prefix`);
      const data = response.data; // Handle the response data
      // console.log(data)
      this.prefixList = []
      if (data.length > 0) {
        for (let d of data) {
          // console.log(d)
          this.prefixList.push({
            value: d.prefix_id,
            label: d.prefix_name
          },)
        }
        // this.prefixList = data
      }
    } catch (err) {
      this.error = 'Error fetching data: ' + err.message;
    } finally {

    }
  }
}

</script>
<style scoped>
.date-picker-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: Arial, sans-serif;
  border-radius: 8px;
  /* background-color: #f9f9f9; */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.date-label {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.date-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s ease;
}

.date-input:focus {
  border-color: #007bff;
}

.date-display {
  margin-top: 15px;
  font-size: 18px;
  color: #555;
}

.date-display span {
  font-weight: bold;
  color: #007bff;
}
</style>