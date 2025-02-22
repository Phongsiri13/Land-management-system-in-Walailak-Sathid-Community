<template>
    <div class="primary_content">
        <div class="mx-5 py-5 is-flex is-justify-content-center">
            <div class="box column is-three-quarters-tablet is-two-thirds-desktop is-full-mobile">
                <div class="py-2 is-flex 
                is-justify-content-space-between">
                    <h2 class="title has-text-primary px-3 is-size-3">ข้อมูลทายาท</h2>
                    <h2 class="has-text-weight-semibold is-size-6">
                        วันที่สร้าง: {{ ToThaiDate(new Date(formHeirData.created)) || '-' }}
                    </h2>
                </div>

                <div class="is-flex is-justify-content-flex-end">
                    <!-- Edit -->
                    <button class="button is-warning px-5 my-3 btn-menu" @click="goToEdit(formHeirData[0]?.ID_CARD)">
                        <span class="icon"><i class="fas fa-pencil-alt"></i></span>
                        <span>แก้ไข</span>
                    </button>
                </div>

                <div class="columns is-multiline px-3">
                    <div class="column is-full">
                        <div class="box has-background-success py-3 px-4 is-flex is-align-items-center">
                            <span class="has-text-weight-semibold is-size-5">ชื่อ:</span>
                            <span class="ml-3 is-size-5">{{ formHeirData.prefix || '-' }}{{ formHeirData.firstName
                                || '-' }}
                                {{ formHeirData.lastName || '-' }}
                            </span>
                        </div>
                    </div>
                </div>

                <hr>
                <h2 class="has-text-dark my-3 px-3 is-size-4">ราษฎรที่มีความสัมพันธ์กับทายาทผู้นี้</h2>
                <div v-if="peopleList.length > 0">
                    <div v-for="(person, index) in peopleList" :key="index" class="box">
                        <p class="has-text-weight-bold">ราษฎรคนที่: {{ ++index }}</p>
                        <p class="has-text-weight-bold">ความสัมพันธ์: ราษฎรผู้นี้เป็น{{ person.label }} ของ
                            {{ formHeirData.firstName || '-' }} {{ formHeirData.lastName || '-' }}</p>
                        <p class="title is-4">{{ person.citizen_first_name }} {{ person.citizen_last_name }}</p>
                    </div>
                </div>
                <div v-else>
                    <div class="notification is-info">
                        <h2 class="title is-4 has-text-centered">ทายาทผู้ในยังไม่มีใครเป็นราษฎร</h2>
                    </div>
                </div>


            </div>
        </div>
    </div>
</template>


<script>
import axios from 'axios';
import { convertToThaiDate } from '@/utils/commonFunc';
import { fetchPrefix } from '@/api/apiPeople';
import { showErrorAlert } from '@/utils/alertFunc';

export default {
    data() {
        return {
            formHeirData: [],
            peopleList: [],
            prefixName: ''
        }
    },
    methods: {
        ToThaiDate(date) {
            return convertToThaiDate(date)
        },
        goToEdit(id) {
            this.$router.push({ name: 'HeirEdit', params: { id } });
        }
    },
    async created() {
        try {
            const heirId = this.$route.params.id;
            const prefixes = await fetchPrefix();
            console.log('prefixList:', prefixes);
            const response = await axios.get(`http://localhost:3000/heir/${heirId}`);
            this.formHeirData = { ...response.data[0] }
            console.log('person:', response.data[0])
            const originalData = response.data[0]
            if (response.data.length <= 0) {
                await showErrorAlert('ไม่พบทายาทคนนี้');
                return;
            }
            // ฟิลเตอร์ข้อมูลที่ตรงกับ prefix_id ของ originalData
            const prefix = prefixes.find(item => item.value === originalData.prefix_id);

            if (prefix) {
                this.prefixName = prefix.label;
            }
            this.formHeirData = {
                HEIR_ID: originalData.heir_id,
                prefix: this.prefixName || "",
                firstName: originalData.first_name || "",
                lastName: originalData.last_name || "",
                created: originalData.created_at || '-'
            };
            const resConnectRelation = await axios.get(`http://localhost:3000/heir/related_heir/${heirId}`);
            console.log('le:', resConnectRelation.data)
            try {
                if (resConnectRelation.data[0].relationships) {
                    console.log('h');
                    this.peopleList = resConnectRelation.data[0].relationships
                }
            } catch (error) {
                console.error('Error:', error);
                console.log('Data is missing or invalid');
            }
        } catch (error) {
            console.error('Error fetching person data:', error);
        }
    }
}
</script>

<style scoped>
    .button{
        border-radius: 5px;
    }
</style>