<template>
  <div>
    <div class="help-center">
      <div class="container">
        <h2 class="title">Hi! How can we help You?</h2>
        <div class="search-bar">
          <input v-model="keyword" class="search-input" placeholder="ค้นหา แปลงที่ดิน หรือ ชื่อ" />
          <button class="search-button" @click="search">Search</button>
        </div>
        <!-- <RouterLink :to="{ path: '/search', query: { term: 'keyword' } }">ค้นหา</RouterLink> -->
      </div>
      <br>
      <!-- display search results -->
      <div class="container" v-if="results && results.length !== 0">
        <div class="card">
          <div class="card-content">
            <div class="content">
              <ul>
                <li v-for="item in results" :key="item.id">{{ item.name }}</li>
                <li v-if="results.length === 0">No results found.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      keyword: '',
      mockData: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Alice Johnson' },
      ],
      results: [] // Initialize as an empty array
    };
  },
  methods: {
    search() {
      console.log('why')
      // This method could also navigate to a new route if needed
      this.$router.push({ path: '/search', query: { q: this.keyword } });
      this.results = [...this.mockData]
    },
    updateResults() {
      console.log('xaxa')
      // Update results based on the current keyword
      this.results = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Alice Johnson' },
      ]
    },
  },
  watch: {
    '$route.query.q'(newQuery) {
      this.keyword = newQuery || '';
      console.log('new-query:', newQuery)
      if (newQuery == '' || newQuery == null || newQuery == undefined) {
        this.results = []
      }
      // Reset results to empty array if no query parameter
      // this.results = newQuery ? this.updateResults() : [];
    },
    results(newResults) {
      console.log('Results have changed:', newResults);
      // Add any additional logic here based on the new results
    },
  },
  mounted() {
    // Initialize keyword from the query parameter if available
    this.keyword = this.$route.query.q || '';

    // Reset results to empty array if no query parameter
    // this.results = this.keyword ? this.updateResults() : [];
    // console.log('hihi,:', this.keyword)
    // console.log('hihi,:', this.keyword == '')
    // console.log('hihi2,:', this.keyword.length)

    if(this.keyword === null || this.keyword === '' || 
    this.keyword === undefined || this.keyword.length == 0){
      return
    }else{
      this.updateResults()
    }
  },
};
</script>

<style scoped>
.help-center {
  padding-top: 25px;
  min-height: 100vh;
  background-color: #0000ff;
}

.container {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.title {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  /* align-items: center; */
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px 0 0 8px;
  outline: none;
}

.search-button {
  padding: 10px;
  background-color: #6a5acd;
  color: #fff;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
}

.options {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.option-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 80px;
  margin: 5px;
  color: #333;
  transition: background-color 0.3s;
}

.option-item:hover {
  background-color: #e0e0e0;
}

.option-item i {
  font-size: 24px;
  margin-bottom: 5px;
  color: #007bff;
}

.option-item span {
  font-size: 14px;
}
</style>