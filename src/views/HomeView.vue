<template>
  <div class="homePage">
    <!-- ส่วนของภาพพื้นหลังและข้อความ -->
    <div class="hero-section">
      <div class="container">
        <div class="hero-text fade-in">
          <h1 class="title is-2 px-3 has-text-white slide-up">
            <span class="icon">
              <i class="fas fa-landmark"></i>
            </span>
             ชุมชนสาธิตวลัยลักษณ์
          </h1>
          <p class="lead slide-up">
            ชุมชนสาธิตวลัยลักษณ์ ตั้งอยู่ในบริเวณ 2 ตําบล คือ ตําบลไทยบุรี และตําบลหัวตะพาน อําเภอท่าศาลา
            จังหวัดนครศรีธรรมราช มีพื้นที่ในชุมชนกว่า 3,600 ไร่
            หน่วยงานที่เกี่ยวข้องได้ให้สํานักงานปฏิรูปที่ดินเพื่อเกษตรกรรมดําเนินการปฏิรูปที่ดินในที่สาธารณประโยชน์ประมาณ
            3,600 ไร่ บริเวณที่ดินทางด้านตะวันตกของมหาวิทยาลัย
            จัดตั้งชุมชนสาธิตสาธิตพัฒนา เมื่อปี พ.ศ. 2538
            เพื่อเป็นที่อยู่อาศัยของที่ได้รับผลกระทบจากการจัดตั้งมหาวิทยาลัยวลัยลักษณ์
          </p>
        </div>
      </div>
    </div>
    <!-- contract -->
    <!-- <div class="container">
      <div class="is-flex is-justify-content-space-between p-4 has-background-light">
        <div class="has-text-primary">xa</div>
        <div class="has-text-danger">
          <p>สอบถามข้อมูล</p>
          <p>
            <span class="icon">
              <i class="fas fa-landmark"></i>
            </span>
            09x-xxx-xxxx</p>
        </div>
      </div>
    </div> -->


  </div>
</template>

<script>

</script>

<style>
/* สไตล์สำหรับหน้า Home */
.homePage {
  min-height: 100vh;
}

/* ส่วนของภาพพื้นหลังและข้อความ */
.hero-section {
  background-image: url("../assets/home-bg.png");
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  background-color: rgba(34, 139, 34, 0.3);
  /* เขียว */
  background-blend-mode: hard-light;

}

/* อนิเมชันให้ hero-text ค่อยๆ จางเข้า */
@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.fade-in {
  opacity: 0;
  animation: fadeIn 1.2s ease-in-out forwards;
}

/* อนิเมชันให้ h1 และ p ค่อยๆ เลื่อนขึ้น */
@keyframes slideUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-up {
  opacity: 0;
  animation: slideUp 1.2s ease-in-out 0.5s forwards;
}

/* สไตล์สำหรับข้อความ */
.hero-text {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 2rem;
  border-radius: 10px;
  max-width: 800px;
  text-align: justify;
  /* จัดข้อความชิดขอบ */
  font-family: "Noto Sans Thai", sans-serif;
  /* ใช้ฟอนต์ที่รองรับภาษาไทย */
  font-feature-settings: "liga" 1, "clig" 1, "dlig" 1, "kern" 1;
}

.hero-text h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.hero-text p {
  font-size: 1.2rem;
  line-height: 1.8;
  word-spacing: 0.05em;
  /* เพิ่มช่องว่างระหว่างคำ */
  letter-spacing: 0.01em;
  /* ปรับระยะห่างตัวอักษร */
  /* text-justify: distribute; */
  /* ปรับข้อความแบบกระจาย */
}

/* สร้าง Overlay */
</style>
