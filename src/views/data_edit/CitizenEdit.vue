<template>
    <div class="primary_content">
        <div class="mx-5 py-5 is-flex is-justify-content-center">
            <div class="box column is-three-quarters-tablet is-four-fifths-desktop is-four-fifths-mobile">
                <h1 class="title has-text-centered has-text-link">แก้ไขรายละเอียดของราษฎร</h1>
                <!-- 🔹 ปุ่มกลับหน้าแรก (มุมขวาบน) -->
                <div class="is-flex is-justify-content-flex-start my-2">
                    <button class="button is-primary is-small" @click="goHome">
                        <span class="icon">
                            <i class="fas fa-home"></i>
                        </span>
                        <span>กลับหน้าแรก</span>
                    </button>
                </div>
                <form @submit.prevent="submitCitizen">
                    <div class="columns is-multiline">
                        <!-- prefix -->
                        <div class="column is-half">
                            <div class="field">
                                <label class="label">คำนำหน้าชื่อ <strong class="has-text-danger">*</strong></label>
                                <div class="control">
                                    <div class="select is-fullwidth">
                                        <select v-model="formPeopleData.prefix" @change="validateField('prefix')">
                                            <option value="">เลือกคำนำหน้าชื่อ</option>
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
                            <div class="field">
                                <label class="label">เลขบัตรประชาชน <strong class="has-text-danger">*</strong></label>
                                <div class="control">
                                    <input class="input" disabled type="text" @input="validateField('citizenId')"
                                        :class="{ 'is-danger': errors.citizenId }" v-model="formPeopleData.citizenId"
                                        placeholder="กรุณากรอกเลขบัตรประชาชน" />
                                </div>
                                <DisplayError v-if="errors.citizenId" :err_text="errors.citizenId" />
                            </div>
                        </div>

                        <div class="column is-half">
                            <div class="field">
                                <label class="label has-text-weight-bold">
                                    เลือกเพศ <strong class="has-text-danger">*</strong></label>
                                <div class="control">
                                    <div class="radio-group">
                                        <label class="radio has-border-radius-4 p-2 mb-2 is-size-6">
                                            <input type="radio" v-model="formPeopleData.gender" value="1" disabled
                                                @change="validateField('gender')">
                                            <span class="ml-2">ชาย</span>
                                        </label>
                                        <label class="radio has-border-radius-4 p-2 mb-2 is-size-6">
                                            <input type="radio" v-model="formPeopleData.gender" value="0" disabled
                                                @change="validateField('gender')">
                                            <span class="ml-2">หญิง</span>
                                        </label>
                                        <DisplayError v-if="errors.gender" :err_text="errors.gender" />
                                    </div>
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
                                <label class="label">เบอร์โทรศัพท์ <strong class="has-text-danger">*</strong></label>
                                <div class="control">
                                    <input class="input" type="tel" v-model="formPeopleData.phone"
                                        @input="validateField('phone')" :class="{ 'is-danger': errors.phone }"
                                        placeholder="กรุณากรอกเบอร์โทรศัพท์" />
                                    <DisplayError v-if="errors.phone" :err_text="errors.phone" />
                                </div>
                            </div>
                        </div>

                        <div class="column is-half">
                            <div class="field">
                                <label class="label">บ้านเลขที่ <strong class="has-text-danger">*</strong></label>
                                <div class="control">
                                    <input class="input" type="text" placeholder="กรุณากรอกบ้านเลขที่"
                                        :class="{ 'is-danger': errors.houseNumber }"
                                        @input="validateField('houseNumber')" v-model="formPeopleData.houseNumber" />
                                    <DisplayError v-if="errors.houseNumber" :err_text="errors.houseNumber" />
                                </div>
                            </div>
                        </div>

                        <div class="column is-half">
                            <div class="field">
                                <label class="label">ตำบล <strong class="has-text-danger">*</strong></label>
                                <div class="control">
                                    <div class="select is-fullwidth">
                                        <select v-model="formPeopleData.subdistrict"
                                            :class="{ 'is-danger': errors.subdistrict }" @change="updateVillageOptions">
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
                                        <select v-model="formPeopleData.selectedSoi"
                                            @change="validateField('selectedSoi')">
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

                        <!-- Submit Button -->
                        <button type="submit" class="button is-success is-medium is-size-5 is-rounded px-5 ml-3"
                            style="min-width: 150px;">
                            <span>บันทึก</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { getPeopleModel } from '@/model/citizenModel';
import { showErrorAlert, showWarningAlert, showSuccessAlert } from '@/utils/alertFunc';
import { fetchPrefix } from '@/api/apiPeople';
import DisplayError from '@/components/form_valid/DisplayError.vue';
import { CitizenValidSchema } from '@/model/citizenModel';
import axios from 'axios';
import * as yup from "yup";
import { genderSelection } from '@/utils/citizenFunc';

