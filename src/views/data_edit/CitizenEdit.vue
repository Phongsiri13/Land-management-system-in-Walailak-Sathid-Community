<template>
    <div class="primary_content">
        <div class="mx-5 py-5 is-flex is-justify-content-center">
            <div class="box column is-three-quarters-tablet is-four-fifths-desktop is-four-fifths-mobile">
                <!-- 🔹 ปุ่มกลับหน้าแรก (มุมขวาบน) -->
                <div class="is-flex is-justify-content-flex-end">
                    <button class="button is-danger is-small" @click="goHome">
                        <span class="icon">
                            <i class="fas fa-home"></i>
                        </span>
                        <span>กลับหน้าแรก</span>
                    </button>
                </div>
                <div>
                    <h1 class="title has-text-centered has-text-warning">แก้ไขรายละเอียดของราษฎร</h1>
                    <!-- <div></div> -->
                </div>
                <CitizenIndex :formData="formPeopleData" :errors="errors" :prefixList="prefixList" :village="village"
                    :sois="sois" :validateField="validateField" :updateVillageOptions="updateVillageOptions"
                    :resetForm="resetForm" />
            </div>
        </div>
    </div>
</template>

<script>

import CitizenIndex from '@/components/CitizenForm/CitizenIndex.vue';
import { getPeopleModel } from '@/model/citizenModel';
import { showErrorAlert } from '@/utils/alertFunc';
import { fetchPrefix } from '@/api/apiPeople';
import axios from 'axios';

export default {
    components: {
        CitizenIndex,
    },
    data() {
        return {
            formPeopleData: { ...getPeopleModel },
            errors: {},
            prefixList: [
                { value: null, label: 'ไม่พบข้อมูล' },
            ],
            village: [],
            sois: [{ value: null, label: 'ไม่พบข้อมูล' }],
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
        };
    },
    methods: {
        goHome() {
            this.$router.back();
        },
        validateField(field) {
            // เพิ่ม logic การตรวจสอบข้อมูล
        },
        updateVillageOptions() {
            // เพิ่ม logic อัปเดตหมู่บ้าน
        },
        resetForm() {
            // เพิ่ม logic รีเซ็ตฟอร์ม
        },
    },
    async created() {
        const personId = this.$route.params.id;
        this.prefixList = await fetchPrefix();
        console.log('prefixList:', this.prefixList);
        try {
            const response = await axios.get(`http://localhost:3000/citizen/${personId}`);
            console.log('le:', response.data.length)
            if (response.data.length <= 0) {
                await showErrorAlert('ไม่พบราษฎรคนนี้', 'กรุณาใส่เลขบัตรประชาชนให้ถูกต้อง');
                return;
            }
            // this.person = response.data;
            this.formPeopleData = { ...response.data[0] }
            console.log('person:', response.data[0])
            const originalData = response.data[0]
            this.formPeopleData = {
                prefix: originalData.prefix_name || "",
                firstName: originalData.first_name || "",
                lastName: originalData.last_name || "",
                birthDate: originalData.birthday ? new Date(originalData.birthday).toISOString().split("T")[0] : "",
                phone: originalData.phone_number || "",
                citizenId: originalData.ID_CARD || "",
                gender: originalData.gender || "",
                selectedSoi: originalData.soi || "",
                subdistrict: originalData.district || "",
                village: originalData.village_number || ""
            };

            // if(response.data.length > 0){}
        } catch (error) {
            console.error('Error fetching person data:', error);
        }
    }
};

</script>
<style scoped></style>