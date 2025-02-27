<template>
    <div class="primary_content">
        <div class="container py-5 is-flex is-justify-content-center">
            <div class="column is-four-fifths-tablet is-four-fifths-desktop is-full-mobile">
                <!-- Modal for remove land -->
                <div v-if="isEditModalOpen" class="modal" :class="{ 'is-active': isEditModalOpen }">
                    <div class="modal-background" @click="hidePermissionModal"></div>
                    <div class="modal-card">
                        <header class="modal-card-head">
                            <p class="modal-card-title">แก้ไขสิทธิ์</p>
                            <button class="delete" aria-label="close" @click="hidePermissionModal"></button>
                        </header>
                        <section class="modal-card-body">
                            <!-- Dropdown for Permissions -->
                            <div class="field">
                                <label class="label">เลือกสิทธิ์</label>
                                <div class="control">
                                    <div class="select">
                                        <select v-model="selectedPermission">
                                            <option value="1">ใช้สิทธิ์</option>
                                            <option value="0">ยกเลิก</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <footer class="modal-card-foot">
                            <button class="button is-success" :class="{ 'is-loading': loadingEdit }"
                                @click="savePermission">บันทึก</button>
                            <button class="button" @click="hidePermissionModal">ยกเลิก</button>
                        </footer>
                    </div>
                </div>

                <div v-if="isEditingLandUse" class="modal is-active">
                    <div class="modal-background" @click="closeLandUseModal"></div>
                    <div class="modal-card">
                        <header class="modal-card-head">
                            <p class="modal-card-title">แก้ไขการใช้ประโยชน์ที่ดิน</p>
                            <button class="delete" aria-label="close" @click="closeLandUseModal"></button>
                        </header>
                        <section class="modal-card-body">
                            <div class="checkboxes">
                                <label class="checkbox is-large has-text-weight-bold">
                                    <input type="checkbox" v-model="submitLandUse.rubber_tree"
                                        class="larger-checkbox" />
                                    <span>สวนยางพารา</span>
                                </label>

                                <label class="checkbox is-large has-text-weight-bold">
                                    <input type="checkbox" v-model="submitLandUse.fruit_orchard"
                                        class="larger-checkbox" />
                                    <span>สวนผลไม้</span>
                                </label>

                                <label class="checkbox is-large has-text-weight-bold">
                                    <input type="checkbox" v-model="submitLandUse.livestock_farming"
                                        class="larger-checkbox" />
                                    <span>ปศุสัตว์</span>
                                </label>

                                <label class="checkbox is-large has-text-weight-bold">
                                    <input type="checkbox" v-model="submitLandUse.other" class="larger-checkbox" />
                                    <span>อื่นๆ</span>
                                </label>

                                <!-- ถ้าเลือก 'อื่นๆ' ให้แสดง Textbox -->
                                <input :disabled="!submitLandUse.other" type="text" v-model="submitLandUse.details"
                                    class="input other-textbox" placeholder="ระบุประเภทอื่นๆ..." />
                            </div>
                        </section>
                        <footer class="modal-card-foot">
                            <button class="button is-success" :class="{ 'is-loading': loadingEdit }"
                                @click="saveLandUse">บันทึก</button>
                            <button class="button" @click="closeLandUseModal">ยกเลิก</button>
                        </footer>
                    </div>
                </div>

                <!-- Header Section -->
                <div v-if="!error_fetch" class="box">
                    <!-- title -->
                    <div class="columns is-vcentered" style="font-size: 22px;">
                        <div class="column is-10">
                            <!-- <h2 class="title is-4">รหัสที่ดิน • {{ $route.params.id }}</h2> -->
                            <p>ซอยที่ดินปัจจุบัน : <strong>{{ landSoi !== null && landSoi !== undefined ? landSoi : '---' }}</strong></p>
                            <p>ผู้ได้รับสิทธิ์ : <strong>{{ person_name || '---' }}</strong></p>
                            <p>วันที่บันทึกที่ดิน : <strong>{{ ToThaiDate(new Date(create_land_at)) || '---' }}</strong>
                            </p>
                            <p>สถานะที่ดิน : <strong>{{ landStatusName || '---' }}</strong></p>
                            <p>ใช้งาน : <strong> <span class="icon">
                                        <i v-if="landActive === '1'" class="fas fa-check has-text-success"></i>
                                        <i v-else class="fas fa-times has-text-danger"></i>
                                    </span> {{ landActive === '1' ? 'ใช้สิทธิ์' : 'ไม่ใช้สิทธิ์' }}</strong></p>
                        </div>
                        <div class="column has-text-right">
                            <RouterLink to="/land_data">
                                <!-- <span class="status-badge">Draft</span> -->
                                <span class="icon" style="font-size: 24px;color: #333;">
                                    <i class="fa fa-arrow-circle-left"></i>
                                </span>
                            </RouterLink>
                        </div>
                    </div>

                    <!-- Land data -->
                    <div class="columns">
                        <div class="column">
                            <p class="block box-style pl-3 py-2 section-title has-text-light has-background-black-ter"
                                @click="toggleLandInfo">
                                <span class="is-size-5">ข้อมูลที่ดิน </span>
                                <span>
                                    <i class="fas fa-arrow-alt-circle-down"
                                        :class="{ 'fas fa-arrow-alt-circle-right': isLandVisible == false }"></i>
                                </span>
                            </p>
                        </div>
                        <div class="column is-2">
                            <div class="is-flex is-justify-content-flex-end">
                                <!-- Edit land -->
                                <button class="button is-normal is-warning mx-1"
                                    @click="goToLandEdit(land_information[0].id_land)">
                                    <span class="icon">
                                        <i class="fas fa-edit"></i>
                                    </span>
                                </button>

                                <!-- Remove land -->
                                <button class="button is-normal is-danger" @click="showPermissionModal">
                                    <span class="icon">
                                        <i class="fas fa-trash-alt"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <!-- display land data -->
                    <transition name="slide-fade">
                        <div v-if="isLandVisible">
                            <!-- first line -->
                            <div v-if="land_information.length != 0">
                                <div class="is-tablet" style="font-size: 18px;">

                                    <div class="columns">
                                        <div class="column">
                                            <p><strong>เลขที่</strong></p>
                                            <p>{{ land_information[0]?.number || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>เล่มที่</strong></p>
                                            <p>{{ land_information[0]?.volume || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>แปลงเลขที่</strong></p>
                                            <p>{{ land_information[0]?.tf_number || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>ระวาง ส.ป.ก ที่ </strong></p>
                                            <p>{{ land_information[0]?.spk_area || '-' }}</p>
                                        </div>
                                    </div>
                                    <!-- address -->
                                    <div class="columns">

                                        <div class="column">
                                            <p><strong>บ้านเลขที่</strong></p>
                                            <p>{{ land_information[0]?.l_house_number || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>หมู่บ้าน</strong></p>
                                            <p>{{ land_information[0]?.l_village_number || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>ซอย</strong></p>
                                            <p><strong>{{ land_information[0]?.current_soi !== null && land_information[0]?.current_soi !== undefined ? land_information[0]?.current_soi : '---' }}</strong></p>
                                        </div>
                                        <div class="column">
                                            <p><strong>ตำบล</strong></p>
                                            <p>{{ land_information[0]?.l_district || '-' }}</p>
                                        </div>
                                    </div>
                                    <!-- amount -->
                                    <div class="columns">
                                        <div class="column">
                                            <p><strong>จำนวนไร่</strong></p>
                                            <p>{{ land_information[0]?.rai || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>จำนวนงาน</strong></p>
                                            <p>{{ land_information[0]?.ngan || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>จำนวนตารางวา</strong></p>
                                            <p>{{ land_information[0]?.square_wa || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong></strong></p>
                                            <p></p>
                                        </div>
                                    </div>
                                    <div class="columns">
                                        <div class="column">
                                            <p><strong>Lat</strong></p>
                                            <p>{{ land_information[0]?.lat || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>Long</strong></p>
                                            <p>{{ land_information[0]?.long || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong></strong></p>
                                            <p></p>
                                        </div>
                                        <div class="column">
                                            <p><strong></strong></p>
                                            <p></p>
                                        </div>
                                    </div>
                                    <!-- notation -->
                                    <div class="columns">
                                        <div class="column">
                                            <p><strong><span class="has-text-danger">*</span> หมายเหตุ</strong></p>
                                            <p>{{ land_information[0]?.notation || `-` }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                กำลังโหลดข้อมูล
                            </div>
                        </div>
                    </transition>

                    <!-- การใช้ประโยชน์ที่ดิน -->
                    <hr class="style1">
                    <div class="columns">
                        <div class="column">
                            <p class="block box-style pl-3 py-2 ps-3 section-title has-text-light has-background-black-ter"
                                @click="toggleLandUse">
                                <span class="is-size-5">การใช้ประโยชน์ที่ดิน </span>
                                <span>
                                    <i class="fas fa-arrow-alt-circle-down"
                                        :class="{ 'fas fa-arrow-alt-circle-right': isLandUseVisible == false }"></i>
                                </span>
                            </p>
                        </div>
                        <div class="column is-1">
                            <div class="is-flex is-justify-content-flex-end">
                                <!-- Edit people-->
                                <!-- ปุ่มสำหรับเปิด/ปิดการแก้ไข -->
                                <button v-if="isLandUseVisible" @click="toggleEdit"
                                    class="button is-normal is-warning mx-1">
                                    <span class="icon">
                                        <i :class="isEditingLandUse ? 'fas fa-times' : 'fas fa-edit'"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <!-- การใช้ประโยชน์ที่ดิน values -->
                    <transition name="slide-fade">
                        <div v-if="isLandUseVisible">
                            <div class="checkboxes">
                                <label class="checkbox is-large has-text-weight-bold">
                                    <input type="checkbox" v-model="landUse.rubber_tree" disabled
                                        class="larger-checkbox" />
                                    <span>สวนยางพารา</span>
                                </label>

                                <label class="checkbox is-large has-text-weight-bold">
                                    <input type="checkbox" v-model="landUse.fruit_orchard" disabled
                                        class="larger-checkbox" />
                                    <span>สวนผลไม้</span>
                                </label>

                                <label class="checkbox is-large has-text-weight-bold">
                                    <input type="checkbox" v-model="landUse.livestock_farming" disabled
                                        class="larger-checkbox" />
                                    <span>ปศุสัตว์</span>
                                </label>

                                <label class="checkbox is-large has-text-weight-bold">
                                    <input type="checkbox" v-model="landUse.other" disabled class="larger-checkbox" />
                                    <span>อื่นๆ</span>
                                </label>

                                <!-- ถ้าเลือก 'อื่นๆ' ให้แสดง Textbox -->
                                <input disabled type="text" v-model="landUse.details" class="input other-textbox"
                                    placeholder="ระบุประเภทอื่นๆ..." />
                            </div>
                        </div>
                    </transition>

                    <!-- Person information -->
                    <hr class="style1">
                    <div class="columns">
                        <div class="column">
                            <p class="block box-style pl-3 py-2 ps-3 section-title has-text-light has-background-black-ter"
                                @click="togglePersonInfo">
                                <span class="is-size-5">ข้อมูลราษฎร </span>
                                <span>
                                    <i class="fas fa-arrow-alt-circle-down"
                                        :class="{ 'fas fa-arrow-alt-circle-right': isPersonVisible == false }"></i>
                                </span>
                            </p>
                        </div>
                        <div class="column is-1">
                            <div class="is-flex is-justify-content-flex-end">
                                <!-- Edit people-->
                                <button v-if="person_information && person_information.length !== 0"
                                    @click="goToCitizenEdit(person_information[0]?.ID_CARD)"
                                    class="button is-normal is-warning mx-1">
                                    <span class="icon">
                                        <i class="fas fa-edit"></i>
                                    </span>
                                </button>
                                <button v-else class="button is-normal is-success mx-1">
                                    <span class="icon">
                                        <i class="fas fa-plus"></i>
                                    </span>
                                </button>
                                <!-- remove people-->
                                <!-- <button class="button is-normal is-danger">
                                    <span class="icon">
                                        <i class="fas fa-trash-alt"></i>
                                    </span>
                                </button> -->
                            </div>
                        </div>
                    </div>
                    <transition name="slide-fade">
                        <div v-if="isPersonVisible">
                            <!-- first line -->
                            <div v-if="person_information.length != 0">
                                <div class="is-tablet">
                                    <div class="columns">
                                        <div class="column">
                                            <p><strong>เลขบัตรประชาชน</strong></p>
                                            <p>{{ this.formatIDCARD(person_information[0]?.ID_CARD) || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>ชื่อจริง-นามสกุล</strong></p>
                                            <p>{{ person_information[0]?.prefix_name + ' ' +
                                                person_information[0]?.first_name + ' ' +
                                                person_information[0]?.last_name
                                                || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>โทรศัพท์</strong></p>
                                            <p>{{ this.formatPhoneNumber(person_information[0]?.phone_number) || '-' }}
                                            </p>
                                        </div>
                                        <div class="column">
                                            <p><strong>วันเกิด</strong></p>
                                            <p>{{ ToThaiDate(new Date
                                                (person_information[0].birthday).toISOString().split("T")[0]) || '-' }}
                                            </p>
                                        </div>
                                    </div>
                                    <!-- people address -->
                                    <div class="columns">
                                        <div class="column">
                                            <p><strong>บ้านเลขที่</strong></p>
                                            <p>{{ person_information[0]?.house_number || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>หมู่ที่</strong></p>
                                            <p>{{ person_information[0]?.village_number || '-' }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>ซอย</strong></p>
                                            <p><strong>{{ person_information[0]?.soi !== null && person_information[0]?.soi !== undefined ? 
                                            person_information[0]?.soi : '---' }}</strong></p>
                                        </div>
                                        <div class="column">
                                            <p><strong>ตำบล</strong></p>
                                            <p>{{ person_information[0]?.district || '-' }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                ที่ดินนี้ไม่มีราษฎรครอบครอง
                            </div>
                        </div>
                    </transition>
                    <!-- ทายาท -->
                    <hr class="style1">
                    <div class="columns">
                        <div class="column">
                            <p class="block box-style pl-3 py-2 ps-3 section-title has-text-light has-background-black-ter"
                                @click="toggleHeirInfo">
                                <span class="is-size-5">ทายาท </span>
                                <span>
                                    <i class="fas fa-arrow-alt-circle-down"
                                        :class="{ 'fas fa-arrow-alt-circle-right': isHeirVisible == false }"></i>
                                </span>
                            </p>
                        </div>
                        <!-- <div class="column is-1">
                            <div class="is-flex is-justify-content-flex-end">
                                <button class="button is-normal is-success mb-3">
                                    <span class="icon">
                                        <i class="fas fa-plus"></i>
                                    </span>
                                </button>
                            </div>
                        </div> -->
                    </div>
                    <transition name="slide-fade">
                        <div v-if="isHeirVisible">
                            <!-- first line -->
                            <div v-if="heir_information.length != 0">
                                <div class="is-tablet">
                                    <div class="columns" v-for="(heir, index) in heir_information">
                                        <div class="column">
                                            <p><strong>คนที่</strong></p>
                                            <p>{{ index + 1 }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>ชื่อ</strong></p>
                                            <p>{{ heir.full_name || '-'
                                                }}</p>
                                        </div>
                                        <div class="column">
                                            <p><strong>ความสัมพันธ์</strong></p>
                                            <p>{{ 'เป็น' + heir.relationship_label || '-'
                                                }}</p>
                                        </div>
                                        <div
                                            class="column is-inline-block is-flex is-justify-content-center is-align-items-center">
                                            <div class="is-flex is-justify-content-flex-end">
                                                <!-- Edit heir -->
                                                <button class="button is-normal is-warning mx-1 my-1"
                                                    @click="goToHeirEdit(heir.heir_id)">
                                                    <span class="icon">
                                                        <i class="fas fa-edit"></i>
                                                    </span>
                                                </button>
                                                <!-- Remove heir -->
                                                <button class="button is-normal is-danger mx-1 my-1">
                                                    <span class="icon">
                                                        <i class="fas fa-trash-alt"></i>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <p>ยังไม่มีข้อมูลทายาท</p>
                            </div>
                        </div>
                    </transition>

                    <!-- Document selection -->
                    <hr class="style1">
                    <p class="block box-style pl-3 py-2 ps-3 section-title has-text-light has-background-black-ter">
                        <span class="is-size-5">เอกสาร</span>
                    </p>
                    <!-- Add job details content here -->
                    <div v-if="land_information.length != 0">
                        <div class="is-tablet">
                            <div class="columns">
                                <!-- Button 2 -->
                                <div class="column is-one-third" v-if="CITIZEN_ID">
                                    <button class="button is-success is-fullwidth" 
                                    @click="goToUploadCitizenFiles(CITIZEN_ID)">
                                        <span class="icon is-small">
                                            <i class="fas fa-portrait"></i>
                                        </span>
                                        <span>เอกสารราษฎร</span>
                                    </button>
                                </div>
                                <!-- Button 1 -->
                                <div class="column is-one-third">
                                    <button @click="goToUploadFiles(land_information[0].id_land)"
                                        class="button is-primary is-fullwidth">
                                        <span class="icon is-small">
                                            <i class="fas fa-folder-minus"></i>
                                        </span>
                                        <span>เอกสารที่ดิน</span>
                                    </button>
                                </div>
                                <!-- Button 3 -->
                                <div class="column is-one-third">
                                    <button @click="goToUploadLiveFile(land_information[0].id_land)"
                                        class="button is-warning is-fullwidth">
                                        <span class="icon is-small">
                                            <i class="fas fa-images"></i>
                                        </span>
                                        <span>ภาพที่อยู่อาศัย</span>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div v-else>
                    โหลดข้อมูลไม่สำเร็จ
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { convertToThaiDate, formatPhoneNumber, formatIDCARD } from '@/utils/commonFunc';
import { fetchOneLandStatus } from '@/api/apiLand';
import { showSuccessAlert, showErrorAlert } from '@/utils/alertFunc';

export default {
    data() {
        return {
            isLandVisible: true, // Track visibility of the Contract Time section
            isPersonVisible: true, // Track visibility of the Contract Time section
            isLocationVisible: true,
            isHeirVisible: true,
            isLandUseVisible: true,
            submitLandUse: [],
            landUse: [],
            land_information: [],
            person_information: [],
            heir_information: [],
            person_name: "",
            create_land_at: null,
            landSoi: null,
            landActive: null,
            error_fetch: false,
            isEditingLandUse: false,
            selectedPermission: null, // Holds the selected permission value (1 or 0)
            isEditModalOpen: false,  // Modal visibility
            loadingEdit: false, // Loading state for save action
            landStatusName: '',
            LAND_ID: '',
            CITIZEN_ID: null
        };
    },
    async mounted() {
        try {
            const landId = decodeURIComponent(this.$route.params.id);
            this.LAND_ID = landId;
            const response_land = await axios.get(`http://localhost:3000/land/${landId}`);
            console.log('land-data:', response_land.data[0])
            this.CITIZEN_ID = response_land.data[0].id_card || null;
            this.landSoi = response_land.data[0].current_soi;
            // console.log('land-soi:', this.landSoi)
            const getStatusName = await fetchOneLandStatus(response_land.data[0].current_land_status);
            console.log('getStatusName:', getStatusName.data[0].land_status_name);
            this.landStatusName = getStatusName.data[0].land_status_name
            this.create_land_at = response_land.data[0].created_at

            if (response_land.data) {
                const ld = response_land.data
                this.land_information = ld
                
                this.landActive = ld[0].active
                if (ld[0].id_card) {
                    const resCitizen = await axios.get(`http://localhost:3000/citizen/${ld[0].id_card}`);
                    console.log('citizen-data:', resCitizen.data[0].ID_CARD)
                    if (resCitizen.data) {
                        const cz = resCitizen.data
                        this.person_information = [...cz]
                        this.person_name = (cz[0].first_name || '-') + " " + (cz[0].last_name || '-')
                        const resHeir = await axios.get(`http://localhost:3000/manage_relation/citizen_relations/${resCitizen.data[0].ID_CARD}`);
                        console.log('resHeir', resHeir.data.data)
                        if (resHeir.data.data) {
                            this.heir_information = resHeir.data.data
                        }
                    }
                }
            }
            const res_land_use = await axios.get(`http://localhost:3000/land/land_use/${landId}`);
            // console.log('land-use:', res_land_use.data[0])
            this.landUse = res_land_use.data[0]
            this.landUse.rubber_tree = this.landUse.rubber_tree === '1';
            this.landUse.fruit_orchard = this.landUse.fruit_orchard === '1';
            this.landUse.livestock_farming = this.landUse.livestock_farming === '1';
            this.landUse.other = this.landUse.other === '1';
            this.submitLandUse = { ...this.landUse };
            console.log('submit:', this.submitLandUse)

        } catch (error) {
            // Handle errors
            if (error.response) {
                // The request was made and the server responded with a status code outside the range of 2xx
                console.error('Response error:', error.response.data);
                console.error('Status:', error.response.status);
                console.error('Headers:', error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Request error:', error.request);
            } else {
                // Something else went wrong while setting up the request
                console.error('General error:', error.message);
            }
            // this.error_fetch = true
        }
    },
    methods: {
        formatIDCARD(ID_CARD) {
            return formatIDCARD(ID_CARD)
        },
        formatPhoneNumber(format) {
            return formatPhoneNumber(format)
        },
        // Shows the modal
        async showPermissionModal() {
            console.log('hi')
            this.isEditModalOpen = true;
            try {
                const resActive = await axios.get(`http://localhost:3000/land/active/${this.land_information[0].id_land}`);
                console.log('resActive:', resActive.data)
                if (resActive.data.length > 0) {
                    console.log('koksa')
                    this.selectedPermission = resActive.data[0].active
                }
                console.log(this.selectedPermission)
            } catch (error) {
                console.log('has err')
            }

        },
        // Hides the modal
        hidePermissionModal() {
            this.isEditModalOpen = false;
            // this.selectedPermission = null;
        },
        // Handles saving the selected permission
        async savePermission() {
            // Simulating a save action
            console.log(`Selected Permission: ${this.selectedPermission}`);
            const activeValue = this.selectedPermission;
            console.log('active-v:', activeValue)
            try {
                const resActive = await axios.delete(`http://localhost:3000/land/active/${this.land_information[0].id_land}`, {
                    data: { active: activeValue }
                });

                if (resActive.data.success) {
                    console.log('-----------------')
                    await showSuccessAlert('การเปลี่ยนแปลงการใช้งาน', resActive.data.message);
                } else {
                    await showErrorAlert('การเปลี่ยนแปลงการใช้งาน', resActive.data.message);
                }
                window.location.reload();
            } catch (error) {
                console.log(`Error: ------`);
            } finally {
                this.hidePermissionModal();
                // Refresh the page after the alert
            }
        },
        async saveLandUse() {
            // Simulating a save action
            // console.log(`Selected Landuse: `, this.submitLandUse);
            console.log(`Selected Landuse: `, this.LAND_ID);
            try {
                const resLandUse = await axios.put(`http://localhost:3000/land/land_use/${this.LAND_ID}`,
                    {
                        data: this.submitLandUse
                    }
                )

                if (resLandUse.data) {
                    console.log('-----------------')
                    await showSuccessAlert('การเปลี่ยนแปลงการใช้งาน', resLandUse.data.message);
                    const res_land_use = await axios.get(`http://localhost:3000/land/land_use/${this.LAND_ID}`);
                    this.landUse = res_land_use.data[0]
                    this.landUse.rubber_tree = this.landUse.rubber_tree === '1';
                    this.landUse.fruit_orchard = this.landUse.fruit_orchard === '1';
                    this.landUse.livestock_farming = this.landUse.livestock_farming === '1';
                    this.landUse.other = this.landUse.other === '1';
                    this.submitLandUse = { ...this.landUse };
                } else {
                    await showErrorAlert('การเปลี่ยนแปลงการใช้งาน', resLandUse.data.message);
                }
            } catch (error) {
                console.log(`Error: ------`);
                await showErrorAlert('การเปลี่ยนแปลงการใช้งาน', 'ไม่สามารถเปลี่ยนแปลงได้ ณ ขณะนี้ กรุณาลองใหม่');
            } finally {
                // this.hidePermissionModal();
            }
        },
        getLandFieldName(field) {
            switch (field) {
                case "rubber_tree":
                    return "สวนยางพารา";
                case "fruit_orchard":
                    return "สวนผลไม้";
                case "livestock_farming":
                    return "ปศุสัตว์";
                case "other":
                    return "อื่นๆ";
                case "details":
                    return "รายละเอียด";
                default:
                    return field;
            }
        },
        ToThaiDate(date) {
            return convertToThaiDate(date)
        },
        toggleLandInfo() {
            this.isLandVisible = !this.isLandVisible;
        },
        togglePersonInfo() {
            this.isPersonVisible = !this.isPersonVisible;
        },
        toggleLocationInfo() {
            this.isLocationVisible = !this.isLocationVisible;
        },
        toggleHeirInfo() {
            this.isHeirVisible = !this.isHeirVisible;
        },
        goToDetail(id) {
            this.$router.push({ name: 'LandTitle', params: { id } });
        },
        goToUploadLiveFile(id) {
            this.$router.push({ name: 'LandLiveDocument', params: { id } });
        },
        goToUploadFiles(id) {
            this.$router.push({ name: 'LandFile', params: { id } });
        },
        goToUploadCitizenFiles(id) {
            this.$router.push({ name: 'CitizenFiles', params: { id } });
        },
        goToHeirEdit(heir_id) {
            console.log('heir_id:', heir_id)
            const routeData = this.$router.resolve({ name: 'HeirEdit', params: { id: heir_id } });
            window.open(routeData.href, '_blank');
        },
        toggleEdit() {
            this.isEditingLandUse = !this.isEditingLandUse; // เปลี่ยนค่า isEditingLandUse เป็น true หรือ false สลับไปมา
        },
        goToCitizenEdit(id) {
            this.$router.push({ name: 'CitizenEdit', params: { id } });
        },
        goToLandEdit(id) {
            this.$router.push({ name: 'LandEdit', params: { id } });
        },
        toggleLandUse() {
            this.isLandUseVisible = !this.isLandUseVisible
            if (this.isEditingLandUse == true) {
                this.isEditingLandUse = false
            }
        },
        closeLandUseModal() {
            this.isEditingLandUse = false; // ปิดโมดอล
            this.submitLandUse = { ...this.landUse };
        }
    },
};
</script>

<style scoped>
.box-style {
    cursor: pointer;
}

hr.style1 {
    border-top: 1px solid #8c8b8b;
}

/* ปรับขนาด Checkbox ให้ใหญ่ขึ้น */
.larger-checkbox {
    width: 15px;
    height: 15px;
    transform: scale(1.5);
}

/* ปรับขนาดตัวอักษร */
.checkboxes label {
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 8px;
}

/* ทำให้ Checkbox อยู่ในแนวนอน */
.checkboxes {
    display: flex;
    justify-content: start;
    gap: 20px;
    /* ระยะห่างระหว่าง Checkbox */
    flex-wrap: wrap;
    /* ให้ย่อได้ในหน้าจอเล็ก */
    padding: 10px 0;
}

button {
    border-radius: 5px;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: opacity 0.4s ease, transform 0.4s ease-out;
}

/* Animation ตอนเริ่มเข้า */
.slide-fade-enter {
    opacity: 0;
    transform: translateY(-15px);
}

/* Animation ตอนออก */
.slide-fade-leave-to {
    opacity: 0;
    transform: translateY(-15px);
}
</style>