<template>
    <div>
        <PersonalInfo :formData="formData" :errors="errors" :prefixList="prefixList" :validateField="validateField" />
        <ContactInfo :formData="formData" :errors="errors" :validateField="validateField" />
        <AddressInfo :formData="formData" :errors="errors" :village="village" :sois="sois"
            :validateField="validateField" @update-village-options="updateVillageOptions" />
        <FormActions :resetForm="resetForm" />
    </div>
</template>

<script>
import PersonalInfo from "./PersonalInfo.vue";
import ContactInfo from "./ContactInfo.vue";
import AddressInfo from "./AddressInfo.vue";
import FormActions from "./FormActions.vue";

export default {
    components: {
        PersonalInfo,
        ContactInfo,
        AddressInfo,
        FormActions,
    },
    props: {
        formData: Object,
        errors: Object,
        prefixList: Array,
        village: Array,
        sois: Array,
        validateField: Function,
        updateVillageOptions: Function,
        resetForm: Function,
    },
};
</script>