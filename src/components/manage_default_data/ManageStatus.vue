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
                    <p class="modal-card-title">แก้ไขสถานะที่ดิน</p>
                    <button class="delete" aria-label="close" @click="closeEditModal"></button>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <label class="label">ชื่อสถานะที่ดิน</label>
                        <div class="control">
                            <input class="input" type="text" v-model="newStatus.label" required />
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

        <!-- Confirmation Modal for Remove -->
        <div v-if="isConfirmModalOpen" class="modal" :class="{ 'is-active': isConfirmModalOpen }">
            <div class="modal-background" @click="closeConfirmModal"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">ยืนยันการเปลี่ยนสิทธิ์</p>
                    <button class="delete" aria-label="close" @click="closeConfirmModal"></button>
                </header>
                <section class="modal-card-body">
                    <p class="is-size-5">{{ statusActive ? 'ปิดการใช้งานสถานะนี้?' : 'เปิดการใช้งานสถานะนี้?' }}</p>
                </section>
                <footer class="modal-card-foot">
                    <button class="button" @click="closeConfirmModal">ยกเลิก</button>
                    <div class="mx-1"></div>
                    <button class="button is-success" :class="{ 'is-loading': loadingRemove }"
                        @click="confirmRemove(deleteItem)">บันทึก</button>
                </footer>
            </div>
        </div>

        <!-- Create New Status Modal -->
        <div v-if="isCreateModalOpen" class="modal" :class="{ 'is-active': isCreateModalOpen }">
            <div class="modal-background" @click="closeCreateModal"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">เพิ่มสถานะที่ดิน</p>
                    <button class="delete" aria-label="close" @click="closeCreateModal"></button>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <label class="label">ชื่อสถานะที่ดิน</label>
                        <div class="control">
                            <input class="input" type="text" v-model="newNameStatus" />
                        </div>
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button class="button" @click="closeCreateModal">ยกเลิก</button>
                    <div class="mx-1"></div>
                    <button class="button is-success" :class="{ 'is-loading': loadingCreate }"
                        @click="saveNewStatus">บันทึก</button>
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
                    <th class="has-text-white" style="width: 10%;">ลำดับ</th>
                    <!-- <th class="has-text-centered has-text-white" style="width: 15%;">รหัส</th> -->
                    <th class="has-text-white" style="width: 60%;">ชื่อสถานะที่ดิน</th>
                    <th class="has-text-white" ></th>
                </tr>
            </thead>
            <tbody v-if="!page_loading">
                <!-- ใช้งานสถานะ -->
                <tr v-if="statusActive == true" v-for="(item, index) in statusFiles" :key="item.value"
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
                <!-- ไม่ใช้งานสถานะ -->
                <tr v-if="statusActive == false" v-for="(item, index) in statusFiles" :key="item.value"
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
                <tr v-if="statusFiles.length === 0">
                    <td colspan="5" class="has-text-centered has-text-danger title is-4">ไม่มีรายการข้อมูล</td>
                </tr>
            </tbody>
            <LoadingSpinner :isLoading="page_loading" fontSize="22px" v-else />
        </table>
    </div>
</template>

<script>
import { fetchLandStatus, fetchLandStatusActive } from '@/api/apiLand';
import axios from 'axios';
import { showErrorAlert, showSuccessAlert, showWarningAlert } from '@/utils/alertFunc';
import { getOneStatus } from '@/api/apiManageInformation';
import LoadingSpinner from '../LoadingSpinner.vue';

