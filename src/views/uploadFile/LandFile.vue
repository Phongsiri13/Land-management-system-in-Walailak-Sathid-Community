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
          <UploadList :titleFile="'ไฟล์ที่อัปโหลดเอกสารที่ดิน'" :iconImage="'fas fa-file-pdf'" :files="files"
            :userRole="userRole" :roles="roles" @show-image="showImage" @open-delete-modal="openDeleteModal"
            @download-link="downloadLink" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      LAND_ID: '',
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
      this.LAND_ID = landId;
      await this.getLandFiles(this.LAND_ID);
    } catch (error) {
      console.error(error);
    } finally {
      this.exitFileLoading = true;
    }
  },
  methods: {
    async getLandFiles(land_id) {
      try {
        const response = await axios.get(`http://localhost:3000/upload_file/document_files?land_id=${land_id}`);
        if (response.status === 200) {
          // ปรับโครงสร้างข้อมูลให้สอดคล้องกับ uploadFile
          this.files = response.data.map(file => ({
            id_live_doc: file.id_doc,
            path_file: file.l_path_file,
            isUploading: false, // ไม่ใช่สถานะ "กำลังอัปโหลด"
            isFailed: false, // เพิ่มสถานะการอัปโหลดไม่สำเร็จ
          }));

          console.log("this.files:", this.files)
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
          "application/pdf",
          "application/vnd.ms-excel", // .xls (Excel 97-2003)
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // .xlsx
        ];

        if (!allowedTypes.includes(file.type)) {
          alert("อนุญาตให้อัปโหลดเฉพาะไฟล์ PDF และ Excel (.xls, .xlsx) เท่านั้น!");
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
      formData.append("landID", this.LAND_ID);

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
        const response = await axios.post("http://localhost:3000/upload_file/land/documents", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // ตรวจสอบ status code
        if (response.status === 200 || response.status === 201) {
          setTimeout(async () => {
            await this.getLandFiles(this.LAND_ID); // เรียกข้อมูลไฟล์ใหม่
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
      const downloadUrl = `http://localhost:3000/upload_file/download_document/${filePath}`;
      window.open(downloadUrl, '_blank');
    },
    openDeleteModal(file) {
      this.fileToDelete = file;
      this.showModal = true;
    },
    confirmDelete() {
      this.isDeleting = true;
      setTimeout(() => {
        this.files = this.files.filter(f => f.id !== this.fileToDelete.id);
        this.showModal = false;
        this.fileToDelete = null;
        this.isDeleting = false;
      }, 2000);
    },
    showImage(filePath, index) {
      this.lightboxIndex = index;
      this.lightboxVisible = true;
      const pdfUrl = `http://localhost:3000/uploads/documents/${filePath}`;
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
</style>