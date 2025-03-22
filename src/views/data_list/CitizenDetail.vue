<template>
    <div class="primary_content">
        <div class="mx-5 py-5 is-flex is-justify-content-center">
            <div class="box column is-three-quarters-tablet is-two-thirds-desktop is-full-mobile">
                <div class="is-flex is-justify-content-flex-start my-2">
                    <button class="button is-primary is-small" @click="goHome">
                        <span class="icon">
                            <i class="fas fa-step-backward"></i>
                        </span>
                        <span>ย้อนกลับ</span>
                    </button>
                </div>
                <div class="py-2 is-flex 
                is-justify-content-space-between">
                    <h2 class="title has-text-link px-3 is-size-3">ข้อมูลราษฎร</h2>
                    <h2 class="has-text-weight-semibold is-size-6">
                        วันที่สร้าง: {{ ToThaiDate(new Date(formPeopleData.created)) || '-' }}
                    </h2>
                </div>

                <div class="is-flex is-justify-content-flex-end" v-if="userRole === roles[3].role_id">
                    <!-- Edit -->
                    <button class="button is-warning btn-menu" @click="goToEdit(formPeopleData[0]?.ID_CARD)">
                        <span class="icon"><i class="fas fa-edit"></i></span>
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
                            <span class="ml-3 is-size-5">{{ formatIDCARD(formPeopleData.citizenId) || '-' }}</span>
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
                            <span class="ml-3 is-size-5">{{ formatPhoneNumber(formPeopleData.phone) || '-' }}</span>
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
                            <span class="ml-3 is-size-5">{{ formPeopleData.selectedSoi == 0 ? '0' :
                                formPeopleData.selectedSoi }}</span>
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
                    <div v-for="(ct, index) in formPeopleLandHold" :key="index"
                        class="box is-flex is-align-items-center">
                        <button class="button is-primary mr-2" @click="goToLandView(ct.id_land)">
                            <span class="icon">
                                <i class="fas fa-eye"></i>
                            </span>
                        </button>
                        <div>
                            <span class="has-text-weight-bold is-size-5">ลำดับ: {{ index + 1 }}, </span>
                            <span class="has-text-weight-bold is-size-5"> แปลงเลขที่: {{ ct.tf_number }}, </span>
                            <span class="has-text-weight-bold is-size-5">
                                จำนวนที่ใช้: {{ ct.rai || 0 }} ไร่ {{ ct.ngan || 0 }} งาน {{ ct.square_wa || 0 }}
                                ตารางวา
                            </span>
                        </div>
                    </div>

                    <div v-if="formPeopleLandHold.length > 1" class="box is-flex is-align-items-center">
                        <div>
                            <span class="has-text-weight-bold is-size-5 has-text-link">
                                ผลรวมจำนวนที่ใช้ : {{ Total_used.rai || 0 }} ไร่ {{ Total_used.ngan || 0 }} งาน
                                {{ Total_used.squareWa || 0 }} ตารางวา
                            </span>
                        </div>
                    </div>

                </div>
                <div v-else>
                    <div class="notification is-info">
                        <h2 class="title is-size-5 has-text-centered">ยังไม่ได้ถือกรรมสิทธิ์ที่ดิน</h2>
                    </div>
                </div>

                <!-- heir -->
                <!-- roles -->
                <!-- ข้อมูลทายาท -->
                <hr>
                <div v-if="userRole === roles[3].role_id"
                    class="is-flex is-justify-content-space-between is-align-content-center mb-1">
                    <h2 class="has-text-dark my-3 px-3 is-size-4">ทายาทของราษฎรผู้นี้</h2>
                    <button class="button is-success mb-3" style="width: 50px;" @click="goToConnectHeir">
                        <span class="icon">
                            <i class="fas fa-plus"></i>
                        </span>
                    </button>
                </div>
                <div v-if="formHeirData.length > 0">
                    <div v-for="(heir, index) in formHeirData" :key="heir.heir_id" class="box">
                        <p class="has-text-weight-bold">ทายาทคนที่: {{ ++index }}</p>
                        <p class="has-text-weight-bold s-4">ความสัมพันธ์: ทายาทผู้นี้ เป็น{{ heir.label }}ของ
                            {{ formPeopleData.firstName || '-' }} {{ formPeopleData.lastName || '-' }}
                        </p>
                        <p class="title is-4">{{ heir.heir_first_name }} {{ heir.heir_last_name }}</p>
                    </div>
                </div>
                <div v-else>
                    <div class="notification is-info">
                        <h2 class="title is-size-5 has-text-centered">ยังไม่มีทายาทผู้สืบทอด</h2>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DOMAIN_NAME from '@/config/domain_setup';