export default {
    components: {
        LoadingSpinner
    },
    data() {
        return {
            statusActive: true, // 1 false = 0
            statusFiles: [],
            isEditModalOpen: false,
            isConfirmModalOpen: false,
            isCreateModalOpen: false,
            editData: { value: null, label: '' },
            newStatus: { value: null, label: '' },
            loadingCreate: false,
            loadingEdit: false,
            loadingRemove: false,
            newNameStatus: '',
            deleteItem: null,
            page_loading: true
        };
    },
    methods: {
        // for edit detection form
        async validateNewStatusLabel() {
            // ตรวจสอบค่าว่าง
            if (!this.newStatus.label || this.newStatus.label.trim() === '') {
                await showWarningAlert('⚠️ การอัพเดทข้อมูลสถานะ', 'กรุณากรอกชื่อสถานะที่ดิน!');
                return false;
            }

            // ตรวจสอบความยาว ต้องมีอย่างน้อย 3 ตัวอักษร และไม่เกิน 30 ตัว
            const textWithoutSpaces = this.newStatus.label.replace(/\s/g, ''); // ตัดช่องว่างออก
            if (textWithoutSpaces.length < 3) {
                await showWarningAlert('⚠️ การอัพเดทข้อมูลสถานะ', 'ชื่อสถานะที่ดินต้องมีตัวอักษรอย่างน้อย 3 ตัว!');
                return false;
            }
            if (this.newStatus.label.length > 30) {
                await showWarningAlert('⚠️ การอัพเดทข้อมูลสถานะ', 'ชื่อสถานะที่ดินต้องไม่เกิน 30 ตัวอักษร!');
                return false;
            }

            // ตรวจสอบว่าอนุญาตเฉพาะตัวอักษรไทย, อังกฤษ, ตัวเลข และอักขระพิเศษที่กำหนด (. , / -) + เว้นวรรค
            const validPattern = /^[a-zA-Z0-9\u0E00-\u0E7F.,/\-\s]+$/;
            if (!validPattern.test(this.newStatus.label)) {
                await showWarningAlert('⚠️ การอัพเดทข้อมูลสถานะ', 'ชื่อสถานะที่ดินสามารถมีเฉพาะตัวอักษรไทย อังกฤษ ตัวเลข เว้นวรรค และอักขระพิเศษ . , / - เท่านั้น!');
                return false;
            }

            return true; // ผ่านการตรวจสอบ
        },
        // for create detection form
        async validateLandStatusName() {
            // ตรวจสอบค่าว่าง
            if (!this.newNameStatus || this.newNameStatus.trim() === '') {
                await showWarningAlert('⚠️ การเพิ่มข้อมูลสถานะที่ดิน', 'กรุณากรอกชื่อสถานะที่ดิน!');
                return false;
            }

            // ตรวจสอบความยาว ต้องมีอย่างน้อย 3 ตัวอักษร และไม่เกิน 30 ตัว
            const textWithoutSpaces = this.newNameStatus.replace(/\s/g, ''); // ตัดช่องว่างออก
            if (textWithoutSpaces.length < 3) {
                await showWarningAlert('⚠️ การเพิ่มข้อมูลสถานะที่ดิน', 'ชื่อสถานะที่ดินต้องมีตัวอักษรอย่างน้อย 3 ตัว!');
                return false;
            }
            if (this.newNameStatus.length > 30) {
                await showWarningAlert('⚠️ การเพิ่มข้อมูลสถานะที่ดิน', 'ชื่อสถานะที่ดินต้องไม่เกิน 30 ตัวอักษร!');
                return false;
            }

            // ตรวจสอบว่าอนุญาตเฉพาะตัวอักษรไทย, อังกฤษ, ตัวเลข และอักขระพิเศษที่กำหนด (. , / -) + เว้นวรรค
            const validPattern = /^[a-zA-Z0-9\u0E00-\u0E7F.,/\-\s]+$/;
            if (!validPattern.test(this.newNameStatus)) {
                await showWarningAlert('⚠️ การเพิ่มข้อมูลสถานะที่ดิน', 'ชื่อสถานะที่ดินสามารถมีเฉพาะตัวอักษรไทย อังกฤษ ตัวเลข เว้นวรรค และอักขระพิเศษ . , / - เท่านั้น!');
                return false;
            }

            return true; // ผ่านการตรวจสอบ
        },
        async activePage(act) {
            // Ensure statusActive is defined in your component's data
            this.statusActive = act;
            const active = this.statusActive ? '1' : '0';
            console.log('active:', active);

            try {
                // Await the asynchronous function call
                const ko = await fetchLandStatusActive(active);
                this.statusFiles = [...ko]
            } catch (error) {
                // Ensure showErrorAlert is an asynchronous function returning a Promise
                if (typeof showErrorAlert === 'function') {
                    await showErrorAlert('อัพเดทข้อมูลสถานะ', 'ไม่สำเร็จ');
                } else {
                    console.error('showErrorAlert is not a function or not asynchronous');
                }
            } finally {
                // Optional: Any cleanup operations can be performed here
            }
        },
        // Create new
        async saveNewStatus() {
            // console.log('save status')
            const active = this.statusActive ? '1' : '0';

            const createData = {
                newNameStatus: this.newNameStatus
            }

            // เรียกใช้ฟังก์ชันตรวจสอบก่อนดำเนินการต่อ
            const isValid = await this.validateLandStatusName();
            if (!isValid) return;

            // Close the modal after saving
            this.loadingCreate = true;
            try {
                const response = await axios.post('http://localhost:3000/manage_status_info/create', createData);
                console.log('Response:', response.data);
                await showSuccessAlert('การเพิ่มข้อมูลสถานะที่ดิน', response.data.message);
                if (response.data.success) {
                    if (active == '1') {
                        this.statusFiles = await fetchLandStatusActive('1')
                    } else {
                        this.statusFiles = await fetchLandStatusActive('0')
                    }
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

                await showErrorAlert('การเพิ่มข้อมูลสถานะที่ดิน', errorMessage);
            } finally {
                this.loadingCreate = false;
                this.newNameStatus = '';
                
                this.closeCreateModal();
            }
        },
        // Remove status
        async confirmRemove(item) {
            console.log("Removing item:", item);
            this.loadingRemove = true;
            const active = this.statusActive == true ? '0' : '1';

            try {
                const response = await axios.put(`http://localhost:3000/manage_status_info/active/${item}`, {
                    id: active
                });
                console.log('Response:', response.data);
                await showSuccessAlert('เปลี่ยนข้อมูลสถานะ', response.data.message);
                this.statusFiles = [];
                if (response.data.success) {
                    if (this.statusActive) {
                        this.statusFiles = await fetchLandStatusActive('1')
                    } else {
                        this.statusFiles = await fetchLandStatusActive('0')
                    }
                }
                console.log('error')
            } catch (error) {
                await showErrorAlert('เพิ่มข้อมูลสถานะ', 'ไม่สำเร็จ');
            } finally {
                this.loadingRemove = false;
                this.closeConfirmModal(); // Close the modal after deletion
            }
        },
        // Edit status name
        async saveEdit() {
            // console.log('edit com:', this.editData)
            // console.log('edit-v:', this.newStatus.label)
            const active = this.statusActive == true ? '0' : '1';

            // newStatus.label
            // ตรวจสอบค่าก่อนส่งไป Backend
            const isValid = await this.validateNewStatusLabel();
            if (!isValid) return;
            this.loadingEdit = true;

            try {
                const response = await axios.put(`http://localhost:3000/manage_status_info/${this.newStatus.value}`, {
                    land_status_name: this.newStatus.label
                });
                await showSuccessAlert('การอัพเดทข้อมูลสถานะ', response.data.message);
                this.statusFiles = [];
                if (response.data.success) {
                    if (this.statusActive) {
                        this.statusFiles = await fetchLandStatusActive('1')
                    } else {
                        this.statusFiles = await fetchLandStatusActive('0')
                    }
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

                await showErrorAlert('การอัพเดทข้อมูลสถานะ', errorMessage);
            } finally {
                this.newStatus = { value: null, label: '' };
                this.loadingEdit = false;
                this.isEditModalOpen = false;
            }
            // this.closeEditModal(); // close model
        },
        openCreateModal() {
            this.isCreateModalOpen = true; // Open modal for creating a new status
        },
        closeCreateModal() {
            this.isCreateModalOpen = false; // Close modal for creating a new status
            this.newNameStatus = '';
        },
        prepareRemove(item) {
            this.deleteItem = item;
            this.isConfirmModalOpen = true; // Show confirmation modal
        },
        async openEditModal(item) {
            console.log('item:', item)
            try {
                const response = await getOneStatus(item);
                if (response.data) {
                    console.log('res:', response.data);
                    this.newStatus = {
                        value: response.data[0].ID_land_status,
                        label: response.data[0].land_status_name
                    };
                    this.editData = {
                        value: response.data[0].ID_land_status,
                        label: response.data[0].land_status_name
                    }
                }
            } catch (error) {

            }
            this.isEditModalOpen = true;
        },
        closeEditModal() {
            this.isEditModalOpen = false;
            this.newStatus = { value: null, label: '' };
            this.editData = { value: null, label: '' }
        },
        closeConfirmModal() {
            this.isConfirmModalOpen = false; // Close confirmation modal
            this.deleteItem = null; // Reset the item to null
        },
    },
    async mounted() {
        try {
            this.statusFiles = await fetchLandStatusActive('1');
            console.log("statusFile:", this.statusFiles)
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
    background-color: #454B1B;
}

.btn-active-using {
    min-width: 100px;
    margin-right: 5px;
}

.button {
    border-radius: 5px;
}
</style>