export default {
    components: {
        DisplayError
    },
    data() {
        return {
            id_card: '',
            formPeopleData: [],
            oldData: [],
            errors: {},
            sois: [],
            prefixList: [
                { value: null, label: 'ไม่พบข้อมูล' },
            ],
            sois: [{ value: null, label: 'ไม่พบข้อมูล' }],
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
            this.formPeopleData.gender = genderSelection(this.formPeopleData.prefix)
        },
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
        getValidationSchema() {
            return yup.object().shape({ ...CitizenValidSchema });
        },
        async validateField(field) {
            try {
                const schema = this.getValidationSchema();
                await schema.validateAt(field, this.formPeopleData);
                // console.log('field:', field)
                this.errors[field] = ""; // Clear error if valid
            } catch (err) {
                this.errors[field] = err.message; // Set error message
            }
        },
        goHome() {
            this.$router.back();
        },
        async updateVillageOptions() {
            this.village = []
            const subdistrict = this.formPeopleData.subdistrict;
            console.log('Subdistrict selected:', subdistrict);
            if (this.villageOptions[subdistrict]) {
                this.village = this.villageOptions[subdistrict];
                console.log('Updated village list:', this.village);

                // ตรวจสอบว่าค่าหมู่บ้านที่เลือกอยู่ในรายการใหม่หรือไม่
                const isValidVillage = this.village.some(v => String(v.value) === String(this.formPeopleData.village));

                if (!isValidVillage) {
                    this.formPeopleData.village = ""; // รีเซ็ตค่าหมู่บ้านหากไม่ตรงกับตำบลที่เลือก
                }
            } else {
                this.village = []; // ล้างรายการหมู่บ้านหากไม่มีข้อมูลสำหรับตำบลที่เลือก
                this.formPeopleData.village = "";
            }

            // ล้างข้อผิดพลาดหากมี
            if (this.errors['village']) {
                this.errors['village'] = "";
            }

            // เรียกใช้การตรวจสอบค่าตำบล
            await this.validateField("subdistrict");
        },
        async submitCitizen() {
            // ตรวจสอบข้อมูลที่กรอก
            const isValid = await this.validateForm();
            if (!isValid) return;

            // ส่งข้อมูลไปที่ API
            try {
                // 
                const response = await axios.put(`http://localhost:3000/citizen/${this.id_card}`, {
                    dataUpdate: this.formPeopleData
                });
                console.log(response)
                await showSuccessAlert('การอัพเดทราษฎร', response.data.message);
                const personId = this.$route.params.id;
                const resRefresh = await axios.get(`http://localhost:3000/citizen/${personId}`);
                if (resRefresh.data.length <= 0) {
                    await showErrorAlert('ไม่พบราษฎรคนนี้', 'กรุณาใส่เลขบัตรประชาชนให้ถูกต้อง');
                    return;
                }
                console.log('resRefresh:', resRefresh.data)
                this.formPeopleData = { ...getPeopleModel }
                const originalData = resRefresh.data[0]
                this.formPeopleData = {
                    prefix: originalData.prefix_table_id || "",
                    firstName: originalData.first_name || "",
                    lastName: originalData.last_name || "",
                    birthDate: originalData.birthday
                        ? new Date(originalData.birthday).toLocaleDateString('en-CA')
                        : "",
                    phone: originalData.phone_number || "",
                    citizenId: originalData.ID_CARD,
                    gender: originalData.gender || "",
                    selectedSoi: originalData.soi || "",
                    subdistrict: originalData.district || "",
                    village: originalData.village_number || "",
                    houseNumber: originalData.house_number
                };
                this.id_card = originalData.ID_CARD;
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

                await showErrorAlert('การอัพเดทข้อมูลไม่สำเร็จ!', errorMessage);
            }
        },
    },
    async created() {
        try {
            const personId = this.$route.params.id;
            this.prefixList = await fetchPrefix();
            const response = await axios.get(`http://localhost:3000/citizen/${personId}`);
            const sois = await axios.get('http://localhost:3000/land/sois');

            this.sois = [];
            for (let i = 0; i < sois.data.length; i++) {
                let soi = sois.data[i].id_alley
                this.sois.push({ value: soi, label: `ซอย ${soi}` });
            }

            if (response.data.length <= 0) {
                await showErrorAlert('ไม่พบราษฎรคนนี้', 'กรุณาใส่เลขบัตรประชาชนให้ถูกต้อง');
                this.goHome();
                return;
            }

            this.formPeopleData = { ...getPeopleModel }
            const originalData = response.data[0]
            this.formPeopleData = {
                prefix: originalData.prefix_table_id || "",
                firstName: originalData.first_name || "",
                lastName: originalData.last_name || "",
                birthDate: originalData.birthday
                    ? new Date(originalData.birthday).toLocaleDateString('en-CA')
                    : "",
                phone: originalData.phone_number || "",
                citizenId: originalData.ID_CARD,
                gender: originalData.gender || "",
                selectedSoi: originalData.soi || "",
                subdistrict: originalData.district || "",
                village: originalData.village_number || "",
                houseNumber: originalData.house_number
            };
            this.id_card = originalData.ID_CARD;
        } catch (error) {
            console.error('Error fetching person data:', error);
        }
    },
    watch: {
        'formPeopleData.subdistrict': async function (newSubdistrict) {
            // Update the village options when subdistrict changes
            await this.updateVillageOptions(newSubdistrict);
        },
        'formPeopleData.prefix'(newVal, oldVal) {
            this.genderSelection(); // เรียกฟังก์ชันเมื่อค่า prefix เปลี่ยน
            this.validateField('prefix'); // ตรวจสอบฟิลด์
        }
    },
};

</script>
<style scoped>
.button {
    border-radius: 5px;
}
</style>