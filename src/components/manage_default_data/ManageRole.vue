<template>
    <div class="py-5 is-flex is-justify-content-center primary_content">
        <div class="column is-three-quarters-tablet is-four-fifths-desktop is-four-fifths-mobile">
            <div class="card">
                <div class="card-content">
                    <h1 class="is-size-3 has-text-centered has-text-link">จัดการสิทธิ์ผู้ใช้</h1>
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
                                    <p class="modal-card-title">แก้ไขสิทธิ์ผู้ใช้</p>
                                    <button class="delete" aria-label="close" @click="closeEditModal"></button>
                                </header>
                                <section class="modal-card-body">
                                    <div class="field">
                                        <label class="label">ชื่อสิทธิ์ผู้ใช้</label>
                                        <div class="control">
                                            <input class="input" type="text" v-model="newRole.label" required />
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
                                    <p class="is-size-5">{{statusActive ? 'ปิดการใช้งานบทบาทนี้?': 'เปิดการใช้งานบทบาทนี้?'}}</p>
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
                                    <p class="modal-card-title">เพิ่มสิทธิ์ผู้ใช้</p>
                                    <button class="delete" aria-label="close" @click="closeCreateModal"></button>
                                </header>
                                <section class="modal-card-body">
                                    <div class="field">
                                        <label class="label">ชื่อสิทธิ์ผู้ใช้</label>
                                        <div class="control">
                                            <input class="input" type="text" v-model="newRoleName" />
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
                                    <th class="has-text-centered has-text-white" style="width: 25%;">ลำดับ</th>
                                    <!-- <th class="has-text-centered has-text-white" style="width: 15%;">รหัส</th> -->
                                    <th class="has-text-centered has-text-white" style="width: 50%;">ชื่อสิทธิ์ผู้ใช้
                                    </th>
                                    <th class="has-text-centered has-text-white" style="width: 25%;"></th>
                                </tr>
                            </thead>
                            <tbody v-if="!page_loading">
                                <tr v-if="statusActive == true" v-for="(item, index) in roleFiles" :key="item.value"
                                    class="has-text-centered">
                                    <td>{{ index + 1 }}</td>
                                    <!-- <td>{{ item.value }}</td> -->
                                    <td>{{ item.label }}</td>
                                    <td>
                                        <button class="button is-rounded is-normal is-warning"
                                            @click="openEditModal(item.value)">
                                            <span class="icon">
                                                <i class="fas fa-edit"></i>
                                            </span>
                                        </button>
                                        <button class="button mx-2 is-rounded is-normal is-danger"
                                            @click="prepareRemove(item.value)">
                                            <span class="icon">
                                                <i class="fas fa-trash"></i>
                                            </span>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="statusActive == false" v-for="(item, index) in roleFiles" :key="item.value"
                                    class="has-text-centered">
                                    <td>{{ index + 1 }}</td>
                                    <!-- <td>{{ item.value }}</td> -->
                                    <td>{{ item.label }}</td>
                                    <td>
                                        <button class="button is-rounded is-normal is-warning"
                                            @click="openEditModal(item.value)">
                                            <span class="icon">
                                                <i class="fas fa-edit"></i>
                                            </span>
                                        </button>
                                        <button class="button mx-2 is-rounded is-normal is-link"
                                            @click="prepareRemove(item.value)">
                                            <span class="icon">
                                                <i class="fas fa-check-circle"></i>
                                            </span>
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="roleFiles.length === 0">
                                    <td colspan="5" class="has-text-centered has-text-danger title is-4">
                                        ไม่มีรายการข้อมูล</td>
                                </tr>
                            </tbody>
                            <div class="p-5" v-else>
                                <LoadingSpinner :isLoading="page_loading" fontSize="22px" />
                            </div>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { fetchUserRoleActive, getOneUserRole } from '@/api/apiUser';
import axios from 'axios';
import { showErrorAlert, showSuccessAlert, showWarningAlert } from '@/utils/alertFunc';
import LoadingSpinner from '../LoadingSpinner.vue';

