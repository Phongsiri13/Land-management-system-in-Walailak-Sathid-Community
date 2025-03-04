<template>
    <div class="modal" :class="{ 'is-active': showModal }">
      <div class="modal-background" @click="closeModal"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">ยืนยันการลบ</p>
          <button class="delete" @click="closeModal"></button>
        </header>
        <section class="modal-card-body">
          คุณต้องการลบไฟล์ <strong>{{ fileToDelete?.name }}</strong> ใช่หรือไม่?
        </section>
        <footer class="modal-card-foot">
          <button class="button is-danger" :class="{ 'is-loading': isDeleting }" @click="confirmDelete"
            :disabled="isDeleting">
            ลบไฟล์
          </button>
          <button class="button" @click="closeModal">ยกเลิก</button>
        </footer>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      showModal: Boolean,
      fileToDelete: Object,
      isDeleting: Boolean
    },
    methods: {
      closeModal() {
        this.$emit('close-modal');
      },
      confirmDelete() {
        this.$emit('confirm-delete');
      }
    }
  };
  </script>
  