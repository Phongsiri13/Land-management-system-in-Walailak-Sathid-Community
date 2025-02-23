<template>
    <div class="primary_content">
        <div class="mx-5 py-5 is-flex is-justify-content-center">
            <div class="box column is-three-quarters-tablet is-two-thirds-desktop is-full-mobile">
                <div class="py-2 is-flex 
                is-justify-content-space-between">
                    <h2 class="title has-text-primary px-3 is-size-3">ข้อมูลราษฎร</h2>
                    <h2 class="has-text-weight-semibold is-size-6">
                        วันที่สร้าง: {{ ToThaiDate(new Date(formPeopleData.created)) || '-' }}
                    </h2>
                </div>

                <div class="is-flex is-justify-content-flex-end">
                    <!-- Edit -->
                    <button class="button is-warning btn-menu" @click="goToEdit(formPeopleData[0]?.ID_CARD)">
                        <span class="icon"><i class="fas fa-pencil-alt"></i></span>
                        <span>แก้ไข</span>
                    </button>

                    <!-- add file -->
                    <button class="button is-primary mx-2 btn-menu"
                        @click="goToCitizenFile(formPeopleData[0]?.ID_CARD)">
                        <span class="icon"><i class="fas fa-file"></i></span>
                        <span>เพิ่มไฟล์</span>
                    </button>
                </div>

                <hr>

                <div class="columns is-multiline px-3">
                    <div class="column is-half">
                        <div class="box  py-3 px-4 is-flex is-align-items-center">
                            <span class="has-text-weight-semibold is-size-5">ชื่อ:</span>
                            <span class="ml-3 is-size-5">{{ formPeopleData.prefix || '-' }}{{ formPeopleData.firstName
                                || '-' }}
                                {{ formPeopleData.lastName || '-' }}
                            </span>
                        </div>
                    </div>

                    <div class="column is-half">
                        <div class="box  py-3 px-4 is-flex is-align-items-center">
                            <span class="has-text-weight-semibold is-size-5">เลขบัตรประชาชน:</span>
                            <span class="ml-3 is-size-5">{{ formPeopleData.citizenId || '-' }}</span>
                        </div>
                    </div>

                    <div class="column is-half">
                        <div class="box  py-3 px-4 is-flex is-align-items-center">
                            <span class="has-text-weight-semibold is-size-5">วันเกิด:</span>
                            <span class="ml-3 is-size-5">{{
                                ToThaiDate(new Date(formPeopleData.birthDate)) || '-' }}</span>
                        </div>
                    </div>

                    <div class="column is-half">
                        <div class="box  py-3 px-4 is-flex is-align-items-center">
                            <span class="has-text-weight-semibold is-size-5">เบอร์โทร:</span>
                            <span class="ml-3 is-size-5">{{ formPeopleData.phone || '-' }}</span>
                        </div>
                    </div>

                    <div class="column is-half">
                        <div class="box  py-3 px-4 is-flex is-align-items-center">
                            <span class="has-text-weight-semibold is-size-5">เพศ:</span>
                            <span class="ml-3 is-size-5">{{ formPeopleData.gender || '-' }}</span>
                        </div>
                    </div>

                    <div class="column is-half">
                        <div class="box  py-3 px-4 is-flex is-align-items-center">
                            <span class="has-text-weight-semibold is-size-5">ซอย:</span>
                            <span class="ml-3 is-size-5">{{ formPeopleData.selectedSoi || '-' }}</span>
                        </div>
                    </div>

                    <div class="column is-full">
                        <div class="box  py-3 px-4 is-flex is-align-items-center">
                            <span class="has-text-weight-semibold is-size-5">ที่อยู่:</span>
                            <span class="ml-3 is-size-5">{{ 'บ้านเลขที่ ' + formPeopleData.house_number || '-' }}
                                {{ 'หมู่ที่ ' + formPeopleData.village || '-' }}
                                {{ 'ตำบล ' + formPeopleData.subdistrict || '-' }}</span>
                        </div>
                    </div>
                </div>
                <hr>
                <!-- ข้อมูลที่ถือครองที่ดิน  -->
                <h2 class="has-text-dark my-3 px-3 is-size-4">ถือครองที่ดิน</h2>
                <div v-if="formPeopleLandHold.length > 0">
                    <div v-for="(ct, index) in formPeopleLandHold" :key="index" class="box">
                        <span  @click="goToLandView(ct.id_land)" 
                        class="view-land-data has-text-weight-bold is-size-6 p-1 mr-3"><i class="fas fa-eye has-text-link"></i></span>
                        <span class="has-text-weight-bold is-size-6">ที่ดินที่: {{ ++index }}</span>
                        <span class="has-text-weight-bold is-size-6"> แปลงเลขที่: {{ ct.number }}</span>
                        <span class="has-text-weight-bold is-size-6"> จำนวนไร่: {{ ct.total_area_in_rai }}</span>
                    </div>
                </div>

                <!-- heir -->
                <!-- ข้อมูลทายาท -->
                <hr>
                <h2 class="has-text-dark my-3 px-3 is-size-4">ทายาทที่มีความสัมพันธ์กับราษฎรผู้นี้</h2>
                <div v-if="formHeirData.length > 0">
                    <div v-for="(heir, index) in formHeirData" :key="heir.heir_id" class="box">
                        <p class="has-text-weight-bold">ทายาทคนที่: {{ ++index }}</p>
                        <p class="has-text-weight-bold s-4">ความสัมพันธ์: {{ formPeopleData.firstName || '-' }}
                            {{ formPeopleData.lastName || '-' }}
                            เป็น{{ heir.label }} ของทายาทผู้นี้</p>
                        <p class="title is-4">{{ heir.heir_first_name }} {{ heir.heir_last_name }}</p>
                    </div>
                </div>
                <div v-else>
                    <div class="notification is-info">
                        <h2 class="title is-size-5 has-text-centered">ราษฎรคนนี้ยังไม่มีใครเป็นทายาท</h2>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { convertToThaiDate } from '@/utils/commonFunc';
