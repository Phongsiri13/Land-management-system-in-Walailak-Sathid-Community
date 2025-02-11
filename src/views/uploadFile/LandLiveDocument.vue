<template>
    <div class="container">
      <div class="box">
        <div class="columns is-multiline is-mobile">
          <!-- File Drop Area -->
          <div class="column is-half-tablet is-full-mobile">
            <div class="file-drop-area" @click="openFilePicker" @dragover.prevent @drop="handleDrop">
              <div class="upload-icon">
                <i class="fas fa-cloud-upload-alt"></i>
              </div>
              <p>ลากไฟล์มาที่นี่ หรือคลิกเพื่ออัปโหลด</p>
              <input type="file" multiple ref="fileInput" @change="handleFileSelect" hidden />
            </div>
          </div>
  
          <!-- Upload List -->
          <div class="column is-half-tablet is-full-mobile">
            <h3 class="title is-5">📂 ไฟล์ที่อัปโหลดภาพที่อยู่อาศัย</h3>
            <div class="upload-list">
              <div v-for="file in sortedFiles" :key="file.id" class="upload-item my-2">
                <span class="icon">
                  <i v-if="file.type.includes('image')" class="fas fa-image"></i>
                  <i v-else class="fas fa-file-alt"></i>
                </span>
                <div class="file-info">
                  <a :href="generateDownloadLink(file)" class="file-name" download>
                    {{ file.name }} <small>({{ formatSize(file.size) }})</small>
                  </a>
                  <progress class="progress is-primary" :value="file.progress" max="100"></progress>
                  <small v-if="file.progress < 100">{{ file.progress }}% - {{ file.speed }}/sec</small>
                  <small v-else class="completed-text">✅ Completed</small>
                </div>
                <button class="delete" @click="removeFile(file)"></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        files: []
      };
    },
    mounted() {
      this.fetchExistingFiles();
    },
    computed: {
      sortedFiles() {
        return [...this.files].sort((a, b) => b.id - a.id);
      }
    },
    methods: {
      fetchExistingFiles() {
        setTimeout(() => {
          this.files = [
            { id: 1, name: "Photo.png", size: 7.5 * 1024 * 1024, type: "image/png", progress: 100, speed: "Completed" },
            { id: 2, name: "Task.doc", size: 2 * 1024 * 1024, type: "application/msword", progress: 100, speed: "Completed" },
            { id: 3, name: "Dashboard.png", size: 1.4 * 1024 * 1024, type: "image/png", progress: 100, speed: "Completed" }
          ];
        }, 1000);
      },
      openFilePicker() {
        this.$refs.fileInput.click();
      },
      handleFileSelect(event) {
        this.addFiles(event.target.files);
      },
      handleDrop(event) {
        this.addFiles(event.dataTransfer.files);
      },
      addFiles(fileList) {
        for (const file of fileList) {
          this.uploadFile(file);
        }
      },
      uploadFile(file) {
        const upload = {
          id: Date.now(),
          name: file.name,
          size: file.size,
          type: file.type,
          progress: 0,
          speed: "0 KB"
        };
  
        this.files.unshift(upload);
  
        const interval = setInterval(() => {
          if (upload.progress >= 100) {
            clearInterval(interval);
          } else {
            upload.progress += Math.floor(Math.random() * 15) + 5;
            upload.speed = `${Math.floor(Math.random() * 200) + 50} KB`;
            if (upload.progress > 100) upload.progress = 100;
          }
        }, 500);
      },
      removeFile(file) {
        this.files = this.files.filter(f => f.id !== file.id);
      },
      formatSize(size) {
        return (size / (1024 * 1024)).toFixed(1) + " MB";
      },
      generateDownloadLink(file) {
        return `https://example.com/download/${file.id}`;
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 900px;
    margin: auto;
    padding: 20px;
  }
  
  .box {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
  
  .file-drop-area {    
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 2px dashed rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    text-align: center;
    width: 100%;
    min-height: 350px;
    border-color: gray;
  }
  
  .file-drop-area:hover {
    border-color: #3273dc;
    background: rgba(255, 255, 255, 0.2);
  }
  
  .upload-icon {
    font-size: 50px;
    color: #3273dc;
    margin-bottom: 10px;
  }
  
  .upload-list {
    max-height: 300px;
    overflow-y: auto;
    /* background: rgba(255, 255, 255, 0.2); */
    padding: 10px;
    border-radius: 12px;
    /* box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); */
  }
  
  .upload-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.1);
    transition: transform 0.2s ease-in-out;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  }
  
  .upload-item:hover {
    transform: scale(1.02);
    background: rgba(255, 255, 255, 0.2);
  }
  
  .file-info {
    flex-grow: 1;
  }
  
  .file-name {
    font-weight: bold;
    color: #3273dc;
    text-decoration: none;
    cursor: pointer;
  }
  
  .file-name:hover {
    text-decoration: underline;
  }
  
  .progress {
    height: 6px;
    border-radius: 5px;
  }
  
  .completed-text {
    color: #28a745;
    font-weight: bold;
  }
  
  .upload-list::-webkit-scrollbar {
    width: 8px;
  }
  
  .upload-list::-webkit-scrollbar-thumb {
    background: rgba(50, 115, 220, 0.7);
    border-radius: 4px;
  }
  
  .upload-list::-webkit-scrollbar-thumb:hover {
    background: rgba(50, 115, 220, 1);
  }
  </style>
  