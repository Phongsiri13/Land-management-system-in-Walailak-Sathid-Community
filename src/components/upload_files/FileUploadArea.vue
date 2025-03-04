<template>
    <div class="file-drop-area" @click="openFilePicker" @dragover.prevent @drop="handleDrop">
      <div class="upload-icon">
        <i class="fas fa-cloud-upload-alt"></i>
      </div>
      <p>คลิกเพื่ออัปโหลด</p>
      <input type="file" ref="fileInput" @change="handleFileSelect" hidden :disabled="isFileInputDisabled" />
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isFileInputDisabled: Boolean,
      openFilePicker: Function,
      handleFileSelect: Function,
      handleDrop: Function
    }
  };
  </script>
  