import { fetchPrefix } from '@/api/apiPeople';
import { showErrorAlert } from '@/utils/alertFunc';

export default {
    data() {
        return {
            formPeopleData: [],
            formPeopleLandHold: [],
            formHeirData: []
        }
    },
    methods: {
        ToThaiDate(date) {
            return convertToThaiDate(date)
        },
        goToEdit(id) {
            this.$router.push({ name: 'CitizenEdit', params: { id } });
        },
        goToCitizenFile(id) {
            this.$router.push({ name: 'CitizenFiles', params: { id } });
        },
        goToLandView(id) {
            this.$router.push({ name: 'PersonDetail', params: { id } });
        },
    },
    async created() {
        try {
            const personId = this.$route.params.id;
            this.prefixList = await fetchPrefix();
            console.log('prefixList:', this.prefixList);
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
                ID_CARD: originalData.ID_CARD,
                prefix: originalData.prefix_name || "",
                firstName: originalData.first_name || "",
                lastName: originalData.last_name || "",
                birthDate: originalData.birthday ? new Date(originalData.birthday).toISOString().split("T")[0] : "",
                phone: originalData.phone_number || "",
                citizenId: originalData.ID_CARD || "",
                gender: originalData.gender === '1' ? "ชาย" : originalData.gender === '0' ? "หญิง" : "-",
                selectedSoi: originalData.soi || "",
                subdistrict: originalData.district || "",
                village: originalData.village_number || "",
                house_number: originalData.house_number || "",
                created: originalData.created_at || '-'
            };

            // getHeirs
            const resHeir = await axios.get(`http://localhost:3000/heir/related_citizen/${personId}`);
            // console.log('le:', resHeir.data)
            this.formHeirData = resHeir.data;

            // holding lands
            const resLandHold = await axios.get(`http://localhost:3000/citizen/holding/${personId}`);
            console.log('res-hold:', resLandHold.data.data)
            this.formPeopleLandHold = resLandHold.data.data

        } catch (error) {
            console.error('Error fetching person data:', error);
        }
    }
}
</script>

<style scoped>
.btn-menu {
    border-radius: 10px;
    min-width: 120px;
}

.view-land-data{
    cursor: pointer;
}

.view-land-data:hover{
    background-color: #333;
    border-radius: 5px;
}
</style>