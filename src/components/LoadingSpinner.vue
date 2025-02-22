<template>
    <div v-if="isLoading" class="loading-container">
      <i class="fas fa-spinner fa-spin"></i>
      <span class="loading-text">{{ textTitle }}</span>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoadingSpinner',
    props: {
      isLoading: {
        type: Boolean,
        required: true,
      },
      textTitle: {
        type: String,
        default: 'กำลังโหลด...', // กำหนดค่าเริ่มต้นของข้อความ
      },
    },
  };
  </script>
  
  <style scoped>
  .loading-container {
    display: flex;
    align-items: center; /* จัดให้ไอคอนกับข้อความอยู่ตรงกลาง */
    justify-content: center; /* จัดให้อยู่ตรงกลางของ div */
    width: 300px;
    height: 300px;
    gap: 10px; /* เว้นระยะห่างระหว่างไอคอนกับข้อความ */
  }
  
  .loading-text {
    font-size: 16px; /* ปรับขนาดตัวอักษร */
  }
  </style>
  