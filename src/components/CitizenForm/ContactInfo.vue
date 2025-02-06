<template>
    <div class="columns">
      <!-- เลขบัตรประชาชน -->
      <div class="column is-half">
        <div class="field">
          <label class="label"><strong class="has-text-danger">*</strong> เลขบัตรประชาชน</label>
          <div class="control">
            <input class="input" type="text" @input="validateField('citizenId')" :class="{ 'is-danger': errors.citizenId }"
              v-model="formData.citizenId" placeholder="กรุณากรอกเลขบัตรประชาชน" />
            <DisplayError v-if="errors.citizenId" :err_text="errors.citizenId" />
          </div>
        </div>
      </div>
  
      <!-- เบอร์โทรศัพท์ -->
      <div class="column is-half">
        <div class="field">
          <label class="label"><strong class="has-text-danger">*</strong> เบอร์โทรศัพท์</label>
          <div class="control">
            <input class="input" type="tel" v-model="formData.phone" @input="validateField('phone')"
              :class="{ 'is-danger': errors.phone }" placeholder="กรุณากรอกเบอร์โทรศัพท์" />
            <DisplayError v-if="errors.phone" :err_text="errors.phone" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      formData: Object,
      errors: Object,
      validateField: Function,
    },
  };
  </script>