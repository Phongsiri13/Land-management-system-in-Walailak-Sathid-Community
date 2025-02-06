<template>
    <div>
        <!-- add status -->
        <button class="button is-success is-rounded mb-3 is-pulled-right" @click="openCreateModal">
            <span class="icon">
                <i class="fas fa-plus"></i>
            </span>
            <span>เพิ่ม</span>
        </button>

        <!-- MODAL (Edit) -->
        <div v-if="isEditModalOpen == true" class="modal" :class="{ 'is-active': isEditModalOpen }">
            <div class="modal-background" @click="closeEditModal"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">แก้ไขชื่อประเภทไฟล์</p>
                    <button class="delete" aria-label="close" @click="closeEditModal"></button>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <label class="label">ชื่อประเภทไฟล์</label>
                        <div class="control">
                            <input class="input" type="text" v-model="updateDcLandType.label" />
                        </div>
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success" :class="{ 'is-loading': loadingEdit }"
                        @click="saveEdit">บันทึก</button>
                    <button class="button" @click="closeEditModal">ยกเลิก</button>
                </footer>
            </div>
        </div>

        <!-- Confirmation Modal for Remove -->
        <div v-if="isConfirmModalOpen" class="modal" :class="{ 'is-active': isConfirmModalOpen }">
            <div class="modal-background" @click="closeConfirmModal"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">ยืนยันการลบ</p>
                    <button class="delete" aria-label="close" @click="closeConfirmModal"></button>
                </header>
                <section class="modal-card-body">
                    <p>คุณแน่ใจหรือไม่ว่าจะลบสถานะที่ดินนี้?</p>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-danger" :class="{ 'is-loading': loadingRemove }"
                        @click="confirmRemove(deleteItem)">ยืนยัน</button>
                    <button class="button" @click="closeConfirmModal">ยกเลิก</button>
                </footer>
            </div>
        </div>

        <!-- Create New Status Modal -->
        <div v-if="isCreateModalOpen" class="modal" :class="{ 'is-active': isCreateModalOpen }">
            <div class="modal-background" @click="closeCreateModal"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">เพิ่มประเภทเอกสารของที่ดินใหม่</p>
                    <button class="delete" aria-label="close" @click="closeCreateModal"></button>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <label class="label">ชื่อประเภทไฟล์</label>
                        <div class="control">
                            <input class="input" type="text" v-model="new_dc_land_type" />
                        </div>
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success" :class="{ 'is-loading': loadingCreate }"
                        @click="saveNewDCLandType">บันทึก</button>
                    <button class="button" @click="closeCreateModal">ยกเลิก</button>
                </footer>
            </div>
        </div>

        <table class="table is-striped is-bordered is-hoverable is-fullwidth">
            <thead class="table-header">
                <tr>
                    <th class="has-text-centered has-text-white" style="width: 10%;">ลำดับ</th>
                    <th class="has-text-centered has-text-white" style="width: 10%;">รหัส</th>
                    <th class="has-text-centered has-text-white" style="width: 50%;">ชื่อประโยชน์การใช้ที่ดิน</th>
                    <th class="has-text-centered has-text-white" style="width: 20%;">Action</th>
                </tr>
            </thead>
            <tbody>
                <!-- <tr v-for="(item, index) in dcLandTypeFiles" :key="item.value" class="has-text-centered">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.value }}</td>
                    <td>{{ item.label }}</td>
                    <td>
                        <button class="button is-rounded is-normal is-warning" @click="openEditModal(item.value)">
                            <span class="icon">
                                <i class="fas fa-edit"></i>
                            </span>
                            <span>แก้ไข</span>
                        </button>
                        <button class="button mx-2 is-rounded is-normal is-danger" @click="prepareRemove(item.value)">
                            <span class="icon">
                                <i class="fas fa-trash"></i>
                            </span>
                            <span>ลบ</span>
                        </button>
                    </td>
                </tr> -->
            </tbody>

        </table>
    </div>
</template>

<script>
import { fetchDocumentLandType } from '@/api/apiLand';
import axios from 'axios';
import { showErrorAlert, showSuccessAlert } from '@/utils/alertFunc';
import { getOneDocumentLandType } from '@/api/apiManageInformation';

export default {
    data() {
        return {
            dcLandTypeFiles: [],
            isEditModalOpen: false,
            isConfirmModalOpen: false,
            isCreateModalOpen: false,
            updateDcLandType: { value: null, label: '' },
            loadingCreate: false,
            loadingEdit: false,
            loadingRemove: false,
            new_dc_land_type: '',
            deleteItem: null
        };
    },
    methods: {
        async saveNewDCLandType() {
            const createData = {
                dc_type_name: this.new_dc_land_type
            }
            // Close the modal after saving
            this.loadingCreate = true;
            try {
                const response = await axios.post('http://localhost:3000/manage_land_document_type/create', createData);
                await showSuccessAlert('เพิ่มข้อมูลประเภทไฟล์ที่ดิน', response.data.message);
                if (response.data.success) {
                    this.dcLandTypeFiles = [];
                    this.dcLandTypeFiles = await fetchDocumentLandType();
                }
            } catch (error) {
                await showErrorAlert('เพิ่มข้อมูลประเภทไฟล์ที่ดิน', 'ไม่สำเร็จ');
            } finally {
                this.loadingCreate = false;
                this.closeCreateModal();
            }
        },
        async confirmRemove(item) {
            this.loadingRemove = true;

            try {
                const response = await axios.delete(`http://localhost:3000/manage_land_document_type/${item}`);
                await showSuccessAlert('ลบข้อมูลประเภทไฟล์ที่ดิน', response.data.message);
                if (response.data.success) {
                    this.dcLandTypeFiles = [];
                    this.dcLandTypeFiles = await fetchDocumentLandType();
                }
            } catch (error) {
                await showErrorAlert('ลบข้อมูลประเภทไฟล์ที่ดิน', response.data.message);
            } finally {
                this.loadingRemove = false;
                this.closeConfirmModal(); // Close the modal after deletion
            }
        },
        async saveEdit() {
            this.loadingEdit = true;
            console.log('edit-v:', this.updateDcLandType.label)
            try {
                const response = await axios.put(`http://localhost:3000/manage_land_document_type/${this.updateDcLandType.value}`, {
                    dc_type_name: this.updateDcLandType.label
                });
                await showSuccessAlert('อัพเดทข้อมูลสถานะ', response.data.message);
                if (response.data.success) {
                    this.dcLandTypeFiles = [];
                    this.dcLandTypeFiles = await fetchDocumentLandType();
                }
                console.log('Response:', response.data);
            } catch (error) {
                await showErrorAlert('อัพเดทข้อมูลสถานะ', 'ไม่สำเร็จ');
            } finally {
                this.updateDcLandType = { value: null, label: '' };
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
                const response = await getOneDocumentLandType(item);
                if (response.data) {
                    console.log('res:', response.data);
                    this.updateDcLandType = {
                        value: response.data[0].ID_dc_type,
                        label: response.data[0].dc_type_name
                    };
                }
            } catch (error) {

            }
            this.isEditModalOpen = true;
        },
        closeEditModal() {
            this.isEditModalOpen = false;
            this.updateDcLandType = { value: null, label: '' };
        },
        closeConfirmModal() {
            this.isConfirmModalOpen = false; // Close confirmation modal
            this.deleteItem = null; // Reset the item to null
        },
    },
    async mounted() {
        try {
            this.dcLandTypeFiles = await fetchDocumentLandType();
        } catch (error) {

        }
    }
}
</script>

<style scoped>
.table-header {
    background-color: 	#C04000;
}
</style>