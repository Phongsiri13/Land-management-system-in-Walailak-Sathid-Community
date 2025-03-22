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
                    <p class="modal-card-title">แก้ความสัมพันธ์</p>
                    <button class="delete" aria-label="close" @click="closeEditModal"></button>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <label class="label">ชื่อความสัมพันธ์</label>
                        <div class="control">
                            <input class="input" type="text" v-model="updateRelation.label" />
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

        <!-- MODAL Remove -->
        <div v-if="isConfirmModalOpen" class="modal" :class="{ 'is-active': isConfirmModalOpen }">
            <div class="modal-background" @click="closeConfirmModal"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">ยืนยันการเปลี่ยน</p>
                    <button class="delete" aria-label="close" @click="closeConfirmModal"></button>
                </header>
                <section class="modal-card-body">
                    <p class="is-size-5">{{ statusActive ? 'ปิดการใช้งานความสัมพันธ์นี้?' :
                        'เปิดการใช้งานความสัมพันธ์นี้?' }}</p>
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
                    <p class="modal-card-title">เพิ่มความสัมพันธ์</p>
                    <button class="delete" aria-label="close" @click="closeCreateModal"></button>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <label class="label">ชื่อความสัมพันธ์</label>
                        <div class="control">
                            <input class="input" type="text" v-model="new_Relation" />
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
                    <th class="has-text-left has-text-white" style="width: 60%;">ชื่อความสัมพันธ์</th>
                    <th class="has-text-left has-text-white"></th>
                </tr>
            </thead>
            <tbody v-if="!page_loading">
                <tr v-if="statusActive == true" v-for="(item, index) in relationFiles" :key="item.value"
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
                <tr v-if="statusActive == false" v-for="(item, index) in relationFiles" :key="item.value"
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
                <tr v-if="relationFiles.length === 0">
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
import { getOneRelation } from '@/api/apiManageInformation';
import { fetchRelationActive } from '@/api/apiHeir';
import LoadingSpinner from '../LoadingSpinner.vue';

