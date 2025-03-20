<template>
    <div class="primary_content">
        <div class="is-flex is-justify-content-center py-5">
            <div class="box column is-three-quarters-tablet is-three-fifths-desktop is-four-fifths-mobile">
                <h1 class="title has-text-centered is-size-3 has-text-weight-bold py-3">
                    ระบุความสัมพันธ์ระหว่างราษฎรกับทายาท
                </h1>

                <!-- Input -->
                <form @submit.prevent="submitHeirRelation">
                    <div class="container px-5">
                        <!-- ราษฎร -->
                        <div class="columns">
                            <div class="column is-10">
                                <div class="field">
                                    <label class="label is-size-5 has-text-weight-semibold">
                                        ชื่อจริง - นามสกุล (ราษฎร)
                                        <strong class="has-text-danger">*</strong>
                                    </label>
                                    <div class="control has-icons-left">
                                        <input class="input is-medium is-size-5" type="text" v-model="fullnameTrimmed"
                                            placeholder="กรุณากรอกชื่อจริง - นามสกุล" required disabled />
                                        <span class="icon is-small is-left">
                                            <i class="fas fa-user"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- ปุ่มเพิ่มฟิลด์ -->
                        <!-- <div class="columns pt-1">
                            <div class="column is-full">
                                <button type="button" class="button is-primary is-medium is-size-5"
                                    @click="addHeirField" :disabled="formHeirData.heirs.length > 2">
                                    <span class="icon">
                                        <i class="fas fa-user-plus"></i>
                                    </span>
                                    <span>เพิ่ม</span>
                                </button>
                            </div>
                        </div> -->
                        <hr>
                        <!-- ฟิลด์ input ที่เพิ่มเข้ามา dynamically -->
                        <transition-group name="fade" tag="div">
                            <div v-for="(heir, index) in formHeirData.heirs" :key="index"
                                class="columns is-vcentered pt-1">
                                <!-- ชื่อจริง-นามสกุล ของทายาท -->
                                <div class="column is-7">
                                    <div class="field">
                                        <label class="label is-size-5 has-text-weight-semibold">
                                            ชื่อจริง - นามสกุล (ทายาท)
                                            <strong class="has-text-danger">*</strong>
                                        </label>
                                        <div class="control has-icons-left">
                                            <input class="input is-medium is-size-5" v-model="heir.fullname" type="text"
                                                :placeholder="`กรุณากรอกชื่อจริงทายาท`"
                                                @blur="checkPrefix(heir.fullname)" required />
                                            <span class="icon is-small is-left">
                                                <i class="fas fa-user"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <!-- Select สำหรับเลือกความสัมพันธ์ -->
                                <div class="column is-3">
                                    <div class="field">
                                        <label class="label">
                                            <span class="is-size-5">ความสัมพันธ์</span> <strong
                                                class="has-text-danger">*</strong>
                                        </label>
                                        <div class="control">
                                            <div class="select is-fullwidth">
                                                <select v-model="heir.relationSlected" class="is-size-5">
                                                    <option value="" selected>เลือกความสัมพันธ์</option>
                                                    <template v-if="isRelationListVisible">
                                                        <option v-for="pfl in relationList" :key="pfl.value"
                                                            :value="pfl.value">
                                                            {{ pfl.label }}
                                                        </option>
                                                    </template>
                                                    <template v-else>
                                                        <option disabled>กรุณากรอกชื่อจริงทายาทให้ถูกต้อง</option>
                                                    </template>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- ปุ่มลบฟิลด์ -->
                                <div
                                    class="column is-2 is-flex is-align-items-flex-start is-align-content-center is-flex-direction-column">
                                    <label class="label has-text-weight-semibold">
                                        <strong class="has-text-danger">&nbsp;</strong>
                                    </label>
                                    <!-- <button type="button" class="button is-danger is-medium"
                                        @click="removeHeirField(index)" :disabled="formHeirData.heirs.length === 1">
                                        <div class="field">
                                            <span class="icon">
                                                <i class="fas fa-user-minus"></i>
                                            </span>
                                        </div>
                                    </button> -->
                                </div>
                            </div>
                        </transition-group>

                        <!-- ปุ่มรีเซ็ตและส่งฟอร์ม -->
                        <div class="columns my-3    ">
                            <div class="column is-full">
                                <div class="buttons is-flex is-justify-content-center">
                                    <!-- ปุ่มรีเซ็ต -->
                                    <button type="button" class="button is-medium is-size-5" @click="resetForm">
                                        <span>ยกเลิก</span>
                                    </button>
                                    <!-- ปุ่มส่งฟอร์ม -->
                                    <button type="submit" class="button is-success is-medium is-size-5">
                                        <span>บันทึก</span>
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
import { fetchRelationActive, fullCheckMatchHeir, citizenRelatedHeir, getHeirUsingFullName } from '@/api/apiHeir';
import axios from 'axios';
import { showSuccessAlert, showErrorAlert } from '@/utils/alertFunc';
import { personModel, heirListValidSchema } from '@/model/connectModel';
import { checkFullnameMatchCitizen } from '@/api/apiPeople';
import DisplayError from '@/components/form_valid/DisplayError.vue';
// HeirFullnameValidSchema
import { HeirFullnameValidSchema } from '@/model/heirModel';

