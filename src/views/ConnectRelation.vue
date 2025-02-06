<template>
    <div class="primary_content">
        <div class="is-flex is-justify-content-center py-5">
            <div class="box column is-three-quarters-tablet is-three-fifths-desktop is-four-fifths-mobile">
                <h1 class="title has-text-centered is-size-2 has-text-weight-bold">
                    รายละเอียดของทายาท
                </h1>
                <!-- Input -->
                <form @submit.prevent="submitHeirRelation">
                    <div class="container px-5">
                        <!-- ราษฎร -->
                        <div class="columns">
                            <div class="column is-10">
                                <div class="field">
                                    <label class="label is-size-5 has-text-weight-semibold">
                                        <strong class="has-text-danger">*</strong>
                                        ชื่อจริง - นามสกุล (ราษฎร)
                                    </label>
                                    <div class="control has-icons-left">
                                        <input class="input is-medium is-size-5" type="text" v-model="fullnameTrimmed"
                                            placeholder="กรุณากรอกชื่อจริง - นามสกุล" required />
                                        <span class="icon is-small is-left">
                                            <i class="fas fa-user"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- ปุ่มเพิ่มฟิลด์ -->
                        <div class="columns pt-1">
                            <div class="column is-full">
                                <button type="button" class="button is-primary is-medium is-size-5"
                                    @click="addHeirField" :disabled="formHeirData.heirs.length >= 6">
                                    <span class="icon">
                                        <i class="fas fa-user-plus"></i>
                                    </span>
                                    <span>เพิ่ม</span>
                                </button>
                            </div>
                        </div>
                        <!-- ฟิลด์ input ที่เพิ่มเข้ามา dynamically -->
                        <transition-group name="fade" tag="div">
                            <div v-for="(heir, index) in formHeirData.heirs" :key="index"
                                class="columns is-vcentered pt-1">
                                <!-- ชื่อจริงทายาท -->
                                <div class="column is-3">
                                    <div class="field">
                                        <label class="label"><strong class="has-text-danger">*</strong>
                                            เลือกความสัมพันธ์</label>
                                        <div class="control">
                                            <div class="select is-fullwidth">
                                                <select v-model="heir.relationSlected" class="is-size-5">
                                                    <option value="" selected>เลือกความสัมพันธ์</option>
                                                    <option v-for="pfl in relationList" :key="pfl.value"
                                                        :value="pfl.value">
                                                        {{ pfl.label }}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- ชื่อจริง-นามสกุล ของทายาท -->
                                <div class="column is-7">
                                    <div class="field">
                                        <label class="label is-size-5 has-text-weight-semibold">
                                            <strong class="has-text-danger">*</strong>
                                            ชื่อจริง - นามสกุล (ทายาท {{ index + 1 }})
                                        </label>
                                        <div class="control has-icons-left">
                                            <input class="input is-medium is-size-5" v-model="heir.fullname" type="text"
                                                :placeholder="`กรุณากรอกชื่อจริงทายาท ${index + 1}`" required />
                                            <span class="icon is-small is-left">
                                                <i class="fas fa-user"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <!-- ปุ่มลบฟิลด์ -->
                                <div
                                    class="column is-2 is-flex is-align-items-flex-start is-align-content-center is-flex-direction-column">
                                    <label class="label has-text-weight-semibold">
                                        <strong class="has-text-danger">&nbsp;</strong>
                                    </label>
                                    <button type="button" class="button is-danger is-medium"
                                        @click="removeHeirField(index)" :disabled="formHeirData.heirs.length === 1">
                                        <div class="field">
                                            <span class="icon">
                                                <i class="fas fa-user-minus"></i>
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </transition-group>

                        <!-- ปุ่มรีเซ็ตและส่งฟอร์ม -->
                        <div class="columns my-3    ">
                            <div class="column is-full">
                                <div class="buttons is-flex is-justify-content-center">
                                    <!-- ปุ่มรีเซ็ต -->
                                    <button type="button" class="button is-warning is-medium is-size-5"
                                        @click="resetForm">
                                        <span class="icon">
                                            <i class="fas fa-undo"></i>
                                        </span>
                                        <span>รีเซ็ต</span>
                                    </button>
                                    <!-- ปุ่มส่งฟอร์ม -->
                                    <button type="submit" class="button is-success is-medium is-size-5">
                                        <span class="icon">
                                            <i class="fas fa-check"></i>
                                        </span>
                                        <span>ส่งข้อมูล</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { store } from '@/store'
import { fetchRelation } from '@/api/apiHeir';
import axios from 'axios';
import { showSuccessAlert, showErrorAlert } from '@/utils/alertFunc';
import { personModel, heirListValidSchema } from '@/model/connectModel';
import { splitFullName } from '@/utils/citizenFunc';

