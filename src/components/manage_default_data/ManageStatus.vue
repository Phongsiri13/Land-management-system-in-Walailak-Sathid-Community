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
                    <p class="modal-card-title">แก้ไขสถานะที่ดิน</p>
                    <button class="delete" aria-label="close" @click="closeEditModal"></button>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <label class="label">ชื่อสถานะที่ดิน</label>
                        <div class="control">
                            <input class="input" type="text" v-model="newStatus.label" />
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
                    <p class="modal-card-title">ยืนยันการเปลี่ยนสิทธิ์</p>
                    <button class="delete" aria-label="close" @click="closeConfirmModal"></button>
                </header>
                <section class="modal-card-body">
                    <p>คุณแน่ใจหรือไม่ว่าจะเปลี่ยนสถานะที่ดินนี้?</p>
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
                    <button class="button is-success" :class="{ 'is-loading': loadingCreate }"
                        @click="saveNewStatus">บันทึก</button>
                    <button class="button" @click="closeCreateModal">ยกเลิก</button>
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
                    <th class="has-text-centered has-text-white" style="width: 10%;">ลำดับ</th>
                    <th class="has-text-centered has-text-white" style="width: 10%;">รหัส</th>
                    <th class="has-text-centered has-text-white" style="width: 40%;">ชื่อสถานะที่ดิน</th>
                    <th class="has-text-centered has-text-white" style="width: 30%;"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="statusActive == true" v-for="(item, index) in statusFiles" :key="item.value"
                    class="has-text-centered">
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
                            <span>เปลี่ยน</span>
                        </button>
                    </td>
                </tr>
                <tr v-if="statusActive == false" v-for="(item, index) in statusFiles" :key="item.value"
                    class="has-text-centered">
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
                        <button class="button mx-2 is-rounded is-normal is-success" @click="prepareRemove(item.value)">
                            <span class="icon">
                                <i class="fas fa-check-circle"></i>
                            </span>
                            <span>ใช้งาน</span>
                        </button>
                    </td>
                </tr>
                <tr v-if="statusFiles.length === 0">
                    <td colspan="5" class="has-text-centered has-text-danger title is-4">ไม่มีรายการข้อมูล</td>
                </tr>

            </tbody>

        </table>
    </div>
</template>
<script>
import { fetchLandStatus, fetchLandStatusActive } from '@/api/apiLand';
import axios from 'axios';
import { showErrorAlert, showSuccessAlert } from '@/utils/alertFunc';
import { getOneStatus } from '@/api/apiManageInformation';

export default {
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
            deleteItem: null
        };
    },
    methods: {
        async activePage(act) {
            // Ensure statusActive is defined in your component's data
            this.statusActive = act;
            const active = this.statusActive ? '1' : '0';
            console.log('active:', active);

            try {
                // Await the asynchronous function call
                const ko = await fetchLandStatusActive(active);
                console.log('ko:', ko)
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
        async saveNewStatus() {
            console.log('save status')
            const active = this.statusActive ? '1' : '0';

            const createData = {
                newNameStatus: this.newNameStatus
            }
            // Close the modal after saving
            this.loadingCreate = true;
            try {
                const response = await axios.post('http://localhost:3000/manage_status_info/create', createData);
                console.log('Response:', response.data);
                await showSuccessAlert('เพิ่มข้อมูลสถานะ', response.data.message);
                if (response.data.success) {
                    if (active == '1') {
                        this.statusFiles = await fetchLandStatusActive('1')
                    } else {
                        this.statusFiles = await fetchLandStatusActive('0')
                    }
                }
            } catch (error) {
                await showErrorAlert('เพิ่มข้อมูลสถานะ', 'ไม่สำเร็จ');
            } finally {
                this.loadingCreate = false;
                this.closeCreateModal();
            }
        },
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
            } catch (error) {
                await showErrorAlert('เพิ่มข้อมูลสถานะ', 'ไม่สำเร็จ');
            } finally {
                this.loadingRemove = false;
                this.closeConfirmModal(); // Close the modal after deletion
            }
        },
        async saveEdit() {
            console.log('edit com:', this.editData)
            console.log('edit-v:', this.newStatus.label)
            const active = this.statusActive == true ? '0' : '1';
            this.loadingEdit = true;
            setTimeout(() => {
                this.loadingEdit = false;
            }, 3000);
            try {
                const response = await axios.put(`http://localhost:3000/manage_status_info/${this.newStatus.value}`, {
                    land_status_name: this.newStatus.label
                });
                await showSuccessAlert('อัพเดทข้อมูลสถานะ', response.data.message);
                this.statusFiles = [];
                if (response.data.success) {
                    if (this.statusActive) {
                        this.statusFiles = await fetchLandStatusActive('1')
                    } else {
                        this.statusFiles = await fetchLandStatusActive('0')
                    }
                }
            } catch (error) {
                await showErrorAlert('อัพเดทข้อมูลสถานะ', 'ไม่สำเร็จ');
            } finally {
                this.newStatus = { value: null, label: '' };
                this.isEditModalOpen = false;
            }
            // this.closeEditModal(); // close model
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
}
</style>