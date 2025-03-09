<template>
    <div v-if="visible" class="lightbox">
      <vue-easy-lightbox :visible="visible" :imgs="imgs" :index="index" @hide="close" />
    </div>
  </template>
  
  <script>
  import VueEasyLightbox from 'vue-easy-lightbox';
  
  export default {
    components: {
      VueEasyLightbox,
    },
    props: {
      visible: Boolean,
      imgs: Array,
      index: Number,
    },
    methods: {
      close() {
        this.$emit('close-lightbox');
      },
    },
  };
  </script>
  
  <style scoped>
  .lightbox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  </style>