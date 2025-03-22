<template>
  <div class="container">
    <ConfirmDeleteModal :showModal="showModal" :fileToDelete="fileToDelete" :isDeleting="isDeleting"
      @close-modal="showModal = false" @confirm-delete="confirmDelete" />

    <div class="box">
      <div class="columns is-multiline is-mobile">
        <div class="column is-two-fifths-tablet is-full-mobile is-two-fifths-desktop">
          <FileDropArea :isFileInputDisabled="isFileInputDisabled" @file-selected="handleFileSelect"
            @file-dropped="handleDrop" />
        </div>
        <div v-if="!exitFileLoading">
          <LoadingSpinner :isLoading="!exitFileLoading" textTitle="กำลังโหลดไฟล์ที่เกี่ยวข้อง..." />
        </div>
        <div v-else class="column is-three-fifths-tablet is-full-mobile is-three-fifths-desktop">
          <UploadList :titleFile="'ไฟล์ที่อัปโหลดเอกสารที่เกี่ยวข้องกับราษฎร'" :iconImage="'fas fa-file-pdf'"
            :files="files" :userRole="userRole" :roles="roles" @show-image="showImage"
            @open-delete-modal="openDeleteModal" @download-link="downloadLink" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DOMAIN_NAME from '@/config/domain_setup';
import ConfirmDeleteModal from '@/components/upload_files/ConfirmDeleteModal.vue';
import FileDropArea from '@/components/upload_files/FileDropArea.vue';
import UploadList from '@/components/upload_files/UploadList.vue';
import Lightbox from '@/components/upload_files/Lightbox.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { showSuccessAlert, showErrorAlert } from '@/utils/alertFunc';
import axios from 'axios';
import { useUserStore } from '@/stores/useUserStore';
import roles from '@/role_config';

