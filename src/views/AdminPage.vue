<template>
  <div class="primary_content">
    <div class="py-5 is-flex is-justify-content-center">
      <div class="column is-three-quarters-tablet is-10-desktop is-full-mobile">
        <div class="card">
          <div class="card-content">
            <h1 class="is-size-3 has-text-centered has-text-link ">ผู้ใช้งานในระบบ</h1>
            <div>
              <!-- เพิ่มบัญชี -->
              <div class="section-header">
                <button class="button is-success mb-3 p-2" style="width: 50px;" @click="openAddAdminModal">
                  <span class="icon">
                    <i class="fas fa-plus"></i>
                  </span>
                </button>
              </div>

              <div class="table-container">
                <table>
                  <thead>
                    <tr>
                      <sortable-table-header tag="th" header-text="ลำดับ" sort-key="id" :current-sort-column="sortColumn"
                        :current-sort-order="sortOrder" @sort-changed="handleSortChange" />
                      <sortable-table-header tag="th" header-text="บัญชี" sort-key="username"
                        :current-sort-column="sortColumn" :current-sort-order="sortOrder"
                        @sort-changed="handleSortChange" />
                      <sortable-table-header tag="th" header-text="ชื่อ - นามสกุล" sort-key="fullname"
                        :current-sort-column="sortColumn" :current-sort-order="sortOrder"
                        @sort-changed="handleSortChange" />
                      <sortable-table-header tag="th" header-text="เบอร์โทรศัพท์" sort-key="PhoneNumber"
                        :current-sort-column="sortColumn" :current-sort-order="sortOrder"
                        @sort-changed="handleSortChange" />
                      <sortable-table-header tag="th" header-text="บทบาท" sort-key="PhoneNumber"
                        :current-sort-column="sortColumn" :current-sort-order="sortOrder"
                        @sort-changed="handleSortChange" />
                      <sortable-table-header tag="th" header-text="การใช้งาน" sort-key="status"
                        :current-sort-column="sortColumn" :current-sort-order="sortOrder"
                        @sort-changed="handleSortChange" />

                      <sortable-table-header tag="th" header-text="" sort-key="status" :current-sort-column="sortColumn"
                        :current-sort-order="sortOrder" @sort-changed="handleSortChange" />

                    </tr>
                  </thead>
                  <tbody v-if="!table_loading">
                    <!-- data -->
                    <tr v-for="admin in paginatedAdminList" :key="admin.id">
                      <td>{{ admin.id }}</td>
                      <td>{{ admin.username }}</td>
                      <td>
                        {{ admin.prefix_name ? admin.prefix_name + ' ' : '-' }}
                        {{ admin.first_name ? admin.first_name + ' ' : '-' }}
                        {{ admin.last_name || '-' }}
                      </td>
                      <td>{{ formatPhone(admin.phone_number) || "---" }}</td>
                      <td>{{ admin.role_name }}</td>
                      <td>
                        <span class="icon" v-if="admin.user_actived === '1'">
                          <i class="fas fa-circle has-text-success"></i>
                        </span>
                        <span class="icon" v-else>
                          <i class="fas fa-circle has-text-danger"></i>
                        </span>
                      </td>
                      <td>
                        <button class="button is-rounded is-normal is-warning mx-1" @click="handleEditAdmin(admin)">
                          <span class="icon">
                            <i class="fas fa-edit"></i>
                          </span>
                        </button>
                        <button v-if="admin.user_actived === '1'" class="button is-rounded is-normal is-danger"
                          @click="handleDeleteAdmin(admin)">
                          <span class="icon">
                            <i class="fas fa-trash"></i>
                          </span>
                        </button>
                        <button v-else class="button is-rounded is-normal is-link" @click="handleDeleteAdmin(admin)">
                          <span class="icon">
                            <i class="fas fa-check-circle"></i>
                          </span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                  <div class="p-5" v-else>
                    <LoadingSpinner :isLoading="table_loading" fontSize="22px" />
                  </div>
                </table>
              </div>

              <PaginationControls :current-page="currentPage" :total-pages="totalPages"
                @page-change="handlePageChange" />
            </div>
            <!-- แก้ไข / เพิ่ม -->
            <AdminProfileModal v-if="isModalVisible" :isVisible="isModalVisible" :mode="modalMode"
              :adminData="selectedAdmin" :prefixListData="prefixList" :roleListData="roleFiles" @close="closeAdminModal"
              @submit="handleAdminSubmit" />

            <!-- ลบ -->
            <ConfirmationDialog v-if="isConfirmationDialogVisible" :isVisible="isConfirmationDialogVisible"
              :title="adminIdToDelete.user_actived === '1' ? 'ต้องการปิดใช้งานบัญชีนี้?' : 'ต้องการเปิดใช้งานบัญชีอีกครั้ง?'"
              :message="adminIdToDelete.user_actived === '1' ? 'บัญชีนี้จะไม่สามารถเข้าสู่ระบบได้' : 'บัญชีนี้สามารถกลับมาใช้งานได้อีกครั้ง'"
              @confirm="confirmDeleteAdmin" @cancel="cancelDeleteAdmin" />

            <!-- แจ้งเตือน -->
            <NotificationMessage v-if="notification.isVisible" :isVisible="notification.isVisible"
              :message="notification.message" :type="notification.type" @close="closeNotification" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="footer">
    <p>© 2025</p>
  </div>
