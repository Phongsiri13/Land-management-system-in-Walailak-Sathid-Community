<template>
  <div class="upload-list">
    <h3 class="title is-5">📂 {{ titleFile }}</h3>
    <div v-if="files.length > 0">
      <div v-for="(file, index) in files" :key="file.id_live_doc" class="upload-item mb-2">
        <button class="button" :class="file.isFailed ? 'has-background-danger'
        : 'has-background-primary'" 
        style="border-radius: 5px;"
          @click="showImage(file.path_file, index)">
          <span class="icon p-3">
            <i :class="iconImage"></i>
          </span>
        </button>
        <div class="file-info">
          <p v-if="file.path_file">{{ file.path_file }} <small></small></p>
          <p v-else>ไม่มีข้อมูลไฟล์</p>

          <!-- แสดงสถานะ "กำลังอัปโหลด" หรือ "เสร็จสิ้น" หรือ "ไม่สำเร็จ" -->
          <small v-if="file.isUploading">
            <i class="fas fa-spinner fa-spin"></i> กำลังอัปโหลด...
          </small>
          <small v-else>
            <span v-if="file.isFailed">
              <i class="fas fa-times-circle" style="color: red;"></i> การอัปโหลดไม่สำเร็จ
            </span>
            <span v-else class="completed-text">
              <i class="fas fa-check-circle" style="color: green;"></i> เสร็จสิ้น
            </span>
          </small>
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
  </div>
</template>

<script>
export default {
  props: {
    files: Array,
    userRole: String,
    roles: Array,
    titleFile: String,
    iconImage: String
  },
  methods: {
    showImage(filePath, index) {
      this.$emit('show-image', filePath, index);
    },
    openDeleteModal(file) {
      this.$emit('open-delete-modal', file);
    },
    downloadLink(filePath) {
      this.$emit('download-link', filePath);
    },
  },
};
</script>

<style scoped>
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