export default {
    components: {
        DisplayError
    },
    data() {
        return {
            errors: {},
            formPeople: { ...personModel },
            formHeirData: {
                heirs: [{ fullname: '', fname: '', lname: '', relationSlected: '' }] // heir data that is selected
            },
            btnLoad: false,
            relationList: [
                { value: "ไม่พบข้อมูล", label: "ไม่พบข้อมูล" },
            ], // list relation
            relationListClone: [
                { value: "ไม่พบข้อมูล", label: "ไม่พบข้อมูล" },
            ],
            maxHeir: 3,
            isRelationListVisible: false, // ควบคุมการแสดงผลของ relationList
            familyRelations: {
                male: {
                    father: "บิดา",
                    son: "ลูกชาย",
                    olderBrother: "พี่ชาย",
                    youngerBrother: "น้องชาย",
                    grandfather: "ปู่",
                    paternalGrandfather: "ตา",
                    grandson: "หลานชาย",
                    uncle: "อา",
                    spouse: {
                        husband: "สามี"
                    }
                },
                female: {
                    mother: "มารดา",
                    daughter: "ลูกสาว",
                    olderSister: "พี่สาว",
                    youngerSister: "น้องสาว",
                    grandmother: "ย่า",
                    maternalGrandmother: "ยาย",
                    granddaughter: "หลานสาว",
                    auntFatherSide: "ป้า",
                    auntMotherSide: "น้า",
                    cousin: "ลูกพี่ลูกน้อง",
                    spouse: {
                        wife: "ภรรยา"
                    }
                }
            }
        }
    },
    computed: {
        fullnameTrimmed: {
            get() {
                const firstName = this.$route.query.firstName || '';
                const lastName = this.$route.query.lastName || '';
                return `${firstName.trim()} ${lastName.trim()}`;
            },
            set(value) {
                const [firstName, ...lastNameParts] = value.trim().split(' ');
                this.formPeople.firstName = firstName;
                this.formPeople.lastName = lastNameParts.join(' ');
            }
        }
    },
    methods: {
        // valid in form
        async checkPrefix(value) {
            const fullname = value.trim();
            if (fullname === '') {
                alert('กรุณากรอกชื่อจริงทายาท');
                this.isRelationListVisible = false; // ซ่อน relationList
            } else if (fullname.length < 2) {
                alert('ชื่อจริงทายาทต้องมีความยาวอย่างน้อย 2 ตัวอักษร');
                this.isRelationListVisible = false; // ซ่อน relationList
            } else if (!/^[ก-๏\s]+$/.test(fullname)) {
                alert('ชื่อจริงทายาทต้องเป็นภาษาไทยเท่านั้น');
                this.isRelationListVisible = false; // ซ่อน relationList
            } else {
                try {
                    const split_name = this.splitFullName(fullname);
                    console.log('split:', split_name);

                    // ส่งข้อมูลชื่อทายาทไปยังเซิร์ฟเวอร์เพื่อตรวจสอบ
                    const response = await getHeirUsingFullName(split_name);
                    console.log('res-full:', response.data)

                    if (response.data.length == 0) {
                        this.isRelationListVisible = false;
                        alert('ไม่พบทายาทชื่อนี้')
                    } else {
                        if (response.data.length > 0 && response.data[0].prefix_id == 1) {
                            console.log('res-pre:', response.data[0]);
                            console.log('related:', this.relationListClone);

                            // กรองข้อมูลสำหรับเพศชาย โดยใช้ข้อมูลจาก familyRelations.male
                            this.relationList = this.relationListClone.filter(item =>
                                Object.values(this.familyRelations.male).includes(item.label)
                            );
                            this.isRelationListVisible = true;
                            console.log('Filtered relationList (Male):', this.relationList);
                        } else if (response.data.length > 0 && (response.data[0].prefix_id == 2 || response.data[0].prefix_id == 3)) {
                            console.log('res-pre:', response.data[0]);

                            // กรองข้อมูลสำหรับเพศหญิง โดยใช้ข้อมูลจาก familyRelations.female
                            this.relationList = this.relationListClone.filter(item =>
                                Object.values(this.familyRelations.female).includes(item.label)
                            );
                            this.isRelationListVisible = true;
                            console.log('Filtered relationList (Female):', this.relationList);
                        }
                    }
                } catch (error) {
                    console.log('Error checking heir name:', error);
                    alert('เกิดข้อผิดพลาดในการตรวจสอบชื่อทายาท');
                    this.isRelationListVisible = false; // ซ่อน relationList
                }
            }
        },
        resetForm() {
            this.formHeirData.heirs = [{ fullname: '', relationSlected: '' }]
            this.formPeople = { ...personModel };
            this.errors = {};
        },
        // เพิ่มฟิลด์ input
        addHeirField() {
            if (this.formHeirData.heirs.length < this.maxHeir) {
                this.formHeirData.heirs.push({ fullname: '', relationSlected: '' });
            }
        },
        // ลบฟิลด์ input
        removeHeirField(index) {
            if (this.formHeirData.heirs.length > 1) {
                this.formHeirData.heirs.splice(index, 1);
            }
        },
        // บันทึกข้อมูลเข้า db
        async submitHeirRelation() {

            if (!this.formHeirData.heirs[0].relationSlected) {
                await showErrorAlert('เพิ่มข้อมูลไม่สำเร็จ!', 'กรุณาเลือกความสัมพันธ์');
                return;
            }

            this.btnLoad = true

            let Citizen = []
            // เรียกใช้ computed property fullnameTrimmed
            const fullname = this.fullnameTrimmed;
            console.log('full-name:', fullname)
            this.formatFullName(fullname) // ตั้งค่า ชื่อราษฎร ให้ตัวแปรอัตโนมัติ

            try {
                // STEP 1
                // Search citizen match
                // Call function to check if the citizen matches
                const matchCitizen = await checkFullnameMatchCitizen(this.formPeople.firstname, this.formPeople.lastname);
                // If citizen is not found, handle the case
                if (!matchCitizen.status) {
                    await showErrorAlert("ไม่พบราษฎรคนนี้ในระบบ");
                    return
                } else {
                    Citizen = matchCitizen.data
                }
                // console.log('citizen:', Citizen)
                // search match heirs
                for (let index = 0; index < this.formHeirData.heirs.length; index++) {
                    let heir = this.formHeirData.heirs[index];
                    // Call formatFullName for each heir to split fullname into firstname and lastname
                    this.formatFullNameHeir(index);
                }

                // step 2
                let dataFrom = []
                // Call function to check if the citizen matches
                const resHeirs = await fullCheckMatchHeir(this.formHeirData);

                // step 3 check citizen and heir are together.
                const resCitizenRelatedHeirs = await citizenRelatedHeir(Citizen[0].ID_CARD);

                console.log('resCitizenRelatedHeirs', resCitizenRelatedHeirs)
                console.log('resHeirs', resHeirs)

                // If citizen is not found, handle the case
                if (!resHeirs.success) {
                    await showErrorAlert("ไม่พบข้อมูลทายาทดังต่อไปนี้", resHeirs.notFound.map(heir => `${heir.fname} ${heir.lname}`).join(","));
                    return
                } else {
                    dataFrom = resHeirs.heirs
                }

                let mother_father = {
                    relation_father: false,
                    relation_mother: false
                }

                if (resCitizenRelatedHeirs.length > 0) {
                    let found = false;
                    for (let i = 0; i < resCitizenRelatedHeirs.length; i++) {
                        if (resCitizenRelatedHeirs[i].relationship_id === 'relo01') {
                            mother_father.relation_father = true
                        }
                        if (resCitizenRelatedHeirs[i].relationship_id === 'relo02') {
                            mother_father.relation_mother = true
                        }
                        console.log(resCitizenRelatedHeirs[i])
                        if (resCitizenRelatedHeirs[i].heir_id === resHeirs.heirs[0].heir_id) {
                            found = true
                            break
                        }
                    }
                    if (found) {
                        await showErrorAlert('เพิ่มข้อมูลไม่สำเร็จ!', 'ทายาทมีความสัมพันธ์กับราษฎรแล้ว');
                        return
                    }
                }

                if (resHeirs.heirs[0].relationSlected === 'relo01') {
                    if (mother_father.relation_father === true) {
                        await showErrorAlert('เพิ่มข้อมูลไม่สำเร็จ!', 'ทายาทคนนี้มีบิดาอยู่แล้ว');
                        return
                    }
                }

                if (resHeirs.heirs[0].relationSlected === 'relo02') {
                    if (mother_father.relation_mother === true) {
                        await showErrorAlert('เพิ่มข้อมูลไม่สำเร็จ!', 'ทายาทคนนี้มีมารดาอยู่แล้ว!');
                        return
                    }
                }

                const response = await axios.post('http://localhost:3000/heir/all', {
                    heirsRelation: dataFrom,
                    citizenIDCARD: Citizen[0].ID_CARD
                });
                // console.log('Response:', response.data);
                await showSuccessAlert("เชื่อมความสัมพันธ์", response.data.message)
                this.resetForm();
            } catch (error) {
                console.error('Error:', error);
                if (error.response && error.response.status === 400) {
                    // Handle the 400 status (bad request)
                    console.error("Bad request error:", error);
                    await showErrorAlert("ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบข้อมูลและลองใหม่");
                } else {
                    // Handle other unexpected errors
                    console.error("Error:", error);
                    await showErrorAlert("เกิดข้อผิดพลาดในการค้นหาราษฎร");
                }
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
            return yup.object().shape({ ...HeirFullnameValidSchema });
        },
        formatFullName(fullname) {
            // Remove leading/trailing spaces and ensure only one space between names
            let formattedFullName = fullname.trim().replace(/\s+/g, ' ');

            // Check if fullname ends with a space and remove it
            if (formattedFullName.endsWith(' ')) {
                formattedFullName = formattedFullName.trimEnd();
            }

            // Split the formatted full name into parts
            const { firstname, lastname } = this.splitFullName(formattedFullName);
            this.formPeople.firstname = firstname;
            this.formPeople.lastname = lastname;
        },
        // Method to split fullname into firstname and lastname, allowing multiple words for lastname
        splitFullName(fullname) {
            const nameParts = fullname.split(" ");
            const firstname = nameParts[0] || '';
            const lastname = nameParts.slice(1).join(" ") || '';  // Join remaining parts as lastname
            return { firstname, lastname };
        },
        formatFullNameHeir(index) {
            let fullname = this.formHeirData.heirs[index].fullname.trim();

            // Remove any extra spaces between names and ensure only one space
            fullname = fullname.replace(/\s+/g, ' ');

            // Split the full name into first and last names
            const nameParts = fullname.split(" ");
            const firstname = nameParts[0] || '';  // First part is the first name
            const lastname = nameParts.slice(1).join(" ") || '';  // Join remaining parts as the last name

            // Update the heir's first name and last name
            this.formHeirData.heirs[index].fname = firstname;
            this.formHeirData.heirs[index].lname = lastname;
        }
    },
    watch: {
        'formPeople.fullname'(newValue) {
            this.formatFullName(newValue);
        },
        // 'formHeirData.heirs': {
        //     handler: _.debounce(function (newHeirs) {
        //         newHeirs.forEach((heir, index) => {
        //             this.formatFullNameHeir(index);
        //         });
        //     }, 500), // รอ 500ms หลังจากหยุดพิมพ์
        //     deep: true
        // }
    },
    async created() {
        // รับ query parameters จาก URL
        const { firstName, lastName } = this.$route.query;
        console.log('First Name:', firstName);
        console.log('Last Name:', lastName);
        try {
            // ดึงข้อมูล relationList จาก API
            this.relationList = await fetchRelationActive('1');
            this.relationListClone = this.relationList;
            console.log('Relation List:', this.relationList);
        } catch (error) {
            console.error('Error fetching relation list:', error);
            // หากเกิดข้อผิดพลาด ให้กำหนดค่าเริ่มต้น
            this.relationList = [{ value: "ไม่พบข้อมูล", label: "ไม่พบข้อมูล" }];
        }
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
