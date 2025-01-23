<template>
    <div class="formColor">
        <div class="container is-max-widescreen custom-container">
            <!-- People's name -->
            <div class="columns pt-5">
                <div class="column is-2">
                    <div class="field">
                        <label class="label">ความสัมพันธ์</label>
                        <div class="control">
                            <div class="select is-fullwidth">
                                <select v-model="formData.relation" >
                                    <option value="">เลือกความสัมพันธ์</option>
                                    <option v-for="pfl in relationList" :key="pfl.value" :value="pfl.value">
                                        {{ pfl.label }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column is-2">
                    <div class="field">
                        <label class="label">คำนำหน้าชื่อ</label>
                        <div class="control">
                            <div class="select is-fullwidth">
                                <select v-model="formData.prefix" >
                                    <option value="">เลือกคำนำหน้า</option>
                                    <option v-for="pfl in prefixList" :key="pfl.value" :value="pfl.value">
                                        {{ pfl.label }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="column is-4">
                    <div class="field">
                        <label class="label">ทายาท-ชื่อจริง</label>
                        <div class="control">
                            <input class="input is-normal" v-model="formData.fname" type="text"
                                placeholder="กรุณากรอกชื่อจริงทายาท" />
                        </div>
                    </div>
                </div>

                <div class="column is-4">
                    <div class="field">
                        <label class="label">ทายาท-นามสกุล</label>
                        <div class="control">
                            <input class="input is-normal" v-model="formData.lname" type="text"
                                placeholder="กรุณากรอกนามสกุลทายาท" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="columns pt-1">

                <div class="column">
                    <div class="field">
                        <label class="label">ราษฎร-ชื่อจริง</label>
                        <div class="control">
                            <input class="input is-normal" v-model="formPeople.p_first_name" type="text"
                                placeholder="กรุณากรอกชื่อจริง" />
                        </div>
                    </div>
                </div>

                <div class="column">
                    <div class="field">
                        <label class="label">ราษฎร-นามสกุล</label>
                        <div class="control">
                            <input class="input is-normal" v-model="formPeople.p_last_name" type="text"
                                placeholder="กรุณากรอกนามสกุล" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- submit -->
            <button class="button is-dark is-fullwidth" id="submitPeople" @click="creationHeir" :disabled="btnLoad">
                {{ btnLoad ? 'กำลังตรวจสอบ' : 'เพิ่มทายาท' }}
            </button>

        </div>
    </div>
</template>
<script>
import { store } from '@/store'
import axios from 'axios';

export default {

    data() {
        return {
            formData: {
                fname: '',
                lname: '',
                prefix: '',
                relation: '',
                id_card: '',
                phone: '',
                house_number: '',
                village_number: '',
                soi: '',
            },
            formPeople: {
                p_first_name: '',
                p_last_name: '',
            },
            displayDate: '',
            btnLoad: false,
            prefixList: [
                { value: null, label: 'ไม่พบข้อมูล' },
            ],
            relationList: [
                { id:-1,value: "ไม่พบข้อมูล", label: "ไม่พบข้อมูล" },
            ],
        }
    },
    computed: {

    },
    methods: {
        creationHeir() {
            this.btnLoad = true
            store.status_path_change = true
            const form_data = {
                // relation_select: this.
                prefix: this.formData.prefix || null,
                fname_heir: this.formData.fname || null,
                lname_heir: this.formData.lname || null,
                fname_people: this.formPeople.p_first_name,
                lname_people: this.formPeople.p_last_name
            };

            console.log(form_data)

            setTimeout(() => {
                this.btnLoad = false
                store.status_path_change = false
            }, 1000)
        },
        convertToBuddhistEra() {
            if (this.formData.selectedDate) {
                const date = new Date(this.formData.selectedDate);
                const yearBE = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
                const month = date.getMonth() + 1;
                const day = date.getDate();
                this.displayDate = `${day}/${month}/${yearBE}`;
            }
        }
    },
    async mounted() {
        try {
            const response = await axios.get(`http://localhost:3000/people/prefix`);
            const data = response.data; // Handle the response data
            this.prefixList = []
            if (data.length > 0) {
                for (let d of data) {
                    // console.log(d)
                    this.prefixList.push({
                        value: d.prefix_id,
                        label: d.prefix_name
                    },)
                }
                // this.prefixList = data
            }
        } catch (err) {
            this.error = 'Error fetching data: ' + err.message;
        }

        try {
            const relation = await axios.get(`http://localhost:3000/heir/relation`);
            console.log("relation:", relation.data)
            // this.relationList = []
            if(relation.data.length > 0){
                this.relationList = relation.data
            }
        } catch (error) {
            this.error = 'Error fetching data: ' + err.message;
        }
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
    /* background-color: #f9f9f9; */
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

.option{
    border-color: red;
}

#submitPeople {
    background-color: #4e4b32;
}
</style>