export default {
    data() {
        return {
            formPeople: { ...personModel },
            // formHeirData: getHeirModel,
            formHeirData: {
                heirs: [{ fullname: '', relationSlected: '' }]
            },
            btnLoad: false,
            relationList: [
                { value: "ไม่พบข้อมูล", label: "ไม่พบข้อมูล" },
            ],
        }
    },
    computed: {
        fullnameTrimmed: {
            get() {
                return this.formPeople.fullname.trim();
            },
            set(value) {
                this.formPeople.fullname = value.trim();
            }
        }
    },
    methods: {
        resetForm() {
            this.formHeirData.heirs = [{ fullname: '', relationSlected: '' }]
            this.formPeople = { ...personModel };
            this.errors = {};
        },
        // เพิ่มฟิลด์ input
        addHeirField() {
            if (this.formHeirData.heirs.length < 6) {
                this.formHeirData.heirs.push({ fullname: '', relationSlected: '' });
            }
        },
        // ลบฟิลด์ input
        removeHeirField(index) {
            if (this.formHeirData.heirs.length > 1) {
                this.formHeirData.heirs.splice(index, 1);
            }
        },
        async submitHeirRelation() {
            this.btnLoad = true
            store.status_path_change = true

            console.log("Heirs:", this.formHeirData.heirs);
            console.log("Citizen:", this.formPeople.fullname);
            console.log("Citizen-l:", this.formPeople.fullname.length);

            const { citizen_fname, citizen_lname } = splitFullName(this.formPeople.fullname);
            console.log(citizen_fname, citizen_lname)

            // for (const value of this.formHeirData.heirs) {
            //     console.log(value.fullname);
            //     console.log(value.fullname.trim().length || "");
            // }
            setTimeout(() => {
                store.status_path_change = false;
            }, 2000);

            try {
                const response = await axios.get(`http://localhost:3000/citizen/qf/${citizen_fname || ''}/${citizen_lname || ''}`);
                console.log('Response:', response.data);
                showSuccessAlert()
                this.resetForm();
            } catch (error) {
                if (error.response) {
                    // Check if the status code is 404
                    if (error.response.status === 404) {
                        console.warn('No records found.');
                        await showErrorAlert('ขออภัย','ไม่พบข้อมูลที่ค้นหา');
                    } else {
                        console.error('Error:', error.response.status);
                        await showErrorAlert(`เกิดข้อผิดพลาด: ${error.response.status}`);
                    }
                }
                console.error('Error:', error);
            } finally {
                store.status_path_change = false;
            }

            return;
            const form_data = {
                // relation_select: this.
                prefix_id: this.formHeirData.prefix || null,
                first_name: this.formHeirData.heir_fname || null,
                last_name: this.formHeirData.heir_lname || null,
            };

            console.log("Heir:", form_data)
            console.log("Heir-length:", form_data.last_name.length)

            try {
                const response = await axios.post('http://localhost:3000/heir', form_data);
                console.log('Response:', response.data);
                await showSuccessAlert()
                this.resetForm();
            } catch (error) {
                console.error('Error:', error);
                await showErrorAlert()
            } finally {
                store.status_path_change = false;
            }
        },
        async validateField(field) {
            try {
                const schema = this.getValidationSchema();
                await schema.validateAt(field, this.formLand);
                console.log('field:', field)
                this.errors[field] = ""; // Clear error if valid
            } catch (err) {
                this.errors[field] = err.message; // Set error message
            }
        },
        async validateForm() {
            try {
                const schema = this.getValidationSchema();
                await schema.validate(this.formLand, { abortEarly: false });
                this.errors = {}; // Clear all errors
                return true;
            } catch (err) {
                this.errors = err.inner.reduce((acc, curr) => {
                    acc[curr.path] = curr.message;
                    console.log('check-error:', curr.message)
                    return acc;
                }, {});
                return false;
            }
        },
        async validateField(field) {
            try {
                const schema = this.getValidationSchema();
                await schema.validateAt(field, this.formLand);
                this.errors[field] = ""; // Clear error if valid
            } catch (err) {
                this.errors[field] = err.message; // Set error message
            }
        },
        getValidationSchema() {
            return yup.object().shape({ ...LandValidSchema });
        }
    },
    async mounted() {
        this.relationList = await fetchRelation();
    }
}
</script>

<style scoped>
/* เพิ่มสไตล์ตามต้องการ */
.box {
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    background: linear-gradient(145deg, #ffffff, #f8f9fa);
}

.title {
    color: #3273dc;
    /* สีน้ำเงินของ Bulma */
}

.label {
    color: #363636;
}

.button {
    transition: all 0.5s ease;
    border-radius: 8px;
}

.button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.input {
    border-radius: 8px;
    border: 1px solid #dbdbdb;
}

.input:focus {
    border-color: #3273dc;
    box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25);
}

.icon {
    color: #333;
}

/* Animation สำหรับการเพิ่มและลบฟิลด์ */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s, transform 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
    transform: translateX(-20px);
}

.fade-enter-to,
.fade-leave {
    opacity: 1;
    transform: translateX(0);
}
</style>
