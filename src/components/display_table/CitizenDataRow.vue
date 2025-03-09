<template>
    <tr>
        <td>{{ index }}</td>
        <td>{{ format_id_card(ct.ID_CARD) }}</td>
        <td>{{ ct.soi }}</td>
        <td>{{ ct.prefix_name + ct.first_name + ' ' + ct.last_name }}</td>
        <td>{{ formatPhoneNumber(ct.phone_number) || '-' }}</td>
        <td>
            {{ ct.house_number + ' หมู่ที่ ' + ct.village_number + ' ต.'+ ct.district }}
        </td>
        <td>
            <div class="button-group">
                <button class="button is-primary" @click="$emit('view-detail', ct.id_land)">
                    <span class="icon">
                        <i class="fas fa-eye"></i>
                    </span>
                </button>
            </div>
        </td>
    </tr>
</template>

<script>
import { formatIDCARD } from '@/utils/commonFunc';

export default {
    props: {
        ct: Object,
        index: Number,
    },
    computed: {

    },
    methods: {
        formatPhoneNumber(phoneNumber) {
            if (!phoneNumber) return '';
            const phoneStr = String(phoneNumber); // Ensure it's a string
            return phoneStr.slice(0, 3) + '-' + phoneStr.slice(3, 6) + '-' + phoneStr.slice(6);
        },
        format_id_card(id_card){
            return formatIDCARD(id_card)
        }
    }
};

</script>

<style scoped>
.button-group {
    display: flex;
    justify-content: center; /* Centers the button horizontally */
    align-items: center; /* Centers content vertically */
}

.button{
    border-radius: 5px;
}
</style>