</template>

<script>
import DOMAIN_NAME from '@/config/domain_setup';
import { getAllUsers } from '@/api/apiUser';
import { formatPhoneNumber } from '@/utils/commonFunc';
import axios from 'axios';
import { fetchUserRoleActive } from '@/api/apiUser';

import PaginationControls from '@/components/admin_cpn/PaginationControls.vue';
import SortableTableHeader from '@/components/admin_cpn/SortableTableHeader.vue';
import AdminProfileModal from '@/components/admin_cpn/AdminProfileModal.vue';
import ConfirmationDialog from '@/components/admin_cpn/ConfirmationDialog.vue';
import NotificationMessage from '@/components/admin_cpn/NotificationMessage.vue';

import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
  name: 'AdminPage',
  components: {
    LoadingSpinner,
    PaginationControls,
    SortableTableHeader,
    AdminProfileModal,
    ConfirmationDialog,
    NotificationMessage,
  },
  data() {
    return {
      adminList: [], // เริ่มต้นเป็น array ว่าง
      prefixList: [], // เริ่มต้นเป็น array ว่าง
      roleFiles: [], // เริ่มต้นเป็น array ว่าง
      searchQuery: '',
      perPage: 5,
      currentPage: 1,
      sortColumn: 'id',
      sortOrder: 'asc',
      isModalVisible: false,
      modalMode: 'add',
      selectedAdmin: {},
      isConfirmationDialogVisible: false,
      adminIdToDelete: null,
      notification: {
        isVisible: false,
        message: '',
        type: 'info',
      },
      table_loading: true
    };
  },
  computed: {
    filteredAdminList() {
      const query = this.searchQuery.toLowerCase();
      return this.adminList.filter(admin =>
        admin.username.toLowerCase().includes(query) ||
        admin.email.toLowerCase().includes(query) ||
        admin.status.toLowerCase().includes(query)
      );
    },
    totalPages() {
      return Math.ceil(this.filteredAdminList.length / this.perPage);
    },
    paginatedAdminList() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      return this.filteredAdminList.slice(startIndex, startIndex + this.perPage);
    }
  },
  methods: {
    formatPhone(phone_number) {
      return formatPhoneNumber(phone_number);
    },
    handlePageChange(newPage) {
      this.currentPage = newPage;
    },
    handleSortChange(sortInfo) {
      this.sortColumn = sortInfo.column;
      this.sortOrder = sortInfo.order;
    },
    showNotification(message, type = 'info') {
      this.notification = { isVisible: true, message, type };
      setTimeout(() => this.closeNotification(), 3000); // ปิดการแจ้งเตือนหลังจาก 3 วินาที
    },
    closeNotification() {
      this.notification.isVisible = false;
    },
    openAddAdminModal() {
      this.modalMode = 'add';
      this.selectedAdmin = {};
      this.isModalVisible = true;
    },
    openEditAdminModal(admin) {
      this.modalMode = 'edit';
      this.selectedAdmin = { ...admin };
      this.isModalVisible = true;
    },
    closeAdminModal() {
      this.isModalVisible = false;
      this.selectedAdmin = {};
    },
    async handleAdminSubmit(formData, userID = '') {
      if (this.modalMode === 'add') {
        console.log('adding:', formData)
        try {
          const { confirm_password, ...updateData } = formData;
          // console.log('adding-update:', updateData)

          const user_update = await axios.post(`${DOMAIN_NAME}/register`, updateData);

          console.log('user_uer:', user_update)
          this.table_loading = true;
          if (user_update.status == 201) {
            this.showNotification('การเพิ่มบัญชีผู้ใช้งานท่านนี้สำเร็จ!', 'success');
            const rolesResponse = await fetchUserRoleActive('1');
            this.roleFiles = [] // set users to empty
            if (rolesResponse.length > 0) {
              this.roleFiles = rolesResponse.map(role => ({
                value: role.value,
                label: role.label,
              }));
            }
            this.adminList = []
            this.adminList = await getAllUsers();
          } else {
            throw user_update.data
          }
          this.showNotification('การเพิ่มบัญชีผู้ใช้งานท่านนี้สำเร็จ!', 'success');
        } catch (error) {
          console.log('err:', error);
          if (error.response.data.statusCode == 409) {
            this.showNotification('มีบัญชีนี้อยู่แล้ว กรุณาระบุบัญชีใหม่!', 'error');
            return
          }
          this.showNotification('การเพิ่มบัญชีผู้ใช้งานท่านนี้ไม่สำเร็จ!', 'error');
        } finally {
          setTimeout(() => {
            this.table_loading = false;
          }, 500);
        }
      } else {
        // แก้ไขข้อมูลเดิม
        try {
          const { user_id, username, ...updateData } = formData;

          const user_update = await axios.put(`${DOMAIN_NAME}/admin/user/personal/${userID}`, formData);

          console.log('user_uer:', user_update)
          if (user_update.data.success == true) {
            this.table_loading = true;
            this.showNotification('อัพเดทบัญชีผู้ใช้งานท่านนี้สำเร็จ!', 'success');
            const rolesResponse = await fetchUserRoleActive('1');
            this.roleFiles = [] // set users to empty
            if (rolesResponse.length > 0) {
              this.roleFiles = rolesResponse.map(role => ({
                value: role.value,
                label: role.label,
              }));
            }
            this.adminList = []
            this.adminList = await getAllUsers();
          } else {
            throw user_update.data
          }
        } catch (error) {
          this.showNotification('อัพเดทบัญชีผู้ใช้งานท่านนี้ไม่สำเร็จ!', 'error');
        } finally {
          setTimeout(() => {
            this.table_loading = false;
          }, 500);
        }
      }
      this.closeAdminModal();
    },
    handleEditAdmin(admin) {
      this.openEditAdminModal(admin);
    },
    handleDeleteAdmin(adminId) {
      this.adminIdToDelete = adminId;
      this.isConfirmationDialogVisible = true;
    },
    async confirmDeleteAdmin() {
      console.log("::", this.adminIdToDelete)
      try {
        const { user_id, username, user_actived } = this.adminIdToDelete;
        this.table_loading = true;
        const user_del = await axios.put(`${DOMAIN_NAME}/admin/user/del/${user_id}`, {
          username: username,
          user_actived: user_actived == '1' ? '0' : '1'
        });

        console.log('status:', user_del)
        this.adminList = []
        this.adminList = await getAllUsers();


        this.showNotification('การลบบัญชีผู้ใช้งานท่านนี้สำเร็จ!', 'success');
      } catch (error) {
        this.showNotification('การลบบัญชีผู้ใช้งานท่านนี้ไม่สำเร็จ!', 'error');
      } finally {
        this.isConfirmationDialogVisible = false;
        this.adminIdToDelete = null;
        setTimeout(() => {
          this.table_loading = false;
        }, 500);
      }
    },
    cancelDeleteAdmin() {
      this.isConfirmationDialogVisible = false;
      this.adminIdToDelete = null;
    },
  },
  async mounted() {
    try {
      // ดึงข้อมูลผู้ใช้งาน
      this.adminList = await getAllUsers();

      console.log('user-data:', this.adminList)

      // ดึงข้อมูลคำนำหน้า
      const prefixResponse = await axios.get(`http://localhost:3000/citizen/prefix`);
      if (prefixResponse.data.length > 0) {
        this.prefixList = prefixResponse.data.map(prefix => ({
          value: prefix.prefix_id,
          label: prefix.prefix_name,
        }));
      }

      // ดึงข้อมูลบทบาท
      const rolesResponse = await fetchUserRoleActive('1');
      if (rolesResponse.length > 0) {
        this.roleFiles = rolesResponse.map(role => ({
          value: role.value,
          label: role.label,
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      this.showNotification('เกิดข้อผิดพลาดในการดึงข้อมูล', 'error');
    } finally {
      setTimeout(() => {
        this.table_loading = false;
      }, 1000);
    }
  }
};
</script>

<style scoped>
.button {
  border-radius: 5px;
}

.section-header {
  display: flex;
  justify-content: end;
}


.search-container {
  margin-bottom: 20px;
}

.search-container input {
  width: 500px;
  padding: 10px;
  border-radius: 5px;
  /* border: 1px solid #ccc; */
  color: #333;
}

.table-container {
  overflow-x: auto;
  color: #333;
}

table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  border: 1px solid #ddd;
}

thead {
  background-color: #f8f9fa;
  color: #333;
  border-bottom: 2px solid #ddd;
}

th,
td {
  padding: 12px 15px;
  text-align: left;
}

th {
  font-weight: bold;
  background-color: #9e0b0b;
  color: #fff;
}

.sortable-header:hover {
  background-color: #430707;
  cursor: pointer;
}

tbody tr:nth-child(even) {
  background-color: #ffffff;
}

.footer {
  text-align: center;
  padding: 10px;
  color: #777;
  border-top: 1px solid #eee;
}

/* Optional: สไตล์สถานะให้ชัดเจนขึ้น */
.srowcolor.active {
  color: #28a745;
  /* สีเขียวสำหรับ "ใช้งาน" */
}

.srowcolor.inactive {
  color: #dc3545;
  /* สีแดงสำหรับ "ไม่ใช้งาน" */
}
</style>