<template>
    <div>

    </div>
</template>

<script>
export default {
    name: 'SearchDetail',
    props: {
        label: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        backgroundColor: {
            type: String,
            default: '#5a4518' // สีพื้นหลังเริ่มต้น
        },
        textColor: {
            type: String,
            default: 'white' // สีข้อความเริ่มต้น
        }
    }
}
</script>

<style scoped></style>