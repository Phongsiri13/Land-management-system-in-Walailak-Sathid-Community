<template>
    <div class="file-drop-area" @click="openFilePicker" @dragover.prevent @drop="handleDrop">
      <div class="upload-icon">
        <i class="fas fa-cloud-upload-alt"></i>
      </div>
      <p>อัปโหลดไฟล์</p>
      <input type="file" ref="fileInput" @change="handleFileSelect" hidden :disabled="isFileInputDisabled" />
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isFileInputDisabled: Boolean,
    },
    methods: {
      openFilePicker() {
        this.$refs.fileInput.click();
      },
      handleFileSelect(event) {
        this.$emit('file-selected', event.target.files);
      },
      handleDrop(event) {
        this.$emit('file-dropped', event.dataTransfer.files);
      },
    },
  };
  </script>
  
  <style scoped>
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
  </style>