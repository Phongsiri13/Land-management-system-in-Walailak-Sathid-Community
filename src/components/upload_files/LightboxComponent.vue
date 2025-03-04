<template>
    <div v-if="lightboxVisible" class="lightbox">
      <vue-easy-lightbox :visible="lightboxVisible" :imgs="lightboxImages" :index="lightboxIndex"
        @hide="closeLightbox" />
    </div>
  </template>
  
  <script>
  export default {
    props: {
      lightboxVisible: Boolean,
      lightboxImages: Array,
      lightboxIndex: Number
    },
    methods: {
      closeLightbox() {
        this.$emit('close-lightbox');
      }
    }
  };
  </script>
  