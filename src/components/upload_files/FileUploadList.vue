<template>
    <div class="upload-list" v-if="files.length > 0">
      <div v-for="(file, index) in files" :key="file.id_live_doc" class="upload-item mb-2">
        <button class="button has-background-danger" style="border-radius: 5px;" @click="showImage(file.path_file, index)">
          <span class="icon p-3">
            <i class="fas fa-image"></i>
          </span>
        </button>
        <div class="file-info">
          <p v-if="file.path_file">{{ file.path_file }}</p>
          <p v-else>ไม่มีข้อมูลไฟล์</p>
          <progress class="progress is-primary" :value="file.progress || 100" max="100"></progress>
          <small v-if="file.progress < 100">{{ file.progress }}% - {{ file.speed }}/sec</small>
          <small v-else class="completed-text">✅ Completed</small>
        </div>
        <button class="delete" @click="openDeleteModal(file)" v-if="userRole === roles[3].role_id"></button>
        <button class="button is-link is-inverted" @click="downloadLink(file.path_file)">
          <i class="fas fa-download"></i>
        </button>
      </div>
    </div>
    <div v-else>
      ยังไม่มีการอัพโหลดไฟล์
    </div>
  </template>
  
  <script>
  export default {
    props: {
      files: Array,
      userRole: String,
      roles: Array,
      openDeleteModal: Function,
      downloadLink: Function,
      showImage: Function
    }
  };
  </script>
  