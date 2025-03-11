<template>
  <div class="modal" v-show="isVisible">
    <div class="modal-content">
      <span class="close-button" @click="closeModal">&times;</span>
      <h2 class="title is-size-4">{{ modalTitle }}</h2>

      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="username">บัญชี <strong class="has-text-danger">*</strong></label>
          <input type="text" id="username" :disabled="isEditMode" v-model="formData.username"
          placeholder="กรุณากรอกบัญชี"
            :class="{ 'is-danger': errors.username }" @input="validateField('username')">
          <DisplayError v-if="errors.username" :err_text="errors.username" />
        </div>

        <div class="form-group">
          <label for="first_name">บทบาท <strong class="has-text-danger">*</strong></label>
          <div class="select is-fullwidth">
            <select v-model="formData.id_role" :class="{ 'is-danger': errors.id_role }"
              @change="validateField('id_role')">
              <option value="" selected>เลือกบทบาท</option>
              <option v-for="pfl in roleListData" :key="pfl.value" :value="pfl.value">
                {{ pfl.label }}
              </option>
            </select>
          </div>
          <div class="my-3"></div>
          <DisplayError v-if="errors.id_role" :err_text="errors.id_role" />
        </div>

        <div class="form-group">
          <label for="password">รหัสผ่าน <strong v-if="isAddMode" class="has-text-danger">*</strong></label>
          <input type="password" id="password" v-model="formData.password" placeholder="กรุณากรอกรหัสผ่าน"
            :class="{ 'is-danger': errors.password }" @input="validateField('password')">
          <DisplayError v-if="errors.password" :err_text="errors.password" />
        </div>

        <div class="form-group">
          <label for="confirm_password">ยืนยันรหัสผ่าน <strong v-if="isAddMode"
              class="has-text-danger">*</strong></label>
          <input type="password" id="confirm_password" v-model="formData.confirm_password"
            placeholder="กรุณากรอกยืนยันรหัสผ่าน" :class="{ 'is-danger': errors.confirm_password }"
            @input="validateField('confirm_password')">
          <DisplayError v-if="errors.confirm_password" :err_text="errors.confirm_password" />
        </div>

        <div class="form-group">
          <label for="first_name">คำนำหน้าชื่อ</label>
          <div class="select is-fullwidth">
            <select v-model="formData.user_prefix" :class="{ 'is-danger': errors.user_prefix }"
              @change="validateField('user_prefix')">
              <option value="" selected>เลือกคำนำหน้าชื่อ</option>
              <option v-for="pfl in prefixListData" :key="pfl.value" :value="pfl.value">
                {{ pfl.label }}
              </option>
            </select>
          </div>
          <DisplayError v-if="errors.user_prefix" :err_text="errors.user_prefix" />
        </div>

        <div class="form-group">
          <label for="first_name">ชื่อจริง</label>
          <input type="text" id="first_name" v-model="formData.first_name" :class="{ 'is-danger': errors.first_name }"
            placeholder="กรุณากรอกชื่อจริง" @input="validateField('first_name')">
          <DisplayError v-if="errors.first_name" :err_text="errors.first_name" />
        </div>

        <div class="form-group">
          <label for="last_name">นามสกุล</label>
          <input type="text" id="last_name" v-model="formData.last_name" placeholder="กรุณากรอกนามสกุล"
            :class="{ 'is-danger': errors.last_name }" @input="validateField('last_name')">
          <DisplayError v-if="errors.last_name" :err_text="errors.last_name" />
        </div>

        <div class="form-group">
          <label for="phone_number">เบอร์โทรศัพท์</label>
          <input type="text" id="phone_number" v-model="formData.phone_number" placeholder="กรุณากรอกเบอร์โทรศัพท์"
            :class="{ 'is-danger': errors.phone_number }" @input="validateField('phone_number')">
          <DisplayError v-if="errors.phone_number" :err_text="errors.phone_number" />
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-button" @click="closeModal">ยกเลิก</button>
          <button type="submit" class="submit-button">
            {{ submitButtonText }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import * as yup from "yup";
import DisplayError from '../form_valid/DisplayError.vue';
import { userEditSchema, userCreateSchema } from "@/model/userModel";

export default {
  name: 'AdminProfileModal',
  props: {
    isVisible: { type: Boolean },
    mode: { type: String, default: 'add', validator: (value) => ['add', 'edit'].includes(value) },
    adminData: { type: Object, default: null },
    prefixListData: { type: Array, default: null },
    roleListData: { type: Array, default: null }
  },
  components: {
    DisplayError,
  },
  emits: ['close', 'submit'],
  data() {
    return {
      errors: {},
      formData: {
        username: '',
        user_prefix: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        password: '',
        confirm_password: '',
        id_role: '',
      },
    };
  },
  computed: {
    isAddMode() {
      return this.mode === 'add';
    },
    isEditMode() {
      return this.mode === 'edit';
    },
    modalTitle() {
      return this.isAddMode ? 'เพิ่มผู้ใช้บัญชี' : 'แก้ไขบัญชีผู้ใช้';
    },
    submitButtonText() {
      return 'บันทึก';
    },
  },
  watch: {
    adminData: {
      handler(newAdminData) {
        if (newAdminData && this.mode === 'edit') {
          const { id_role, user_prefix, first_name, last_name, phone_number, user_id, username } = newAdminData;
          this.formData = { id_role, user_prefix, first_name, last_name, phone_number, user_id, username };
        } else {
          this.formData = {
            username: '',
            user_prefix: '',
            first_name: '',
            last_name: '',
            phone_number: '',
            id_role: '',
          };
        }
      },
      immediate: true,
    },
  },
  methods: {
    async submitForm() {
      const isValid = await this.validateForm();
      if (isValid) {
        console.log("Submitting Form Data:", this.formData);
      } else {
        console.log("Form has errors", this.errors);
        return
      }

      if (this.isAddMode) {
        console.log('add:', this.formData)
        this.$emit("submit", this.formData);
      }

      if (this.isEditMode) {
        const { user_id, username, ...updateData } = this.formData;
        this.$emit("submit", updateData, user_id);
      }

    }
    ,
    closeModal() {
      this.$emit('close');
      this.formData = {
        username: '',
        user_prefix: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        password: '',
        confirm_password: '',
        id_role: '',
      };
      this.errors = {};
    },
    async validateField(field) {
      try {
        if (this.isAddMode) {
          await userCreateSchema.validateAt(field, this.formData);
        }
        if (this.isEditMode) {
          await userEditSchema.validateAt(field, this.formData);
        }
        this.errors[field] = ""; // ถ้าผ่านการตรวจสอบ ล้าง error
      } catch (err) {
        this.errors[field] = err.message; // เก็บข้อความ error
      }
    },
    getValidationSchema() {
      if (this.isAddMode) {
        return yup.object().shape({ ...userCreateSchema });
      }
      if (this.isEditMode) {
        return yup.object().shape({ ...userEditSchema });
      }
    },
    async validateForm() {
      try {
        if (this.isAddMode) {
          await userCreateSchema.validate(this.formData, { abortEarly: false });
        }
        if (this.isEditMode) {
          await userEditSchema.validate(this.formData, { abortEarly: false });
        }
        this.errors = {}; // ล้าง error ถ้าข้อมูลถูกต้อง
        return true;
      } catch (err) {
        this.errors = err.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        return false;
      }
    }
    ,
  },
};
</script>

<style scoped>
.error {
  color: red;
  font-size: 12px;
  margin-top: 2px;
}

input,
select {
  font-size: 20px;
}

label {
  font-size: 16px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 5px;
  width: 90%;
  max-width: 500px;
  position: relative;
}

.close-button {
  position: absolute;
  right: 15px;
  top: 10px;
  font-size: 1.5em;
  cursor: pointer;
}

/* Style ของ Form */
.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.submit-button,
.cancel-button {
  padding: 10px 20px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.submit-button {
  background-color: #007bff;
  color: #fff;
}

.cancel-button {
  background-color: #dcdcdd;
  color: #3f3f3e;
}
</style>