export default {
    components: {
        LoadingSpinner
    },
    data() {
        return {
            statusActive: true, // 1 false = 0
            roleFiles: [],
            isEditModalOpen: false,
            isConfirmModalOpen: false,
            isCreateModalOpen: false,
            editData: { value: null, label: '' },
            newRole: { value: null, label: '' }, // for update
            loadingCreate: false,
            loadingEdit: false,
            loadingRemove: false,
            newRoleName: '',
            deleteItem: null,
            page_loading: true
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
                const ko = await fetchUserRoleActive(active);
                this.roleFiles = [...ko]
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
        // create new
        async saveNewStatus() {
            console.log('save status')
            const active = this.statusActive ? '1' : '0';

            const createData = {
                label: this.newRoleName
            }

            // valid
            if (this.newRoleName.length == '' || this.newRoleName == null) {
                await showWarningAlert('⚠️ การเพิ่มข้อมูลสิทธิ์ผู้ใช้', 'กรุณากรอกชื่อสิทธิ์ผู้ใช้!');
                return
            }

            // Close the modal after saving
            this.loadingCreate = true;
            try {
                const response = await axios.post('http://localhost:3000/admin/role/create', createData);
                console.log('Response:', response.data);
                if (response.data.success == true) {
                    this.roleFiles = [];
                    await showSuccessAlert('การเพิ่มข้อมูลสิทธิ์ผู้ใช้', response.data.message);
                    if (this.statusActive) {
                        this.roleFiles = await fetchUserRoleActive(active)
                    } else {
                        this.roleFiles = await fetchUserRoleActive(active)
                    }
                    this.activePage(false)
                } else {
                    throw response.data
                }
            } catch (error) {
                if (error.statusCode == 400) {
                    await showErrorAlert('การเพิ่มข้อมูลสิทธิ์ผู้ใช้', error.message);
                    return
                }
                await showErrorAlert('การเพิ่มข้อมูลสิทธิ์ผู้ใช้', 'ไม่สำเร็จ');
            } finally {
                this.loadingCreate = false;
                this.newRoleName = '';
                this.closeCreateModal();
            }
        },
        // Remove 
        async confirmRemove(item) {
            console.log("Removing item:", item);
            this.loadingRemove = true;
            const active = this.statusActive == true ? '0' : '1';

            try {
                const response = await axios.put(`http://localhost:3000/admin/role/del/${item}`, {
                    id: active
                });
                console.log('Response:', response.data);
                this.roleFiles = [];
                console.log('res:', response.data)
                if (response.data.success == true) {
                    this.roleFiles = [];
                    await showSuccessAlert('การลบข้อมูลสิทธิ์ผู้ใช้', response.data.message);
                    if (this.statusActive) {
                        this.roleFiles = await fetchUserRoleActive(active)
                        this.activePage(false)
                    } else {
                        this.roleFiles = await fetchUserRoleActive(active)
                        this.activePage(true)
                    }
                } else {
                    throw response.data
                }
            } catch (error) {
                console.log('error:', error)
                if (error.statusCode == 400) {
                    await showErrorAlert('การลบข้อมูลสิทธิ์ผู้ใช้', error.message);
                    return
                }
                await showErrorAlert('การลบข้อมูลสิทธิ์ผู้ใช้', 'ไม่สำเร็จ');
            } finally {
                this.loadingRemove = false;
                this.closeConfirmModal(); // Close the modal after deletion
            }
        },
        // Edit 
        async saveEdit() {
            // console.log('edit com:', this.editData)
            // console.log('edit-v:', this.newRole.value)
            const active = this.statusActive == true ? '0' : '1';

            // newRole.label
            if (this.newRole.label.length == '' || this.newRole.label == null) {
                await showWarningAlert('⚠️ การอัพเดทข้อมูลสิทธิ์ผู้ใช้', 'กรุณากรอกชื่อสิทธิ์ผู้ใช้');
                return
            }
            this.loadingEdit = true;

            try {
                const response = await axios.put(`http://localhost:3000/admin/role/${this.newRole.value}`, {
                    role_name: this.newRole.label
                });
                console.log('res:', response.data)
                if (response.data.success == true) {
                    this.roleFiles = [];
                    await showSuccessAlert('การอัพเดทข้อมูลสิทธิ์ผู้ใช้', response.data.message);
                    if (this.statusActive) {
                        this.roleFiles = await fetchUserRoleActive('1')
                    } else {
                        this.roleFiles = await fetchUserRoleActive('0')
                    }
                } else {
                    throw response.data
                }
            } catch (error) {
                console.log('error:', error)
                if (error.statusCode == 400) {
                    await showErrorAlert('การอัพเดทข้อมูลสิทธิ์ผู้ใช้', error.message);
                    return
                }
                await showErrorAlert('การอัพเดทข้อมูลสิทธิ์ผู้ใช้', 'ไม่สำเร็จ');
            } finally {
                this.newRole = { value: null, label: '' };
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
        },
        prepareRemove(item) {
            this.deleteItem = item;
            this.isConfirmModalOpen = true; // Show confirmation modal
        },
        async openEditModal(item) {
            console.log('item:', item)
            try {
                const response = await getOneUserRole(item);
                // throw new Error('')
                if (response.data.data) {
                    const data_role = response.data.data
                    console.log('res:', response.data);
                    this.newRole = {
                        value: data_role.role_id,
                        label: data_role.role_name
                    };
                    this.editData = {
                        value: data_role.role_id,
                        label: data_role.role_name
                    }
                }
            } catch (error) {
                showErrorAlert("ไม่สามารถเรียกข้อมูลได้")
            } finally {
                this.isEditModalOpen = false;
            }
            this.isEditModalOpen = true;
        },
        closeEditModal() {
            this.isEditModalOpen = false;
            this.newRole = { value: null, label: '' };
            this.editData = { value: null, label: '' }
        },
        closeConfirmModal() {
            this.isConfirmModalOpen = false; // Close confirmation modal
            this.deleteItem = null; // Reset the item to null
        },
    },
    async mounted() {
        try {
            this.roleFiles = await fetchUserRoleActive('1');
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
    background-color: #002366;
}

.btn-active-using {
    min-width: 100px;
    margin-right: 5px;
}

.button {
    border-radius: 5px;
}
</style>