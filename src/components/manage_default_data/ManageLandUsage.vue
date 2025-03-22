<template>
    <div>
        <!-- add status -->
        <button class="button is-success is-rounded mb-3 is-pulled-right" @click="openCreateModal">
            <span class="icon">
                <i class="fas fa-plus"></i>
            </span>
        </button>

        <!-- MODAL (Edit) -->
        <div v-if="isEditModalOpen == true" class="modal" :class="{ 'is-active': isEditModalOpen }">
            <div class="modal-background" @click="closeEditModal"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">แก้ไขชื่อการใช้ประโยชน์ที่ดิน</p>
                    <button class="delete" aria-label="close" @click="closeEditModal"></button>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <label class="label">ชื่อการใช้ประโยชน์ที่ดิน</label>
                        <div class="control">
                            <input class="input" type="text" v-model="updateLandUsage.label" />
                        </div>
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button class="button" @click="closeEditModal">ยกเลิก</button>
                    <div class="mx-1"></div>
                    <button class="button is-success" :class="{ 'is-loading': loadingEdit }"
                        @click="saveEdit">บันทึก</button>
                </footer>
            </div>
        </div>

        <!-- MODAL (Remove) -->
        <div v-if="isConfirmModalOpen" class="modal" :class="{ 'is-active': isConfirmModalOpen }">
            <div class="modal-background" @click="closeConfirmModal"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">ยืนยันการเปลี่ยน</p>
                    <button class="delete" aria-label="close" @click="closeConfirmModal"></button>
                </header>
                <section class="modal-card-body">
                    <p class="is-size-5">{{ statusActive ? 'ปิดการใช้งานการใช้ประโยชน์ที่ดินนี้?' :
                        'เปิดการใช้การใช้ประโยชน์ที่ดินนี้?' }}</p>
                </section>
                <footer class="modal-card-foot">
                    <button class="button" @click="closeConfirmModal">ยกเลิก</button>
                    <div class="mx-1"></div>
                    <button class="button is-success" :class="{ 'is-loading': loadingRemove }"
                        @click="confirmRemove(deleteItem)">บันทึก</button>
                </footer>
            </div>
        </div>

        <!-- Create New Modal -->
        <div v-if="isCreateModalOpen" class="modal" :class="{ 'is-active': isCreateModalOpen }">
            <div class="modal-background" @click="closeCreateModal"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">เพิ่มการใช้ประโยชน์ที่ดิน</p>
                    <button class="delete" aria-label="close" @click="closeCreateModal"></button>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <label class="label">ชื่อการใช้ประโยชน์ที่ดิน</label>
                        <div class="control">
                            <input class="input" type="text" v-model="new_land_usage" />
                        </div>
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button class="button" @click="closeCreateModal">ยกเลิก</button>
                    <div class="mx-1"></div>
                    <button class="button is-success" :class="{ 'is-loading': loadingCreate }"
                        @click="saveNewDCLandType">บันทึก</button>
                </footer>
            </div>
        </div>

        <button class="button is-hovered btn-active-using" :class="{
            'is-success': statusActive,
            'is-hovered': !statusActive
        }" @click="activePage(true)">ใช้งาน</button>
        <button class="button btn-active-using" :class="{
            'is-danger': !statusActive,
            'is-hovered': !statusActive
        }" @click="activePage(false)">
            ไม่ได้ใช้งาน
        </button>

        <table class="table is-striped is-bordered is-hoverable is-fullwidth">
            <thead class="table-header">
                <tr>
                    <th class="has-text-left has-text-white" style="width: 10%;">ลำดับ</th>
                    <!-- <th class="has-text-left has-text-white" style="width: 15%;">รหัส</th> -->
                    <th class="has-text-left has-text-white" style="width: 60%;">ชื่อการใช้ประโยชน์ที่ดิน</th>
                    <th class="has-text-left has-text-white"></th>
                </tr>
            </thead>
            <tbody v-if="!page_loading">
                <tr v-if="statusActive == true" v-for="(item, index) in landUsageFiles" :key="item.value"
                    class="has-text-left">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.label }}</td>
                    <td>
                        <button class="button is-rounded is-normal is-warning" @click="openEditModal(item.value)">
                            <span class="icon">
                                <i class="fas fa-edit"></i>
                            </span>
                        </button>
                        <button class="button mx-2 is-rounded is-normal is-danger" @click="prepareRemove(item.value)">
                            <span class="icon">
                                <i class="fas fa-trash"></i>
                            </span>
                        </button>
                    </td>
                </tr>
                <tr v-if="statusActive == false" v-for="(item, index) in landUsageFiles" :key="item.value"
                    class="has-text-left">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.label }}</td>
                    <td>
                        <button class="button is-rounded is-normal is-warning" @click="openEditModal(item.value)">
                            <span class="icon">
                                <i class="fas fa-edit"></i>
                            </span>
                        </button>
                        <button class="button mx-2 is-rounded is-normal is-link" @click="prepareRemove(item.value)">
                            <span class="icon">
                                <i class="fas fa-check-circle"></i>
                            </span>
                        </button>
                    </td>
                </tr>
                <tr v-if="landUsageFiles.length === 0">
                    <td colspan="5" class="has-text-left has-text-danger title is-4">ไม่มีรายการข้อมูล</td>
                </tr>
            </tbody>
            <LoadingSpinner :isLoading="page_loading" fontSize="22px" v-else />
        </table>
    </div>
