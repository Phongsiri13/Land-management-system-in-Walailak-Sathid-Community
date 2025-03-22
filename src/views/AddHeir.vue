<template>
    <div class="primary_content">
        <div class="is-flex is-justify-content-center is-align-items-center py-5">
            <div class="box column is-three-quarters-tablet is-half-desktop is-four-fifths-mobile">
                <h1 class="title has-text-centered is-size-2 has-text-link mt-2">เพิ่มข้อมูลทายาท</h1>
                <form @submit.prevent="submitHeir">
                    <div class="container px-5">
                        <!-- People's name -->
                        <div class="columns pt-1">
                            <div class="column is-full">
                                <div class="field">
                                    <label class="label is-size-5">คำนำหน้าชื่อ <strong
                                            class="has-text-danger">*</strong></label>
                                    <div class="control">
                                        <div class="select is-fullwidth">
                                            <select v-model="formHeirData.prefix" @change="validateField('prefix')"
                                                class="is-size-5">
                                                <option value="">เลือกคำนำหน้า</option>
                                                <option v-for="pfl in prefixList" :key="pfl.value" :value="pfl.value">
                                                    {{ pfl.label }}
                                                </option>
                                            </select>
                                        </div>
                                        <div class="mt-3">
                                            <DisplayError v-if="errors.prefix" :err_text="errors.prefix" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="columns pt-1">
                            <div class="column is-full">
                                <div class="field">
                                    <label class="label is-size-5">ชื่อจริง <strong
                                            class="has-text-danger">*</strong></label>
                                    <div class="control">
                                        <input class="input is-normal is-size-5" @input="validateField('heir_fname')"
                                            v-model="formHeirData.heir_fname" type="text"
                                            placeholder="กรุณากรอกชื่อจริง" />
                                    </div>
                                    <DisplayError v-if="errors.heir_fname" :err_text="errors.heir_fname" />
                                </div>
                            </div>
                        </div>

                        <div class="columns pt-1">
                            <div class="column is-full">
                                <div class="field">
                                    <label class="label is-size-5">นามสกุล <strong
                                            class="has-text-danger">*</strong></label>
                                    <div class="control">
                                        <input class="input is-normal is-size-5" @input="validateField('heir_lname')"
                                            v-model="formHeirData.heir_lname" type="text"
                                            placeholder="กรุณากรอกนามสกุล" />
                                    </div>
                                    <DisplayError v-if="errors.heir_lname" :err_text="errors.heir_lname" />
                                </div>
                            </div>
                        </div>

                        <!-- submit -->
                        <div class="field is-grouped is-grouped-centered mt-4">
                            <!-- Reset Button -->
                            <button type="button" class="button is-medium is-size-5 px-5" @click="resetForm">
                                <span>ยกเลิก</span>
                            </button>

                            <!-- Submit Button -->
                            <button type="submit" class="button is-success is-medium is-size-5 px-5 ml-3"
                                :disabled="btnLoad">
                                <span>{{ btnLoad ? 'กำลังตรวจสอบ' : 'บันทึก' }}</span>
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import DOMAIN_NAME from '@/config/domain_setup';
import { fetchPrefix } from '@/api/apiPeople';
import axios from 'axios';
import { getHeirModel } from '@/model/heirModel';
import { showSuccessAlert, showErrorAlert } from '@/utils/alertFunc';
import DisplayError from '@/components/form_valid/DisplayError.vue';
import { HeirValidSchema } from '@/model/heirModel';
import * as yup from "yup";
import { checkFullnameMatchHeir } from '@/api/apiHeir';

export default {
    components: {
        DisplayError
    },
    data() {
        return {
            errors: {},
            formHeirData: { ...getHeirModel },
            btnLoad: false,
            prefixList: [
                { value: null, label: 'ไม่พบข้อมูล' },
            ]
        }
    },
    methods: {
        async ErrorAlert() {
            await showErrorAlert()
        },
        // Validate individual fields
        async validateField(field) {
            try {
                const schema = this.getValidationSchema();
                await schema.validateAt(field, this.formHeirData);
                this.errors[field] = ""; // Clear error if valid
            } catch (err) {
                this.errors[field] = err.message; // Set error message
            }
        },
        // Validate the whole form
        async validateForm() {
            try {
                const schema = this.getValidationSchema();
                await schema.validate(this.formHeirData, { abortEarly: false });
                this.errors = {}; // Clear all errors
                return true;
            } catch (err) {
                this.errors = err.inner.reduce((acc, curr) => {
                    acc[curr.path] = curr.message;
                    return acc;
                }, {});
                return false;
            }
        },
        // schema
        getValidationSchema() {
            return yup.object().shape({ ...HeirValidSchema });
        },
        resetForm() {
            console.log('reset')
            this.formHeirData = { ...getHeirModel }
            this.errors = {};
        },
        async submitHeir() {
            // ตรวจสอบข้อมูลที่กรอก
            const isValid = await this.validateForm();
            if (!isValid) return;
            this.btnLoad = true

            // console.log("Heir-length:", this.formHeirData.heir_fname.length)
            // return;
            const form_data = {
                // relation_select: this.
                prefix_id: this.formHeirData.prefix || null,
                first_name: this.formHeirData.heir_fname.trim() || null,
                last_name: this.formHeirData.heir_lname.trim() || null,
            };

            const matchName = await checkFullnameMatchHeir(form_data.first_name, form_data.last_name)
            // console.log('match-name:', matchName.data)
            if (matchName.data.length > 0) {
                await showErrorAlert('มีชื่อนี้ซ้ำในระบบ!', 'ทายาทคนนี้มีอยู่ในระบบเรียบร้อยแล้ว');
                this.btnLoad = false;
                return
            }

            console.log("Heir:", form_data)
            console.log("Heir-length:", form_data.last_name.length)

            try {
                const response = await axios.post(`${DOMAIN_NAME}/heir`, form_data, {
                    withCredentials: true
                });
                console.log('Response:', response.data);
                await showSuccessAlert('การเพิ่มข้อมูลทายาท', response.data.message)
                this.resetForm();
            } catch (error) {
                console.error('Error:', error);
                showErrorAlert('การเพิ่มข้อมูลทายาท', response.data.message);
            } finally {
                this.btnLoad = false;
            }
            this.btnLoad = false;
        },
    },
    async mounted() {
        this.prefixList = await fetchPrefix()
    }
}
</script>

<style scoped>
.button {
    border-radius: 5px;
    min-width: 120px;
}

.date-picker-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-family: Arial, sans-serif;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.date-label {
    font-size: 16px;
    color: #333;
    margin-bottom: 8px;
}

.date-input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.3s ease;
}


/* input{
    border-color: red;
} */

.date-input:focus {
    border-color: #007bff;
}

.date-display {
    margin-top: 15px;
    font-size: 18px;
    color: #555;
}

.date-display span {
    font-weight: bold;
    color: #007bff;
}

.option {
    border-color: red;
}

#submitPeople {
    background-color: #4e4b32;
}

/* .primary_content */

/* กำหนด padding ซ้าย-ขวา 3rem บนมือถือ */
/* @media screen and (max-width: 768px) {
    .primary_content {
        margin-left: 5%;
    }
} */
</style>