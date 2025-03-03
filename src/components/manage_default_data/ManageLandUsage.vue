<template>
    <div>
        <!-- add status -->
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
                    <button class="button is-success" :class="{ 'is-loading': loadingEdit }"
                        @click="saveEdit">บันทึก</button>
                </footer>
            </div>
        </div>

        <table class="table is-striped is-bordered is-hoverable is-fullwidth">
            <thead class="table-header">
                <tr>
                    <th class="has-text-centered has-text-white" style="width: 10%;">ลำดับ</th>
                    <th class="has-text-centered has-text-white" style="width: 10%;">รหัส</th>
                    <th class="has-text-centered has-text-white" style="width: 50%;">ชื่อการใช้ประโยชน์ที่ดิน</th>
                    <th class="has-text-centered has-text-white" style="width: 20%;">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in relationFiles" :key="item.value" class="has-text-centered">
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
                        <!-- <button class="button mx-2 is-rounded is-normal is-danger" @click="prepareRemove(item.value)">
                            <span class="icon">
                                <i class="fas fa-trash"></i>
                            </span>
                            <span>เปลี่ยน</span>
                        </button> -->
                    </td>
                </tr>
                <tr v-if="relationFiles.length === 0">
                    <td colspan="5" class="has-text-centered has-text-danger title is-4">ไม่มีรายการข้อมูล</td>
                </tr>
            </tbody>

        </table>
    </div>
</template>

<script>
import axios from 'axios';
import { showErrorAlert, showSuccessAlert } from '@/utils/alertFunc';
import { getOneLandUsage } from '@/api/apiManageInformation';
import { fetchRelationActive, fetchLandUsageActive} from '@/api/apiHeir';

export default {
    data() {
        return {
            statusActive: true, // 1 false = 0
            relationFiles: [],
            isEditModalOpen: false,
            isConfirmModalOpen: false,
            isCreateModalOpen: false,
            updateLandUsage: { value: null, label: '' },
            loadingCreate: false,
            loadingEdit: false,
            loadingRemove: false,
            new_Relation: '',
            deleteItem: null,
            btn_loading: false
        };
    },
    methods: {
        // async saveNewDCLandType() {
        //     const createData = {
        //         label: this.new_Relation
        //     }
        //     // Close the modal after saving
        //     this.loadingCreate = true;
        //     try {
        //         const response = await axios.post('http://localhost:3000/manage_relation/create', createData);
        //         await showSuccessAlert('เพิ่มข้อมูลความสัมพันธ์', response.data.message);
        //         if (response.data.success) {
        //             this.relationFiles = [];
        //             this.relationFiles = await fetchRelation();
        //         }
        //     } catch (error) {
        //         await showErrorAlert('เพิ่มข้อมูลความสัมพันธ์', 'ไม่สำเร็จ');
        //     } finally {
        //         this.loadingCreate = false;
        //         this.closeCreateModal();
        //     }
        // },
        // async confirmRemove(item) {
        //     this.loadingRemove = true;
        //     const active = this.statusActive == true ? '0' : '1';

        //     try {
        //         const response = await axios.put(`http://localhost:3000/manage_relation/active/${item}`, 
        //             {id: active}
        //         );
        //         await showSuccessAlert('เปลี่ยนข้อมูลความสัมพันธ์', response.data.message);
        //         if (response.data.success) {
        //             this.relationFiles = [];
        //             this.relationFiles = await fetchRelationActive(active)
        //         }
        //     } catch (error) {
        //         await showErrorAlert('เปลี่ยนข้อมูลความสัมพันธ์', response.data.message);
        //     } finally {
        //         this.loadingRemove = false;
        //         this.closeConfirmModal(); // Close the modal after deletion
        //     }
        // },
        async saveEdit() {
            this.loadingEdit = true;
            console.log('edit-v:', this.updateLandUsage.label)
            console.log('edit-v:', this.updateLandUsage.value)
            const active = this.statusActive == true ? '0' : '1';
            try {
                const response = await axios.put(`http://localhost:3000/manage_land_usages_info/${this.updateLandUsage.value}`, {
                    label: this.updateLandUsage.label
                });
                await showSuccessAlert('การใช้ประโยชน์ที่ดิน', response.data.message);
                this.relationFiles = []
                if (response.data.success) {
                    if (this.statusActive) {
                        this.relationFiles = await fetchLandUsageActive('1')
                    } else {
                        this.relationFiles = await fetchLandUsageActive('0')
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
        },
        prepareRemove(item) {
            this.deleteItem = item;
            this.isConfirmModalOpen = true; // Show confirmation modal
        },
        async openEditModal(item) {
            console.log('itemhi:', item)
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
            this.relationFiles = await fetchLandUsageActive('1');
        } catch (error) {

        }
    }
}
</script>

<style scoped>

.table-header {
    background-color: #0D1B2A;
}

.btn-active-using{
    min-width: 100px;
}
</style>