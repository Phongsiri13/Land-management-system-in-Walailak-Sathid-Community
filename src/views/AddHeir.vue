<template>
    <div class="primary_content">
        <div class="is-flex is-justify-content-center is-align-items-center py-5">
            <div class="box column is-three-quarters-tablet is-half-desktop is-four-fifths-mobile">
                <h1 class="title has-text-centered is-size-2">รายละเอียดของทายาท</h1>
                <form @submit.prevent="submitHeir">
                    <div class="container px-5">
                        <!-- People's name -->
                        <div class="columns pt-1">
                            <div class="column is-full">
                                <div class="field">
                                    <label class="label is-size-5"><strong class="has-text-danger">*</strong>
                                        คำนำหน้าชื่อ</label>
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
                                    <label class="label is-size-5"><strong class="has-text-danger">*</strong>
                                        ชื่อจริง</label>
                                    <div class="control">
                                        <input class="input is-normal is-size-5" @change="validateField('heir_fname')"
                                            v-model="formHeirData.heir_fname" type="text"
                                            placeholder="กรุณากรอกชื่อจริงทายาท" />
                                    </div>
                                    <DisplayError v-if="errors.heir_fname" :err_text="errors.heir_fname" />
                                </div>
                            </div>
                        </div>

                        <div class="columns pt-1">
                            <div class="column is-full">
                                <div class="field">
                                    <label class="label is-size-5"><strong class="has-text-danger">*</strong>
                                        นามสกุล</label>
                                    <div class="control">
                                        <input class="input is-normal is-size-5" @change="validateField('heir_lname')"
                                            v-model="formHeirData.heir_lname" type="text"
                                            placeholder="กรุณากรอกนามสกุลทายาท" />
                                    </div>
                                    <DisplayError v-if="errors.heir_lname" :err_text="errors.heir_lname" />
                                </div>
                            </div>
                        </div>

                        <!-- submit -->
                        <div class="field is-grouped is-grouped-centered mt-4">
                            <!-- Reset Button -->
                            <button type="button" class="button is-warning is-medium is-size-5 is-rounded px-5"
                                @click="resetForm">
                                <span class="icon">
                                    <i class="fas fa-undo"></i>
                                </span>
                                <span>รีเซ็ต</span>
                            </button>

                            <!-- Submit Button -->
                            <button type="submit" class="button is-success is-medium is-size-5 is-rounded px-5 ml-3"
                                :disabled="btnLoad">
                                <span class="icon">
                                    <i class="fas fa-check"></i>
                                </span>
                                <span>{{ btnLoad ? 'กำลังตรวจสอบ' : 'ส่งข้อมูล' }}</span>
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { store } from '@/store'
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
            store.status_path_change = true

            console.log("Heir-length:", this.formHeirData.heir_fname.length)
            // return;
            const form_data = {
                // relation_select: this.
                prefix_id: this.formHeirData.prefix || null,
                first_name: this.formHeirData.heir_fname || null,
                last_name: this.formHeirData.heir_lname || null,
            };

            const matchName = await checkFullnameMatchHeir(form_data.first_name, form_data.last_name)
            if (matchName) {
                await showErrorAlert('มีชื่อนี้ซ้ำในระบบ!', 'ทายาทคนนี้มีอยู่ในระบบเรียบร้อยแล้ว');
                return
            }

            console.log("Heir:", form_data)
            console.log("Heir-length:", form_data.last_name.length)

            try {
                const response = await axios.post('http://localhost:3000/heir', form_data);
                console.log('Response:', response.data);
                await showSuccessAlert('การเพิ่มข้อมูลทายาท', response.data.message)
                this.resetForm();
            } catch (error) {
                console.error('Error:', error);
                showErrorAlert('การเพิ่มข้อมูลทายาท', response.data.message);
            } finally {
                this.btnLoad = false;
                store.status_path_change = false;
            }
            this.btnLoad = false;
            store.status_path_change = false;
        },
    },
    async mounted() {
        this.prefixList = await fetchPrefix()
    }
}
</script>

<style scoped>
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