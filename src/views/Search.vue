<template>
  <div class="py-4 search-bg">
    <div v-if="results.length > 0"
      class="card column is-three-quarters-tablet is-one-third-desktop is-four-fifths-mobile"
      style="background-color: #333333; color: white; border-radius: 8px; padding: 16px; max-width: 600px; margin: auto;">
      <header class="card-header" style="width: 100%; background-color: #fff; border-radius: 8px;">
        <p class="card-header-title has-text-centered" style="color: #654321; font-weight: bold; font-size: 26px;">
          รายละเอียดของที่ดิน
        </p>
      </header>
      <div class="card-content">
        <SearchDetail v-for="(item, index) in results" :key="index" :label="item.label" :value="item.value"
          backgroundColor="#fff" textColor="#654321" />
        <!-- lat && long -->
        <footer class="card-footer" v-if="results.length > 0 && (results[0].lat && results[0].long)">
          <a href="#" class="card-footer-item has-text-link" style="color: #a0752d;">ที่ตั้งตำแหน่ง</a>
        </footer>
      </div>
    </div>
    <div class="not-found-container" v-else>
      <div class="not-found-content" style="max-height: 50vh;">
        <h1 class="not-found-title">ขออภัย!</h1>
        <p class="not-found-message" v-if="errorStatus">ระบบขัดข้องชั่วคราว</p>
        <p class="not-found-message" v-else>ไม่พบแปลงที่ดินนี้ "<span class="search-query">{{ keyword }}</span>"</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import SearchDetail from '@/components/SearchDetail.vue';
import { formatPhoneNumber } from '@/utils/commonFunc';
import DOMAIN_NAME from '@/config/domain_setup';

export default {
  components: {
    SearchDetail
  },
  data() {
    return {
      keyword: '',
      results: [], // Initialize as an empty array
      total_rai: 0,
      errorStatus: false
    };
  },
  methods: {
    updateTitle(query) {
      document.title = `ผลการค้นหาสำหรับ: ${query || 'ไม่มีคำค้น'}`;
    },
    async search() {
      try {
        // ใช้ axios เรียก API ที่มี URL ตามที่กำหนด
        const response = await axios.get(`${DOMAIN_NAME}/land/search?q=${this.keyword}`,{
          withCredentials: true
        });
        // console.log('res-data:', response.data.results[0])
        // console.log('res-length:', response.data.results.length)
        if (response.data.results.length > 0) {
          // เก็บผลลัพธ์ที่ได้รับจาก API ลงใน results
          const squareWa = response.data.results[0].square_wa || 0;
          const ngan = response.data.results[0].ngan || 0;
          const rai = response.data.results[0].rai || 0;
          console.log('rai, ngan,square_wa:', rai, ngan, squareWa)
          const textRai = `${rai != 0 ? `${rai} ไร่` : ''} ${ngan != 0 ? `${ngan} งาน` : ''} ${squareWa != 0 ? `${squareWa} ตารางวา` : ''}`;
          this.results = [
            { value: response.data.results[0].tf_number, label: "แปลงเลขที่" },
            { value: response.data.results[0].spk_area, label: "ระวาง ส.ป.ก" },
            { value: response.data.results[0].l_district, label: "ตำบล" },
            {
              value: textRai, label: "พื้นที่"
            },
            { value: this.phoneFormat(response.data.results[0].phone_number || null), label: "เบอร์โทรศัพท์" },
          ]
        } else {
          this.results = [];
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // ในกรณีที่เกิดข้อผิดพลาด สามารถใช้ mock data แทน
        this.errorStatus = true;
        this.results = [];
      }
    },
    phoneFormat(phone_number) {
      return formatPhoneNumber(phone_number)
    }
  },
  beforeRouteEnter(to, from, next) {
    // Set title when the route is first entered
    next(vm => {
      vm.updateTitle(to.query.q);
    });
  },
  beforeRouteUpdate(to, from, next) {
    // Update title when the route query changes
    this.updateTitle(to.query.q);
    next();
  },
  beforeRouteLeave(to, from, next) {
    // Perform clean-up or action before leaving the current route
    console.log("Leaving the search page.");
    // Reset or perform any necessary action
    this.keyword = ""
    this.results = []; // Reset results or any other state
    next();
  },
  watch: {
    '$route.query.q'(newQuery) {
      this.keyword = newQuery || '';
      this.updateTitle(newQuery);
      console.log('new-query:', newQuery)
      if (newQuery == '' || newQuery == null || newQuery == undefined) {
        this.results = []
      } else {
        this.search()
      }
    },    
  },
  async mounted() {
    // Initialize keyword from the query parameter if available
    this.keyword = this.$route.query.q || '';
    if (this.keyword === null || this.keyword === '' ||
      this.keyword === undefined || this.keyword.length == 0) {
      return
    } else {
      await this.search()
    }
  },
};
</script>

<style scoped>
.search-bg {
  position: relative;
  background: #c2b280 url('/src/assets/search-bg1.jpg') no-repeat center;
  background-size: cover;
}

.search-bg::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.1); /* สีขาวโปร่งแสง */
  pointer-events: none; /* ไม่ให้มีผลต่อการคลิก */
}

.land-info {
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.land-info-container {
  background: #37474F;
  width: 100%;
  padding: 15px 28px 3px;
  color: #fff;
}

.land-details {
  border-radius: 15px;
  background: #F5F1F1;
  width: 100%;
  padding-bottom: 13px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.land-title {
  border-radius: 15px 15px 0 0;
  background: #4C3902;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  width: 100%;
  z-index: 10;
  color: #FDFEFF;
  padding: 22px 70px;
  margin: 0;
}

.info-row {
  border-radius: 5px;
  background: #4C3902;
  display: flex;
  width: 100%;
  max-width: 580px;
  gap: 20px;
  justify-content: space-between;
  padding: 14px 32px;
  margin-top: 15px;
}

.location-btn {
  color: #4F70DB;
  background: none;
  border: none;
  cursor: pointer;
  margin-top: 14px;
  font: inherit;
  padding: 10px;
}

.location-btn:hover,
.location-btn:focus {
  text-decoration: underline;
  outline: none;
}

.not-found-container {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  /* background-color: #f2f2f2; */
}

.not-found-content {
  text-align: center;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 500px;
}

.not-found-title {
  font-size: 36px;
  color: #f44336;
  margin-bottom: 20px;
}

.not-found-message {
  font-size: 18px;
  color: #555;
  margin-bottom: 15px;
}

.search-query {
  font-weight: bold;
  color: #2196f3;
}

.not-found-suggestion {
  font-size: 14px;
  color: #777;
  margin-bottom: 25px;
}

.back-button {
  padding: 10px 20px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

@media (max-width: 991px) {
  .land-info-container {
    max-width: 100%;
    font-size: 40px;
    padding: 0 20px;
  }

  .land-details {
    max-width: 100%;
    font-size: 40px;
  }

  .land-title {
    font-size: 26px;
    max-width: 100%;
    padding: 0 20px;
  }

  .info-row {
    max-width: 50%;
    padding: 0 20px;
  }

  .location-btn {
    font-size: 40px;
  }
}
</style>