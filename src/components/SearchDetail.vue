<template>
  <div>
    <div class="field">
      <label class="label has-text-light">{{ label }}</label>
      <div class="control">
        <div class="box cont" :style="{ backgroundColor: backgroundColor, color: textColor }">
          <span class="value-text">{{ value }}</span>
        </div>
      </div>
    </div>
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

<style scoped>
.field {
  margin-bottom: 1.5rem;
}

.label {
  font-size: 1.2rem;
  font-weight: 600;
  color: #4a4a4a;
  margin-bottom: 0.5rem;
}

.cont {
  font-size: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.cont:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(116, 11, 11, 0.15);
}

.value-text {
  font-weight: 500;
  letter-spacing: 0.5px;
}
</style>