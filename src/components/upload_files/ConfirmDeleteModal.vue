<template>
    <div class="modal" :class="{ 'is-active': showModal }">
      <div class="modal-background" @click="closeModal"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">ยืนยันการลบไฟล์</p>
          <button class="delete" @click="closeModal"></button>
        </header>
        <section class="modal-card-body">
          ต้องการลบไฟล์ <strong>{{ fileToDelete?.path_file }}</strong> ใช่หรือไม่?
        </section>
        <footer class="modal-card-foot">
          <button class="button" @click="closeModal">ยกเลิก</button>
          <div class='mx-1'></div>
          <button class="button is-success" :class="{ 'is-loading': isDeleting }" @click="confirmDelete(fileToDelete?.id_live_doc)" :disabled="isDeleting">
            ยืนยัน
          </button>
        </footer>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      showModal: Boolean,
      fileToDelete: Object,
      isDeleting: Boolean,
    },
    methods: {
      closeModal() {
        this.$emit('close-modal');
      },
      confirmDelete(file_name) {
        this.$emit('confirm-delete',file_name);
      },
    },
  };
  </script>