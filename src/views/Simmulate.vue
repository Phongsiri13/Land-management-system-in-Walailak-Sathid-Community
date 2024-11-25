<template>
  <div class="my-3 mx-2">

    <div class="columns pt-3">
      <div class="column is-4">
        <div class="field">
          <!-- Display document files  -->
          <div v-if="fileNames.length" class="file-box has-background-success p-3 is-rounded">
            <h3>Selected Files:</h3>
            <ul>
              <li v-for="(file, index) in fileNames" :key="index">
                <img v-if="isImage(file.type)" :src="file.preview" :alt="file.name" class="thumbnail" />
                <img v-else-if="isPDF(file.type)" src="\src\assets\pdf_logo.png" alt="PDF" class="pdf-icon" />
                <button class="delete is-small" @click="removeFile(index)"></button>
                {{ file.name }}
              </li>
            </ul>
          </div>
          <!-- Add document -->
          <form @submit.prevent="handleSubmit">
            <div class="field">
              <label class="label">Upload เอกสาร</label>
              <div class="control">
                <input ref="fileInput" class="input is-normal" type="file" multiple @change="handleFileUpload" />
              </div>
            </div>
            <div class="field">
              <div class="control">
                <button class="button is-primary" type="submit">เพิ่มเอกสาร</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div class="column is-4">
        <div class="field">
          <!-- Display document files  -->
          <div v-if="fileNames.length" class="file-box has-background-success p-3 is-rounded">
            <h3>Selected Files:</h3>
            <ul>
              <li v-for="(file, index) in fileNames" :key="index">
                <img v-if="isImage(file.type)" :src="file.preview" :alt="file.name" class="thumbnail" />
                <img v-else-if="isPDF(file.type)" src="\src\assets\pdf_logo.png" alt="PDF" class="pdf-icon" />
                <button class="delete is-small" @click="removeFile(index)"></button>
                {{ file.name }}
              </li>
            </ul>
          </div>
          <form @submit.prevent="handleSubmit">
            <div class="field">
              <label class="label">Upload ภาพที่อยู่อาศัย</label>
              <div class="control">
                <input ref="fileInput" class="input is-normal" type="file" multiple @change="handleFileUpload" />
              </div>
            </div>

            <div class="field">
              <div class="control">
                <button class="button is-primary" type="submit">เพิ่มภาพที่อยู่อาศัย</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div class="column is-4">
        <div class="field">
          <!-- Display document files  -->
          <div v-if="fileNames.length" class="file-box has-background-success p-3 is-rounded">
            <h3>Selected Files:</h3>
            <ul>
              <li v-for="(file, index) in fileNames" :key="index">
                <img v-if="isImage(file.type)" :src="file.preview" :alt="file.name" class="thumbnail" />
                <img v-else-if="isPDF(file.type)" src="\src\assets\pdf_logo.png" alt="PDF" class="pdf-icon" />
                <button class="delete is-small" @click="removeFile(index)"></button>
                {{ file.name }}
              </li>
            </ul>
          </div>
          <form @submit.prevent="handleSubmit">
            <div class="field">
              <label class="label">Upload ข้อมูลส่วนตัว</label>
              <div class="control">
                <input ref="fileInput" class="input is-normal" type="file" multiple @change="handleFileUpload" />
              </div>
            </div>

            <div class="field">
              <div class="control">
                <button class="button is-primary" type="submit">เพิ่มข้อมูลส่วนตัว</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      fileNames: [] // Store the uploaded file objects
    }
  },
  methods: {
    handleFileUpload(event) {
      const files = event.target.files
      this.fileNames = Array.from(files).map((file) => ({
        name: file.name,
        type: file.type,
        preview: URL.createObjectURL(file) // Create a preview URL for the image
      }))
    },
    handleSubmit() {
      // Handle the file upload submission logic here
      console.log('Files submitted:', this.fileNames)
    },
    isImage(type) {
      return type.startsWith('image/') // Check if the file type is an image
    },
    isPDF(type) {
      return type === 'application/pdf' // Check if the file type is PDF
    },
    removeFile(index) {
      this.fileNames.splice(index, 1) // Remove the file from the list
      this.updateFileInput() // Clear the file input if all files are removed
    },
    updateFileInput() {
      const input = this.$refs.fileInput
      console.log(input)
      console.log(input.files.length)
      if (input.files.length === 0) {
        input.value = '' // Clear the file input value
      }
    }
  }
}
</script>

<style scoped>
.file-box {
  min-height: 100px;
}

.thumbnail {
  width: 50px;
  /* Set the width of the thumbnail */
  height: auto;
  /* Maintain aspect ratio */
  margin-left: 10px;
  /* Space between filename and image */
}

.pdf-icon {
  width: 35px;
  /* Set the width of the PDF icon */
  height: auto;
  /* Maintain aspect ratio */
  margin-left: 10px;
  /* Space between filename and icon */
}
</style>

<!-- \src\assets\pdf_logo.png -->