import roles from '@/role_config';
import axios from 'axios';
import { convertToThaiDate, formatIDCARD, formatPhoneNumber } from '@/utils/commonFunc';
import { fetchPrefix } from '@/api/apiPeople';
import { showErrorAlert } from '@/utils/alertFunc';
import { useUserStore } from '@/stores/useUserStore';

import { convertSquareWaToRaiNganWa } from '@/utils/landFunc';

export default {
    data() {
        return {
            roles,
            formPeopleData: [],
            formPeopleLandHold: [],
            formHeirData: [],
            Total_used: {}
        }
    },
    computed: {
        userRole() {
            // Access the userRole from your store
            const userStore = useUserStore();
            return userStore.userRole;
        }
    },
    methods: {
        goHome() {
            this.$router.back();
        },
        goToConnectHeir() {
            // move to
            console.log(
                this.formPeopleData.firstName,
                this.formPeopleData.lastName
            )
            // props: true,
            this.$router.push({
                name: 'ConnectHeirRelation',
                query: {
                    firstName: this.formPeopleData.firstName,
                    lastName: this.formPeopleData.lastName
                }
            });
        },
        formatPhoneNumber(format) {
            return formatPhoneNumber(format)
        },
        formatIDCARD(ID_CARD) {
            return formatIDCARD(ID_CARD)
        },
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
            // console.log('prefixList:', this.prefixList);
            const response = await axios.get(`${DOMAIN_NAME}/citizen/${personId}`, {
                withCredentials: true
            });
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
                birthDate: originalData.birthday
                    ? new Date(originalData.birthday).toLocaleDateString('en-CA')
                    : "",
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
            const resHeir = await axios.get(`${DOMAIN_NAME}/heir/related_citizen/${personId}`, {
                withCredentials: true
            });
            // console.log('le:', resHeir.data)
            this.formHeirData = resHeir.data;

            // holding lands
            const resLandHold = await axios.get(`${DOMAIN_NAME}/citizen/holding/${personId}`, {
                withCredentials: true
            });
            console.log('res-hold:', resLandHold.data)
            if (resLandHold.data.length > 1) {
                let totalArea = resLandHold.data.reduce((sum, land) => {
                    const rai = land.rai ? land.rai * 400 : 0; // แปลงไร่เป็นตารางวา
                    const ngan = land.ngan ? land.ngan * 100 : 0; // แปลงงานเป็นตารางวา
                    const squareWa = land.square_wa ? land.square_wa : 0; // ตารางวา
                    return sum + rai + ngan + squareWa; // รวมเข้ากับผลรวมทั้งหมด
                }, 0);
                const { rai, ngan, squareWa } = convertSquareWaToRaiNganWa(totalArea);
                this.Total_used.rai = rai;
                this.Total_used.ngan = ngan;
                this.Total_used.squareWa = squareWa;
            }
            this.formPeopleLandHold = resLandHold.data
            console.log(':::', this.formPeopleLandHold)

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

.view-land-data {
    cursor: pointer;
}

.view-land-data:hover {
    /* background-color: #333; */
    border-radius: 5px;
}
</style>