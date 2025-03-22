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
          <UploadList :titleFile="'ไฟล์ที่อัปโหลดภาพที่อยู่อาศัย'" :iconImage="'fas fa-image'" :files="files"
            :userRole="userRole" :roles="roles" @show-image="showImage" @open-delete-modal="openDeleteModal"
            @download-link="downloadLink" />
        </div>
      </div>
    </div>

    <Lightbox :visible="lightboxVisible" :imgs="lightboxImages" :index="lightboxIndex"
      @close-lightbox="closeLightbox" />
  </div>
</template>

<script>
import DOMAIN_NAME from '@/config/domain_setup';
import ConfirmDeleteModal from '@/components/upload_files/ConfirmDeleteModal.vue';
import FileDropArea from '@/components/upload_files/FileDropArea.vue';
import UploadList from '@/components/upload_files/UploadList.vue';
import Lightbox from '@/components/upload_files/Lightbox.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
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
        const response = await axios.get(`${DOMAIN_NAME}/upload_file/live_files?land_id=${land_id}`, {
          withCredentials: true
        });
        if (response.status === 200) {
          // ปรับโครงสร้างข้อมูลให้สอดคล้องกับ uploadFile
          this.files = response.data.map(file => ({
            id_live_doc: file.id_live_doc,
            path_file: file.path_file,
            isUploading: false, // ไม่ใช่สถานะ "กำลังอัปโหลด"
            isFailed: false, // เพิ่มสถานะการอัปโหลดไม่สำเร็จ
          }));
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
        if (file.size > 65536) {
          alert(`ไฟล์ ${file.name} มีขนาดเกิน 65 KB!`);
          continue;
        }
        if (file.type === "image/jpeg" || file.type === "image/png") {
          const validFileNameRegex = /^[a-zA-Zก-๙\s0-9._-]+$/;
          const fileExtension = file.name.split('.').pop().toLowerCase();
          if (!validFileNameRegex.test(file.name)) {
            alert(`ไฟล์ ${file.name} มีอักขระที่ไม่รองรับ! กรุณาใช้เฉพาะภาษาไทยและอังกฤษเท่านั้น.`);
            continue;
          }
          if (fileExtension === "js") {
            alert(`ไม่สามารถอัปโหลดไฟล์ .js ได้!`);
            continue;
          }
          const maxLength = 30;
          let fileName = file.name;
          if (fileName.length > maxLength) {
            fileName = fileName.substring(0, maxLength);
            fileName = `${fileName}.${fileExtension}`;
          }
          this.uploadFile(file, fileName);
        } else {
          alert("อนุญาตให้อัปโหลดเฉพาะไฟล์ JPG หรือ PNG เท่านั้น!");
        }
      }
    },
    async uploadFile(file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("landID", this.LAND_ID);

      const newFile = {
        id_live_doc: null, // ยังไม่มี ID จนกว่าอัปโหลดสำเร็จ
        path_file: file.name, // แสดงชื่อไฟล์ชั่วคราว
        isUploading: true, // กำลังอัปโหลด
        isFailed: false, // เพิ่มสถานะการอัปโหลดไม่สำเร็จ
      };
      this.files.unshift(newFile); // เพิ่มไฟล์ใหม่ลงใน array ที่ตำแหน่งแรก
      // console.log('position:', this.files[0].isFailed)
      try {
        // ตัวอย่างการส่งไฟล์ไปยังเซิร์ฟเวอร์
        const response = await axios.post(`${DOMAIN_NAME}/upload_file/land/live`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true
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
    // 90213121
    downloadLink(filePath) {
      const downloadUrl = `${DOMAIN_NAME}/upload_file/download_live/${filePath}`;
      window.open(downloadUrl, '_blank');
    },
    openDeleteModal(file) {
      this.fileToDelete = file;
      console.log('f:', this.fileToDelete )
      this.showModal = true;
    },
    // remove
    async confirmDelete(file_id) {
      this.isDeleting = true;
      // console.log('files:', file_id)
      try {
        const response = await axios.delete(`${DOMAIN_NAME}/upload_file/land/live/${file_id}`,{
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
    }
    ,
    showImage(filePath, index) {
      this.lightboxIndex = index;
      this.lightboxImages = this.files.map(file => `${DOMAIN_NAME}/uploads/land_lives/${file.path_file}`);
      this.lightboxVisible = true;
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