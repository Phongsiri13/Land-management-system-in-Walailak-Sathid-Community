<template>
  <div class="columns">
    <!-- บ้านเลขที่ -->
    <div class="column is-half">
      <div class="field">
        <label class="label">บ้านเลขที่</label>
        <div class="control">
          <input class="input" type="text" placeholder="กรุณากรอกบ้านเลขที่" v-model="formData.village" />
        </div>
      </div>
    </div>

    <!-- ตำบล -->
    <div class="column is-half">
      <div class="field">
        <label class="label"><strong class="has-text-danger">*</strong> ตำบล</label>
        <div class="control">
          <div class="select is-fullwidth">
            <select v-model="formData.subdistrict" :class="{ 'is-danger': errors.subdistrict }"
              @change="$emit('update-village-options')">
              <option value="" selected>เลือกตำบล</option>
              <option value="หัวตะพาน">หัวตะพาน</option>
              <option value="ไทรบุรี">ไทรบุรี</option>
            </select>
          </div>
          <DisplayError v-if="errors.subdistrict" :err_text="errors.subdistrict" />
        </div>
      </div>
    </div>
  </div>
  <div class="columns">
    
    <!-- หมู่ที่ -->
    <div class="column is-half">
      <div class="field">
        <label class="label"><strong class="has-text-danger">*</strong> หมู่ที่</label>
        <div class="control">
          <div class="select is-fullwidth">
            <select @change="validateField('village')" v-model="formData.village">
              <option value="" selected>เลือกหมู่</option>
              <option v-for="pfl in village" :key="pfl.value" :value="pfl.value">
                {{ pfl.label }}
              </option>
            </select>
            <DisplayError v-if="errors.village" :err_text="errors.village" />
          </div>
        </div>
      </div>
    </div>

    <!-- ซอย -->
    <div class="column is-half">
      <div class="field">
        <label class="label"><strong class="has-text-danger">*</strong> อาศัยอยู่ในซอยใด</label>
        <div class="control">
          <div class="select is-fullwidth">
            <select v-model="formData.selectedSoi" @change="validateField('selectedSoi')">
              <option value="" disabled selected>เลือกซอย</option>
              <option v-for="soi in sois" :key="soi.value" :value="soi.value">
                {{ soi.label }}
              </option>
            </select>
            <DisplayError v-if="errors.selectedSoi" :err_text="errors.selectedSoi" />
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
    village: Array,
    sois: Array,
    validateField: Function,
  },
};
</script>