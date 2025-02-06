<template>
    <tr>
        <td>{{ index }}</td>
        <td>{{ land.number }}</td>
        <td>{{ land.current_soi }}</td>
        <td>{{ land.fullname }}</td>
        <td>{{ formatPhoneNumber(land.phone_number) || '-' }}</td>
        <td>
            <span class="icon">
                <i class="fas fa-circle has-text-success"></i>
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
                <button class="button is-normal is-primary" @click="$emit('view-detail', land.id_land)">
                    <span class="icon">
                        <i class="fas fa-eye"></i>
                    </span>
                    <span>ดู</span>
                </button>
            </div>
        </td>
    </tr>
</template>

<script>
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
            if (!phoneNumber) return '';
            const phoneStr = String(phoneNumber); // Ensure it's a string
            return phoneStr.slice(0, 3) + '-' + phoneStr.slice(3, 7) + '-' + phoneStr.slice(7);
        }
    }
};
</script>