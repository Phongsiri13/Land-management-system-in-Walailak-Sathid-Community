<template>
  <div 
    v-if="isLoading" 
    class="loading-container" 
    :style="{ 
      width: width, 
      height: height, 
      display: 'flex', 
      alignItems: align, 
      justifyContent: justify 
    }"
  >
    <i class="fas fa-spinner fa-spin" :style="{ fontSize: fontSize }"></i>
    <span class="loading-text" :style="{ fontSize: fontSize }">{{ textTitle }}</span>
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
      default: '',
    },
    width: {
      type: String,
      default: '0px',
    },
    height: {
      type: String,
      default: '0px',
    },
    align: {
      type: String,
      default: 'center', // ค่าเริ่มต้น: จัดตรงกลาง
    },
    justify: {
      type: String,
      default: 'center', // ค่าเริ่มต้น: จัดตรงกลาง
    },
    fontSize: {
      type: String,
      default: '16px', // ค่าเริ่มต้นของขนาดตัวอักษร
    }
  }
  ,
};
</script>

<style scoped>
.loading-container {
  border-radius: 10px;
  padding: 20px;
}
</style>