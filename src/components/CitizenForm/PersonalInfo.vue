<template>
  <!-- คำนำหน้าชื่อ -->
  <div class="column is-half p-0 py-2">
    <div class="field">
      <label class="label"><strong class="has-text-danger">*</strong> คำนำหน้าชื่อ</label>
      <div class="control">
        <div class="select is-fullwidth">
          <select v-model="formData.prefix" @change="validateField('prefix')">
            <option value="" selected>เลือกคำนำหน้าชื่อ</option>
            <option v-for="pfl in prefixList" :key="pfl.value" :value="pfl.value">
              {{ pfl.label }}
            </option>
          </select>
          <DisplayError v-if="errors.prefix" :err_text="errors.prefix" />
        </div>
      </div>
    </div>
  </div>

  <div class="columns">
    <!-- ชื่อจริง -->
    <div class="column is-half">
      <div class="field">
        <label class="label"><strong class="has-text-danger">*</strong> ชื่อจริง</label>
        <div class="control">
          <input class="input" type="text" @input="validateField('firstName')" v-model="formData.firstName"
            placeholder="กรุณากรอกชื่อจริง" :class="{ 'is-danger': errors.firstName }" />
          <DisplayError v-if="errors.firstName" :err_text="errors.firstName" />
        </div>
      </div>
    </div>

    <!-- นามสกุล -->
    <div class="column is-half">
      <div class="field">
        <label class="label"><strong class="has-text-danger">*</strong> นามสกุล</label>
        <div class="control">
          <input class="input" type="text" @input="validateField('lastName')" :class="{ 'is-danger': errors.lastName }"
            v-model="formData.lastName" placeholder="กรุณากรอกนามสกุล" />
          <DisplayError v-if="errors.lastName" :err_text="errors.lastName" />
        </div>
      </div>
    </div>
  </div>

  <div class="columns">
    <!-- วันเกิด -->
    <div class="column is-half">
      <div class="field">
        <label class="label"><strong class="has-text-danger">*</strong> วันเดือนปีเกิด</label>
        <input class="input" type="date" :class="{ 'is-danger': errors.birthDate }" v-model="formData.birthDate"
          @change="validateField('birthDate')" />
        <DisplayError v-if="errors.birthDate" :err_text="errors.birthDate" />
      </div>
    </div>

    <!-- เพศ -->
    <div class="column is-half">
      <div class="field">
        <label class="label has-text-weight-bold"><strong class="has-text-danger">*</strong> เลือกเพศ</label>
        <div class="control">
          <div class="radio-group">
            <label class="radio has-border-radius-4 p-2 mb-2 is-size-6">
              <input type="radio" v-model="formData.gender" value="1" @change="validateField('gender')">
              <span class="ml-2">ชาย</span>
            </label>
            <label class="radio has-border-radius-4 p-2 mb-2 is-size-6">
              <input type="radio" v-model="formData.gender" value="0" @change="validateField('gender')">
              <span class="ml-2">หญิง</span>
            </label>
            <DisplayError v-if="errors.gender" :err_text="errors.gender" />
          </div>
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
    prefixList: Array,
    validateField: Function,
  },
};
</script>