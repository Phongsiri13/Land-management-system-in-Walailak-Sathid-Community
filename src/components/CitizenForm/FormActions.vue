<template>
    <div class="field is-grouped is-grouped-centered mt-4">
      <p class="control">
        <button class="button-41 is-light is-rounded is-large clear-btn" type="button" @click="resetForm">ล้างข้อมูล</button>
      </p>
      <p class="control">
        <button class="button-41 is-rounded is-large" type="submit">เพิ่มข้อมูล</button>
      </p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      resetForm: Function,
    },
  };
  </script>