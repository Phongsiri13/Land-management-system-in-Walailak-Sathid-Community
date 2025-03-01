<template>
    <div class="container">
      <!-- Confirm Delete Modal -->
      <div class="modal" :class="{ 'is-active': showModal }">
        <div class="modal-background" @click="showModal = false"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">ยืนยันการลบ</p>
            <button class="delete" @click="showModal = false"></button>
          </header>
          <section class="modal-card-body">
            คุณต้องการลบไฟล์ <strong>{{ fileToDelete?.name }}</strong> ใช่หรือไม่?
          </section>
          <footer class="modal-card-foot">
            <button class="button is-danger" :class="{ 'is-loading': isDeleting }" @click="confirmDelete"
              :disabled="isDeleting">
              ลบไฟล์
            </button>
            <button class="button" @click="showModal = false">ยกเลิก</button>
          </footer>
        </div>
      </div>
      <div class="box">
        <div class="columns is-multiline is-mobile">
          <!-- File Drop Area -->
          <div class="column is-two-fifths-tablet is-full-mobile is-two-fifths-desktop">
            <div class="file-drop-area" @click="openFilePicker" @dragover.prevent @drop="handleDrop">
              <div class="upload-icon">
                <i class="fas fa-cloud-upload-alt"></i>
              </div>
              <p>คลิกเพื่ออัปโหลด</p>
              <input type="file" ref="fileInput" @change="handleFileSelect" hidden :disabled="isFileInputDisabled" />
            </div>
          </div>
  
          <!-- Upload List -->
          <div v-if="!exitFileLoading">
            <LoadingSpinner :isLoading="!exitFileLoading" textTitle="กำลังโหลดไฟล์ที่เกี่ยวข้อง" />
          </div>
          <div v-else class="column is-three-fifths-tablet is-full-mobile is-three-fifths-desktop">
            <h3 class="title is-5">📂 ไฟล์ที่อัปโหลดเอกสารที่เกี่ยวข้องกับที่ดิน</h3>
            <div class="upload-list" v-if="files.length > 0">
              <div v-for="(file, index) in files" :key="file.id_live_doc" class="upload-item mb-2">
                <button class="button has-background-primary" style="border-radius: 5px;"
                  @click="showImage(file.path_file, index)">
                  <span class="icon p-3">
                    <i class="fas fa-file-pdf"></i>
                  </span>
                    <!-- <span class="icon p-3">
                        <i class="fas fa-file-csv"></i>
                    </span>
                    <span class="icon p-3">
                        <i class="fas fa-file-excel"></i>
                    </span> -->
                </button>
                <div class="file-info">
                  <!-- แสดงชื่อไฟล์และขนาด -->
                  <p v-if="file.path_file">{{ file.path_file }} <small></small></p>
                  <p v-else>ไม่มีข้อมูลไฟล์</p>
                  <!-- แสดงสถานะการอัปโหลดหากมี -->
                  <progress class="progress is-primary" :value="file.progress || 100" max="100"></progress>
                  <small v-if="file.progress < 100">{{ file.progress }}% - {{ file.speed }}/sec</small>
                  <small v-else class="completed-text">✅ Completed</small>
                </div>
                <!-- ปุ่มลบ -->
                <button class="delete" @click="openDeleteModal(file)"></button>
                <!-- ปุ่มดาวน์โหลด -->
                <button class="button is-link is-inverted" @click="downloadLink(file.path_file)">
                  <i class="fas fa-download"></i>
                </button>
              </div>
            </div>
            <div v-else>
              ยังไม่มีการอัพโหลดไฟล์
            </div>
          </div>
        </div>
      </div>
      <!-- Lightbox แสดงรูป -->
      <div v-if="lightboxVisible" class="lightbox">
        <vue-easy-lightbox :visible="lightboxVisible" :imgs="lightboxImages" :index="lightboxIndex"
          @hide="closeLightbox" />
      </div>
  
    </div>
  </template>
  
  <script>
  import LoadingSpinner from '@/components/LoadingSpinner.vue';
  import { showSuccessAlert, showErrorAlert } from '@/utils/alertFunc';
  import VueEasyLightbox from 'vue-easy-lightbox';
  import axios from 'axios';
  
  export default {
    components: {
      LoadingSpinner,
      VueEasyLightbox
    },
    data() {
      return {
        files: [],
        showModal: false,
        fileToDelete: null,
        selectedImage: null, // รูปที่เลือก
        maxFileCount: 10,
        lightboxImages: [],
        exitFileLoading: false,
        isDeleting: false,
        LAND_ID: '',
        lightboxVisible: false,
        lightboxIndex: 0,
      };
    },
    computed: {
      isFileInputDisabled() {
        return this.files.length >= this.maxFileCount; // ถ้าจำนวนไฟล์ >= 10 จะ disable input
      },
    },
    async created() {
      // read query
      try {
        const landId = decodeURIComponent(this.$route.params.id);
        this.LAND_ID = landId;
        await this.getLandFiles(this.LAND_ID);
      } catch (error) {
  
      } finally {
        this.exitFileLoading = true
      }
    },
    methods: {
      getFilesNow() {
        console.log(this.files)
      },
      async getLandFiles(land_id) {
        try {
          // ส่งคำขอไปยัง API เพื่อดึงข้อมูลไฟล์
          const response = await axios.get(`http://localhost:3000/upload_file/live_files?land_id=${land_id}`);
  
          if (response.status === 200) {
            this.files = response.data;  // ตั้งค่าข้อมูลไฟล์ที่ดึงมาในตัวแปร `files`
            console.log('ไฟล์ที่ดึงมา:', response.data);
          } else {
            console.error("ไม่สามารถดึงข้อมูลไฟล์ได้");
          }
        } catch (err) {
          console.error("เกิดข้อผิดพลาดในการดึงข้อมูลไฟล์:", err);
        } finally {
  
        }
      },
      openFilePicker() {
        this.$refs.fileInput.click();
      },
      handleFileSelect(event) {
        this.addFiles(event.target.files);
      },
      handleDrop(event) {
        this.addFiles(event.dataTransfer.files);
      },
      addFiles(fileList) {
        if (this.files.length >= 10) {
          alert("ไม่สามารถอัปโหลดไฟล์ได้เกิน 10 ไฟล์!");
          return; // หยุดการทำงานของฟังก์ชันถ้าจำนวนไฟล์มากกว่า 10
        }
        for (const file of fileList) {
          if (file.size > 65536) {
            alert(`ไฟล์ ${file.name} มีขนาดเกิน 65 KB!`);
            continue;
          }
  
          // ตรวจสอบชนิดไฟล์ที่อนุญาต (JPG หรือ PNG)
          if (file.type === "image/jpeg" || file.type === "image/png") {
  
            // ตรวจสอบให้ชื่อไฟล์รองรับเฉพาะภาษาไทยและอังกฤษ และไม่เป็น .js
            const validFileNameRegex = /^[a-zA-Zก-๙\s0-9._-]+$/;
            const fileExtension = file.name.split('.').pop().toLowerCase(); // เก็บนามสกุลไฟล์และแปลงเป็นตัวพิมพ์เล็ก
            if (!validFileNameRegex.test(file.name)) {
              alert(`ไฟล์ ${file.name} มีอักขระที่ไม่รองรับ! กรุณาใช้เฉพาะภาษาไทยและอังกฤษเท่านั้น.`);
              continue;
            }
  
            if (fileExtension === "js") {
              alert(`ไม่สามารถอัปโหลดไฟล์ .js ได้!`);
              continue;
            }
  
            // ตรวจสอบชื่อไฟล์ให้ยาวไม่เกิน 30 ตัวอักษร
            const maxLength = 30;
            let fileName = file.name;
  
            if (fileName.length > maxLength) {
              fileName = fileName.substring(0, maxLength); // ตัดชื่อไฟล์ให้สั้นลง
              fileName = `${fileName}.${fileExtension}`; // เพิ่มนามสกุลไฟล์ใหม่
            }
  
            // ส่งไฟล์พร้อมชื่อที่ถูกตัด
            this.uploadFile(file, fileName);
          } else {
            alert("อนุญาตให้อัปโหลดเฉพาะไฟล์ JPG หรือ PNG เท่านั้น!");
          }
        }
      },
      async uploadFile(file) {
        const formData = new FormData();
        formData.append("file", file);  // ไฟล์ที่ต้องการอัปโหลด
        formData.append("landID", this.LAND_ID);  // เพิ่ม landID ลงไปใน FormData
  
        try {
          const response = await axios.post("http://localhost:3000/upload_file/land/live", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          await showSuccessAlert('อัปโหลดสำเร็จ', response.data.message)
          console.log("อัปโหลดสำเร็จ:", response.data);
          this.exitFileLoading = false
          this.files = []
          await this.getLandFiles(this.LAND_ID);
          this.exitFileLoading = true
        } catch (error) {
          await showErrorAlert('การอัปโหลดไม่สำเร็จ', error.message)
          console.error("เกิดข้อผิดพลาดในการอัปโหลด:", error);
        }
      },
      downloadLink(file) {
        // return `https://example.com/download/${file.id}`;
        const filePath = file; // ชื่อไฟล์ที่ต้องการดาวน์โหลด
        console.log('file:',filePath)
        const downloadUrl = `http://localhost:3000/upload_file/download_live/${filePath}`;
  
        // เปิดลิงก์ดาวน์โหลดในแท็บใหม่
        window.open(downloadUrl, '_blank');
      },
      openDeleteModal(file) {
        this.fileToDelete = file;
        this.showModal = true;
      },
      confirmDelete() {
        this.isDeleting = true; // เปิดสถานะโหลด
  
        setTimeout(() => {
          this.files = this.files.filter(f => f.id !== this.fileToDelete.id);
          this.showModal = false;
          this.fileToDelete = null;
          this.isDeleting = false; // ปิดสถานะโหลด
        }, 2000)
      },
      async showImage(filePath, index) {
        this.lightboxIndex = index; // ตั้งค่า lightboxIndex
        this.lightboxVisible = true;
  
        try {
          this.imageLoading = true;
  
          // เพิ่ม URL ของภาพลงใน lightboxImages
          this.lightboxImages = this.files.map(file => `http://localhost:3000/uploads/land_lives/${file.path_file}`); // ตั้งค่า lightboxImages สำหรับทุกภาพ
          this.lightboxIndex = index; // ตั้งค่าตำแหน่งภาพที่จะเปิด
          console.log('lightboxImages:', this.lightboxImages);
          console.log('lightboxImages:', this.lightboxIndex);
  
          // แสดง lightbox
          this.lightboxVisible = true;
          this.imageLoading = false;
        } catch (error) {
          console.error("Error fetching image:", error);
        } finally {
          this.imageLoading = false;
        }
      },
      nextImage() {
        if (this.lightboxIndex < this.lightboxImages.length - 1) {
          this.lightboxIndex++;
        }
      },
      prevImage() {
        if (this.lightboxIndex > 0) {
          this.lightboxIndex--;
        }
      },
      closeLightbox() {
        this.lightboxVisible = false;
      },
    }
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