</template>

<script>
import DOMAIN_NAME from '@/config/domain_setup';
import axios from 'axios';
import { showErrorAlert, showSuccessAlert, showWarningAlert } from '@/utils/alertFunc';
import { getOneLandUsage } from '@/api/apiManageInformation';
import { fetchLandUsageActive } from '@/api/apiHeir';
import LoadingSpinner from '../LoadingSpinner.vue';

export default {
    components: {
        LoadingSpinner
    },
    data() {
        return {
            statusActive: true, // 1 false = 0
            landUsageFiles: [],
            isEditModalOpen: false,
            isConfirmModalOpen: false,
            isCreateModalOpen: false,
            updateLandUsage: { value: null, label: '' },
            loadingCreate: false,
            loadingEdit: false,
            loadingRemove: false,
            new_land_usage: '',
            deleteItem: null,
            btn_loading: false,
            page_loading: true
        };
    },
    methods: {
        async validateRelationAdd() {
            // ตรวจสอบค่าว่าง
            if (!this.new_land_usage || this.new_land_usage.trim() === '') {
                await showWarningAlert('⚠️ การเพิ่มข้อมูลสถานะที่ดิน', 'กรุณากรอกชื่อสถานะที่ดิน!');
                return false;
            }

            // ตรวจสอบความยาว ต้องมีอย่างน้อย 3 ตัวอักษร และไม่เกิน 30 ตัว
            const textWithoutSpaces = this.new_land_usage.replace(/\s/g, ''); // ตัดช่องว่างออก
            if (textWithoutSpaces.length < 3) {
                await showWarningAlert('⚠️ การเพิ่มข้อมูลสถานะที่ดิน', 'ชื่อสถานะที่ดินต้องมีตัวอักษรอย่างน้อย 3 ตัว!');
                return false;
            }
            if (this.new_land_usage.length > 30) {
                await showWarningAlert('⚠️ การเพิ่มข้อมูลสถานะที่ดิน', 'ชื่อสถานะที่ดินต้องไม่เกิน 30 ตัวอักษร!');
                return false;
            }

            // ตรวจสอบว่าอนุญาตเฉพาะตัวอักษรภาษาไทยเท่านั้น
            const validPattern = /^[\u0E00-\u0E7F]+$/;
            if (!validPattern.test(this.new_land_usage)) {
                await showWarningAlert('⚠️ การเพิ่มข้อมูลสถานะที่ดิน', 'ชื่อสถานะที่ดินสามารถมีเฉพาะตัวอักษรภาษาไทยเท่านั้น!');
                return false;
            }

            return true; // ผ่านการตรวจสอบ
        },
        async validateRelationEdit() {
            // ตรวจสอบค่าว่าง
            if (!this.updateLandUsage.label || this.updateLandUsage.label.trim() === '') {
                await showWarningAlert('⚠️ การเพิ่มข้อมูลสถานะที่ดิน', 'กรุณากรอกชื่อสถานะที่ดิน!');
                return false;
            }

            // ตรวจสอบความยาว ต้องมีอย่างน้อย 3 ตัวอักษร และไม่เกิน 30 ตัว
            const textWithoutSpaces = this.updateLandUsage.label.replace(/\s/g, ''); // ตัดช่องว่างออก
            if (textWithoutSpaces.length < 3) {
                await showWarningAlert('⚠️ การเพิ่มข้อมูลสถานะที่ดิน', 'ชื่อสถานะที่ดินต้องมีตัวอักษรอย่างน้อย 3 ตัว!');
                return false;
            }
            if (this.updateLandUsage.label.length > 30) {
                await showWarningAlert('⚠️ การเพิ่มข้อมูลสถานะที่ดิน', 'ชื่อสถานะที่ดินต้องไม่เกิน 30 ตัวอักษร!');
                return false;
            }

            // ตรวจสอบว่าอนุญาตเฉพาะตัวอักษรภาษาไทยเท่านั้น
            const validPattern = /^[\u0E00-\u0E7F]+$/;
            if (!validPattern.test(this.updateLandUsage.label)) {
                await showWarningAlert('⚠️ การเพิ่มข้อมูลสถานะที่ดิน', 'ชื่อสถานะที่ดินสามารถมีเฉพาะตัวอักษรภาษาไทยเท่านั้น!');
                return false;
            }

            return true; // ผ่านการตรวจสอบ
        },
        // เพิ่ม
        async saveNewDCLandType() {
            const createData = {
                label: this.new_land_usage
            }

            const isValid = await this.validateRelationAdd();
            if (!isValid) return;

            // Close the modal after saving
            this.loadingCreate = true;
            try {
                const response = await axios.post(`${DOMAIN_NAME}/manage_land_usages_info/create`,
                    createData, {
                    withCredentials: true
                });
                // console.log('res:', response)
                if (response.data.success === true) {
                    await showSuccessAlert('การเพิ่มข้อมูลการใช้ประโยชน์ที่ดิน!', response.data.message);
                    this.landUsageFiles = await fetchLandUsageActive('1');
                }
            } catch (error) {
                // console.error('error:', error);
                let errorMessage = 'ไม่สำเร็จ';
                // ตรวจสอบว่ามี response กลับมาหรือไม่ (จาก backend)
                if (error.response) {
                    if (error.response.status === 409) {
                        errorMessage = error.response.data.message || 'ข้อมูลซ้ำในระบบ กรุณาตรวจสอบ';
                    } else if (error.response.status === 500) {
                        errorMessage = 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล';
                    } else {
                        errorMessage = error.response.data.message || 'เกิดข้อผิดพลาดที่ไม่คาดคิด';
                    }
                } else if (error.request) {
                    errorMessage = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้';
                } else {
                    errorMessage = error.message;
                }

                await showErrorAlert('การเพิ่มข้อมูลการใช้ประโยชน์ที่ดิน', errorMessage);
            } finally {
                this.loadingCreate = false;
                this.new_land_usage = '';
                this.closeCreateModal();
            }
        },
        // ลบการใช้ประโยชน์ที่ดิน
        async confirmRemove(item) {
            this.loadingRemove = true;
            const active = this.statusActive == true ? '0' : '1';

            try {
                const response = await axios.put(`${DOMAIN_NAME}/manage_land_usages_info/active/${item}`,
                    { actived: active },
                    {withCredentials: true}
                );
                // console.log('res:',response)
                await showSuccessAlert('ลบข้อมูลการใช้ประโยชน์ที่ดิน', response.data.message);
                if (response.data.success) {
                    this.landUsageFiles = [];
                    if (this.statusActive) {
                        this.landUsageFiles = await fetchLandUsageActive(active);
                        this.activePage(false)
                    } else {
                        this.landUsageFiles = await fetchLandUsageActive(active);
                        this.activePage(true)
                    }
                }
            } catch (error) {
                await showErrorAlert('ลบข้อมูลการใช้ประโยชน์ที่ดิน', response.data.message);
            } finally {
                this.loadingRemove = false;
                this.closeConfirmModal(); // Close the modal after deletion
            }
        },
        // move another page
        async activePage(act) {
            // Ensure statusActive is defined in your component's data
            this.statusActive = act;
            const active = this.statusActive ? '1' : '0';
            console.log('active:', active);

            try {
                this.landUsageFiles = await fetchLandUsageActive(active);
            } catch (error) {
                // Ensure showErrorAlert is an asynchronous function returning a Promise
                if (typeof showErrorAlert === 'function') {
                    await showErrorAlert('อัพเดทข้อมูลการใช้ประโยชน์ที่ดิน', 'ไม่สำเร็จ');
                } else {
                    console.error('showErrorAlert is not a function or not asynchronous');
                }
            } finally {
                // Optional: Any cleanup operations can be performed here
            }
        },
        // อัพเดท
        async saveEdit() {
            // console.log('edit-v:', this.updateLandUsage.label)
            // console.log('edit-v:', this.updateLandUsage.value)
            const active = this.statusActive == true ? '0' : '1';

            const isValid = await this.validateRelationEdit();
            if (!isValid) return;

            this.loadingEdit = true;

            try {
                const response = await axios.put(`${DOMAIN_NAME}/manage_land_usages_info/${this.updateLandUsage.value}`, {
                    label: this.updateLandUsage.label
                },{withCredentials: true});
                await showSuccessAlert('การใช้ประโยชน์ที่ดิน', response.data.message);
                this.landUsageFiles = []
                if (response.data.success) {
                    if (this.statusActive) {
                        this.landUsageFiles = await fetchLandUsageActive('1')
                    } else {
                        this.landUsageFiles = await fetchLandUsageActive('0')
                    }
                }
                console.log('Response:', response.data);
            } catch (error) {
                await showErrorAlert('อัพเดทข้อมูลการใช้ประโยชน์ที่ดิน', 'ไม่สำเร็จ');
            } finally {
                this.updateLandUsage = { value: null, label: '' };
                this.isEditModalOpen = false;
                this.loadingEdit = false;
                this.closeEditModal(); // close model
            }
        },
        openCreateModal() {
            this.isCreateModalOpen = true; // Open modal for creating a new status
        },
        closeCreateModal() {
            this.isCreateModalOpen = false; // Close modal for creating a new status
            this.new_land_usage = ''
        },
        prepareRemove(item) {
            this.deleteItem = item;
            this.isConfirmModalOpen = true; // Show confirmation modal
        },
        async openEditModal(item) {
            console.log('item:', item)
            try {
                const response = await getOneLandUsage(item);
                if (response.length > 0) {
                    this.updateLandUsage = {
                        value: response[0].id_usage,
                        label: response[0].land_usage_name
                    };
                }

            } catch (error) {
                // failed loading
            }
            this.isEditModalOpen = true;
        },
        closeEditModal() {
            this.isEditModalOpen = false;
            this.updateLandUsage = { value: null, label: '' };
        },
        closeConfirmModal() {
            this.isConfirmModalOpen = false; // Close confirmation modal
            this.deleteItem = null; // Reset the item to null
        },
    },
    async mounted() {
        try {
            this.landUsageFiles = await fetchLandUsageActive('1');
        } catch (error) {

        } finally {
            setTimeout(() => {
                this.page_loading = false;
            }, 500);
        }
    }
}
</script>

<style scoped>
.table-header {
    background-color: #0D1B2A;
}

.btn-active-using {
    min-width: 100px;
    margin-right: 5px;
}

.button {
    border-radius: 5px;
}
</style>