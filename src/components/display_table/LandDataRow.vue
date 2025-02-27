<template>
    <tr>
        <td>{{ index }}</td>
        <td>{{ land.number }}</td>
        <td>{{ land.current_soi }}</td>
        <td>{{ land.fullname }}</td>
        <td>{{ formatPhoneNumber(land.phone_number) || '-' }}</td>
        <td>
            <span class="icon" v-if="land.current_land_status === 'LS01'">
                <i class="fas fa-circle has-text-success"></i>
            </span>
            <span class="icon" v-else-if="land.current_land_status === 'LS02'">
                <i class="fas fa-circle has-text-link"></i>
            </span>
            <span class="icon" v-else-if="land.current_land_status === 'LS03'">
                <i class="fas fa-circle has-text-grey"></i>
            </span>
            <span class="icon" v-else-if="land.current_land_status === 'LS04'">
                <i class="fas fa-circle has-text-danger"></i>
            </span>
            <span class="icon" v-else>
                <i class="fas fa-circle has-text-white-bis"></i>
            </span>
            {{ land.land_status_name }}
        </td>
        <td>
            <span class="icon">
                <i v-if="land.active === '1'" class="fas fa-check has-text-success"></i>
                <i v-else class="fas fa-times has-text-danger"></i>
            </span>
            {{ land.active === "1" ? "ใช้สิทธิ์อยู่" : "ถูกยกเลิก" }}
        </td>
        <td>
            <div class="button-group">
                <button class="button is-normal is-primary" @click="$emit('view-detail', land.id_h_land)">
                    <span class="icon">
                        <i class="fas fa-eye"></i>
                    </span>
                </button>
            </div>
        </td>
    </tr>
</template>

<script>
import { formatPhoneNumber } from '@/utils/commonFunc';

export default {
    props: {
        land: Object,
        index: Number,
    },
    computed: {
        usageStatusIcon() {
            return this.land.usageStatus === 1 ? "fas fa-check has-text-success" : "fas fa-times has-text-danger";
        },
        usageStatusText() {
            return this.land.usageStatus === 1 ? "ใช้สิทธิ์อยู่" : "ถูกยกเลิก";
        },
    },
    methods: {
        formatPhoneNumber(phoneNumber) {
            return formatPhoneNumber(phoneNumber)
        }
    }
};
</script>