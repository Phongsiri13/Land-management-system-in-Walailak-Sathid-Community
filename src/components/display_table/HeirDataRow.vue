<template>
    <tr>
        <td>{{ index }}</td>
        <!-- <td>{{ heirs.heir_id }}</td> -->
        <td>{{ heirs.prefix_name + ' ' + heirs.first_name + ' ' + heirs.last_name }}</td>
        <td>
            <div class="button-group">
                <button class="button is-rounded is-normal is-primary" @click="$emit('view-detail', heirs.id_land)">
                    <span class="icon">
                        <i class="fas fa-eye"></i>
                    </span>

                </button>
            </div>
        </td>
    </tr>
</template>

<script>
export default {
    props: {
        heirs: Object,
        index: Number,
    },
    computed: {

    },
    methods: {
        formatPhoneNumber(phoneNumber) {
            if (!phoneNumber) return '';
            const phoneStr = String(phoneNumber); // Ensure it's a string
            return phoneStr.slice(0, 3) + '-' + phoneStr.slice(3, 6) + '-' + phoneStr.slice(6);
        }
    }
};
</script>

<style scoped>
.button-group {
    display: flex;
    justify-content: center;
    /* Centers the button horizontally */
    align-items: center;
    /* Centers content vertically */
}

.button {
    border-radius: 5px;
}
</style>