export default {
  components: {
    ConfirmDeleteModal,
    FileDropArea,
    UploadList,
    Lightbox,
    LoadingSpinner,
  },
  data() {
    return {
      roles,
      files: [],
      pdfUrl: "",
      showModal: false,
      fileToDelete: null,
      isDeleting: false,
      CITIZEN_ID: '',
      lightboxVisible: false,
      lightboxImages: [],
      lightboxIndex: 0,
      exitFileLoading: false,
      maxFileCount: 10
    };
  },
  computed: {
    isFileInputDisabled() {
      return this.files.length >= this.maxFileCount;
    },
    userRole() {
      const userStore = useUserStore();
      return userStore.userRole;
    },
  },
  async created() {
    try {
      const landId = decodeURIComponent(this.$route.params.id);
      this.CITIZEN_ID = landId;
      await this.getLandFiles(this.CITIZEN_ID);
    } catch (error) {
      console.error(error);
    } finally {
      this.exitFileLoading = true;
    }
  },
  methods: {
    async getLandFiles(citizen_id) {
      try {
        const response = await axios.get(`${DOMAIN_NAME}/upload_file/citizen/document_files?citizen_id=${this.CITIZEN_ID}`,{
          withCredentials: true
        });
        if (response.status === 200) {
          // ปรับโครงสร้างข้อมูลให้สอดคล้องกับ uploadFile
          this.files = response.data.map(file => ({
            id_live_doc: file.dc_id,
            path_file: file.path_file,
            isUploading: false, // ไม่ใช่สถานะ "กำลังอัปโหลด"
            isFailed: false, // เพิ่มสถานะการอัปโหลดไม่สำเร็จ
          }));

          // console.log("::", this.files)
        } else {
          console.error("ไม่สามารถดึงข้อมูลไฟล์ได้");
        }
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลไฟล์:", err);
      }
    },
    handleFileSelect(files) {
      this.addFiles(files);
    },
    handleDrop(files) {
      this.addFiles(files);
    },
    addFiles(fileList) {
      if (this.files.length >= 10) {
        alert("ไม่สามารถอัปโหลดไฟล์ได้เกิน 10 ไฟล์!");
        return;
      }

      for (const file of fileList) {
        if (file.size > 5 * 1024 * 1024) { // 5MB
          alert(`ไฟล์ ${file.name} มีขนาดเกิน 5MB!`);
          continue;
        }

        // ตรวจสอบนามสกุลไฟล์ที่รองรับ
        const allowedTypes = [
          "application/pdf"
        ];

        if (!allowedTypes.includes(file.type)) {
          alert("อนุญาตให้อัปโหลดเฉพาะไฟล์ PDF เท่านั้น!");
          continue;
        }

        // ตรวจสอบชื่อไฟล์ (อนุญาตเฉพาะภาษาไทย, อังกฤษ, ตัวเลข, จุด, ขีดกลาง, ขีดล่าง)
        const validFileNameRegex = /^[a-zA-Zก-๙\s0-9._-]+$/;
        if (!validFileNameRegex.test(file.name)) {
          alert(`ไฟล์ ${file.name} มีอักขระที่ไม่รองรับ! กรุณาใช้เฉพาะภาษาไทยและอังกฤษเท่านั้น.`);
          continue;
        }

        // ตัดชื่อไฟล์ให้ไม่เกิน 30 ตัวอักษร
        const fileExtension = file.name.split('.').pop().toLowerCase();
        let fileName = file.name;
        const maxLength = 30;
        if (fileName.length > maxLength) {
          fileName = fileName.substring(0, maxLength - fileExtension.length - 1);
          fileName = `${fileName}.${fileExtension}`;
        }

        this.uploadFile(file, fileName);
      }
    },
    async uploadFile(file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("landID", this.CITIZEN_ID);

      const newFile = {
        id_doc: null, // ยังไม่มี ID จนกว่าอัปโหลดสำเร็จ
        path_file: file.name, // แสดงชื่อไฟล์ชั่วคราว
        isUploading: true, // กำลังอัปโหลด
        isFailed: false, // เพิ่มสถานะการอัปโหลดไม่สำเร็จ
      };
      this.files.unshift(newFile); // เพิ่มไฟล์ใหม่ลงใน array ที่ตำแหน่งแรก
      console.log('position:', this.files[0].isFailed)
      try {
        // ตัวอย่างการส่งไฟล์ไปยังเซิร์ฟเวอร์
        const response = await axios.post(`${DOMAIN_NAME}/upload_file/citizen/documents`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true
        });

        // ตรวจสอบ status code
        if (response.status === 200 || response.status === 201) {
          setTimeout(async () => {
            await this.getLandFiles(this.CITIZEN_ID); // เรียกข้อมูลไฟล์ใหม่
          }, 500);
        } else {
          // หาก status code ไม่ใช่ 200 หรือ 201
          throw new Error('การอัปโหลดไม่สำเร็จ');
        }
      } catch (error) {
        // ตรวจสอบว่าไปที่ catch block
        console.log("จับข้อผิดพลาด:", error.message);
        setTimeout(() => {
          this.files[0].isFailed = true
          this.files[0].isUploading = false
          setTimeout(() => {
            this.files.shift();
          }, 1000);
        }, 500);
      }
    },
    downloadLink(filePath) {
      const downloadUrl = `${DOMAIN_NAME}/upload_file/download_document/${filePath}`;
      window.open(downloadUrl, '_blank');
    },
    openDeleteModal(file) {
      this.fileToDelete = file;
      this.showModal = true;
    },
    async confirmDelete(file_id) {
      this.isDeleting = true;
      // console.log('files:', file_id)
      try {
        const response = await axios.delete(`${DOMAIN_NAME}/upload_file/citizen/${file_id}`, {
          withCredentials: true
        });
        // console.log('res:', response);
        setTimeout(async () => {
          this.isDeleting = false;
          await this.getLandFiles(this.LAND_ID);
        }, 1000);
      } catch (error) {
        console.error("❌ Error deleting land:", error);
      } finally {
        setTimeout(() => {
          this.isDeleting = false;
          this.showModal = false;
        }, 1000);
      }
    },
    showImage(filePath, index) {
      this.lightboxIndex = index;
      this.lightboxVisible = true;
      const pdfUrl = `${DOMAIN_NAME}/uploads/citizen_documents/${filePath}`;
      window.open(pdfUrl, "_blank");
    },
    closeLightbox() {
      this.lightboxVisible = false;
    },
  },
};
</script>

<style scoped>
.container {
  /* max-width: 900px; */
  margin: auto;
  padding: 20px;
}

.box {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.file-drop-area {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  text-align: center;
  width: 100%;
  min-height: 350px;
  border-color: gray;
}

.file-drop-area:hover {
  border-color: #3273dc;
  background: rgba(255, 255, 255, 0.2);
}

.upload-icon {
  font-size: 50px;
  color: #3273dc;
  margin-bottom: 10px;
}

.upload-list {
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
  border-radius: 12px;
}

.upload-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  transition: transform 0.2s ease-in-out;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.upload-item:hover {
  transform: scale(1.02);
  background: rgba(255, 255, 255, 0.2);
}

.file-info {
  flex-grow: 1;
}

.file-name {
  font-weight: bold;
  color: #3273dc;
  text-decoration: none;
  cursor: pointer;
}

.file-name:hover {
  text-decoration: underline;
}

.progress {
  height: 6px;
  border-radius: 5px;
}

.completed-text {
  color: #28a745;
  font-weight: bold;
}

.upload-list::-webkit-scrollbar {
  width: 8px;
}

.upload-list::-webkit-scrollbar-thumb {
  background: rgba(50, 115, 220, 0.7);
  border-radius: 4px;
}

.upload-list::-webkit-scrollbar-thumb:hover {
  background: rgba(50, 115, 220, 1);
}
</style>