export default {
    components: {
        LoadingSpinner
    },
    data() {
        return {
            statusActive: true, // 1 false = 0
            relationFiles: [],
            isEditModalOpen: false,
            isConfirmModalOpen: false,
            isCreateModalOpen: false,
            updateRelation: { value: null, label: '' },
            loadingCreate: false,
            loadingEdit: false,
            loadingRemove: false,
            new_Relation: '',
            deleteItem: null,
            page_loading: true,
        };
    },
    methods: {
        async validateRelationAdd() {
            // ตรวจสอบค่าว่าง
            if (!this.new_Relation || this.new_Relation.trim() === '') {
                await showWarningAlert('⚠️ การเพิ่มข้อมูลสถานะที่ดิน', 'กรุณากรอกชื่อสถานะที่ดิน!');
                return false;
            }

            // ตรวจสอบความยาว ต้องมีอย่างน้อย 3 ตัวอักษร และไม่เกิน 30 ตัว
            const textWithoutSpaces = this.new_Relation.replace(/\s/g, ''); // ตัดช่องว่างออก
            if (textWithoutSpaces.length < 3) {
                await showWarningAlert('⚠️ การเพิ่มข้อมูลสถานะที่ดิน', 'ชื่อสถานะที่ดินต้องมีตัวอักษรอย่างน้อย 3 ตัว!');
                return false;
            }
            if (this.new_Relation.length > 30) {
                await showWarningAlert('⚠️ การเพิ่มข้อมูลสถานะที่ดิน', 'ชื่อสถานะที่ดินต้องไม่เกิน 30 ตัวอักษร!');
                return false;
            }

            // ตรวจสอบว่าอนุญาตเฉพาะตัวอักษรภาษาไทยเท่านั้น
            const validPattern = /^[\u0E00-\u0E7F]+$/;
            if (!validPattern.test(this.new_Relation)) {
                await showWarningAlert('⚠️ การเพิ่มข้อมูลสถานะที่ดิน', 'ชื่อสถานะที่ดินสามารถมีเฉพาะตัวอักษรภาษาไทยเท่านั้น!');
                return false;
            }

            return true; // ผ่านการตรวจสอบ
        },
        async validateRelationEdit() {
            // ตรวจสอบค่าว่าง
            if (!this.updateRelation.label || this.updateRelation.label.trim() === '') {
                await showWarningAlert('⚠️ การเพิ่มข้อมูลสถานะที่ดิน', 'กรุณากรอกชื่อสถานะที่ดิน!');
                return false;
            }

            // ตรวจสอบความยาว ต้องมีอย่างน้อย 3 ตัวอักษร และไม่เกิน 30 ตัว
            const textWithoutSpaces = this.updateRelation.label.replace(/\s/g, ''); // ตัดช่องว่างออก
            if (textWithoutSpaces.length < 3) {
                await showWarningAlert('⚠️ การเพิ่มข้อมูลสถานะที่ดิน', 'ชื่อสถานะที่ดินต้องมีตัวอักษรอย่างน้อย 3 ตัว!');
                return false;
            }
            if (this.updateRelation.label.length > 30) {
                await showWarningAlert('⚠️ การเพิ่มข้อมูลสถานะที่ดิน', 'ชื่อสถานะที่ดินต้องไม่เกิน 30 ตัวอักษร!');
                return false;
            }

            // ตรวจสอบว่าอนุญาตเฉพาะตัวอักษรภาษาไทยเท่านั้น
            const validPattern = /^[\u0E00-\u0E7F]+$/;
            if (!validPattern.test(this.updateRelation.label)) {
                await showWarningAlert('⚠️ การเพิ่มข้อมูลสถานะที่ดิน', 'ชื่อสถานะที่ดินสามารถมีเฉพาะตัวอักษรภาษาไทยเท่านั้น!');
                return false;
            }

            return true; // ผ่านการตรวจสอบ
        },
        async saveNewDCLandType() {
            const createData = {
                label: this.new_Relation,
            }
            // ตรวจสอบค่าก่อนส่งไป Backend
            const isValid = await this.validateRelationAdd();
            if (!isValid) return;

            // Close the modal after saving
            this.loadingCreate = true;
            try {
                const response = await axios.post(`${DOMAIN_NAME}/manage_relation/create`, createData, {
                    withCredentials: true
                });
                // console.log('response:', response.data)
                await showSuccessAlert('เพิ่มข้อมูลความสัมพันธ์', response.data.message);
                if (response.data.success) {
                    this.relationFiles = [];
                    this.relationFiles = await fetchRelationActive('1');
                }
            } catch (error) {
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

                await showErrorAlert('การเพิ่มข้อมูลความสัมพันธ์', errorMessage);
            } finally {
                this.loadingCreate = false;
                this.new_Relation = '';
                this.closeCreateModal();
            }
        },
        async confirmRemove(item) {
            this.loadingRemove = true;
            const active = this.statusActive == true ? '0' : '1';

            try {
                const response = await axios.put(`${DOMAIN_NAME}/manage_relation/active/${item}`,
                    { id: active },
                    {
                        withCredentials: true
                    }
                );
                if (response.data.success) {
                    this.relationFiles = [];
                    this.relationFiles = await fetchRelationActive(active)
                    await showSuccessAlert('เปลี่ยนข้อมูลความสัมพันธ์', response.data.message);
                    if (this.statusActive) {
                        this.activePage(false)
                    } else {
                        this.activePage(true)
                    }
                }
            } catch (error) {
                await showErrorAlert('เปลี่ยนข้อมูลความสัมพันธ์', response.data.message);
            } finally {
                this.loadingRemove = false;
                this.closeConfirmModal(); // Close the modal after deletion
            }
        },
        // for edit
        async saveEdit() {
            const isValid = await this.validateRelationEdit();
            if (!isValid) return;
            this.loadingEdit = true;

            const active = this.statusActive == true ? '0' : '1';
            try {
                const response = await axios.put(`${DOMAIN_NAME}/manage_relation/${this.updateRelation.value}`, {
                    label: this.updateRelation.label,
                }, {
                    withCredentials: true
                });
                await showSuccessAlert('อัพเดทข้อมูลสถานะ', response.data.message);
                this.relationFiles = []
                if (response.data.success) {
                    if (this.statusActive) {
                        this.relationFiles = await fetchRelationActive('1')
                    } else {
                        this.relationFiles = await fetchRelationActive('0')
                    }
                }
                if (active) {
                    this.activePage(this.statusActive)
                } else {
                    this.activePage(this.statusActive)
                }
                console.log('Response:', response.data);
            } catch (error) {
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

                await showErrorAlert('อัพเดทข้อมูลสถานะ!', errorMessage);
            } finally {
                this.updateRelation = { value: null, label: '' };
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
        },
        prepareRemove(item) {
            this.deleteItem = item;
            this.isConfirmModalOpen = true; // Show confirmation modal
        },
        async openEditModal(item) {
            console.log('item:', item)
            try {
                const response = await getOneRelation(item);
                if (response.data) {
                    console.log('res:', response.data);
                    this.updateRelation = {
                        value: response.data[0].id,
                        label: response.data[0].label
                    };
                }
            } catch (error) {

            } finally {
                this.isEditModalOpen = true;
            }
        },
        closeEditModal() {
            this.isEditModalOpen = false;
            this.updateRelation = { value: null, label: '' };
        },
        closeConfirmModal() {
            this.isConfirmModalOpen = false; // Close confirmation modal
            this.deleteItem = null; // Reset the item to null
        },
        async activePage(act) {
            // Ensure statusActive is defined in your component's data
            this.statusActive = act;
            const active = this.statusActive ? '1' : '0';
            console.log('active:', active);

            try {
                // Await the asynchronous function call
                const getRelation = await fetchRelationActive(active);
                this.relationFiles = [...getRelation]
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
        }
    },
    async mounted() {
        try {
            this.relationFiles = await fetchRelationActive('1');
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
    background-color: #C04000;
}

.btn-active-using {
    min-width: 100px;
    margin-right: 5px;
}

.button {
    border-radius: 5px;
}
</style>