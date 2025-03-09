<template>
    <div class="content citizen-dashboard-bg py-5">
        <!-- Header Section -->
        <div class="dashboard-box is-primary container card px-5 my-2">
            <div class="columns is-centered is-mobile">
                <div class="column is-narrow has-text-centered">
                    <div class="has-background-white mt-2 py-3 px-5" style="border-radius: 5px;">
                        <h2 class="title is-2 has-text-link" style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);">
                            สรุปผลการใช้ประโยชน์จากที่ดินในชุมชนสาธิต</h2>
                    </div>
                    <!-- filter sois -->
                    <div v-if="userRole === roles[3].role_id || userRole === roles[1].role_id"
                        class="select ">
                        <select v-model="selectedSoi" @change="selectOption">
                            <option value="" selected>ทั้งหมด</option>
                            <option v-for="soi in sois" :key="soi.value" :value="soi.value" @change="selectOption">
                                {{ soi.label }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Dashboard values -->
            <div v-if="isActive">
                <!-- label dashboard -->
                <div class="px-2 columns is-multiline is-mobile">
                    <div v-for="(landUsage, index) in titleLandUsage" :key="index"
                        class="column is-6-mobile is-3-tablet is-3-desktop">
                        <div class="card">
                            <div class="card-content">
                                <h4 class="title is-4 has-text-centered has-text-dark">
                                    <img width="28" height="28" :src="getDefaultPhoto(landUsage.value)"
                                        alt="">
                                    {{ landUsage.label }}
                                </h4>
                                <h4 class="title is-4 has-text-centered has-text-dark">
                                    <!-- Dynamically bind the correct key for each landUsage value -->
                                    {{ getTotalLandUsage(landUsage.value) }}
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="px-2 columns is-variable is-4 is-multiline">
                    <!-- Pie Chart Column -->
                    <div class="column is-12-mobile is-6-tablet is-6-desktop">
                        <div class="card">
                            <div class="card-content">
                                <div class="content chart-container">
                                    <Pie :data="chartDataPie" :options="chartOptionsPie" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Bar Chart Column -->
                    <div class="column is-12-mobile is-6-tablet is-6-desktop">
                        <div class="card">
                            <div class="card-content">
                                <div class="content chart-container">
                                    <div class="is-mx-3">
                                        <Bar :data="chartData2" :options="chartOptions2" class="chart-card" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="is-flex is-flex-direction-column is-justify-content-center is-align-items-center">
                    <!-- <p class="title is-3 has-text-danger">โหลดข้อมูลไม่สำเร็จ</p> -->
                    <button :class="reload ? 'is-loading' : ''" @click="redoLoad"
                        class="button is-flex is-flex-direction-column is-align-items-center is-justify-content-center"
                        style="text-align: center;border-radius: 5px;">
                        <i class="fas fa-redo-alt"></i>
                        <p>โหลดข้อมูลใหม่</p>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { defineComponent } from 'vue'
import { Bar, Pie } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement
} from 'chart.js'
import { fetchLandUseDashboard, fetchSois, fetchOneLandUseDashboard } from '@/api/apiLand';
import { fetchLandUsageActive } from '@/api/apiHeir';
import { useUserStore } from '@/stores/useUserStore';
import { store } from '@/store';
import roles from '@/role_config';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

export default defineComponent({
    components: { Bar, Pie },
    data() {
        return {
            selectedSoi: "",
            sois: [],
            reload: false,
            summariesLandUse: {

            },
            titleLandUsage: {},
            roles,
            isActive: false,
            // Define static chart options and pie chart data in data()
            chartOptions2: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                        beginAtZero: true
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true
                    }
                },
                layout: {
                    padding: { left: 0, right: 0, top: 0, bottom: 0 }
                },
                plugins: { legend: { display: false } }
            },
            chartOptionsPie: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        onClick: (e, legendItem, legend) => {
                            const chart = legend.chart;
                            const datasetIndex = legendItem.datasetIndex;
                            const meta = chart.getDatasetMeta(datasetIndex);

                            if (meta.data[legendItem.index]) {
                                // Toggle visibility of the slice
                                const currentVisibility = meta.data[legendItem.index].hidden;
                                meta.data[legendItem.index].hidden = !currentVisibility;

                                // Recalculate and update chart
                                chart.update();
                            }
                        }
                    },
                    tooltip: { enabled: true }
                }
            }
        }
    },
    computed: {
        enhancedSummariesLandUse() {
            return this.summariesLandUse.map((item) => ({
                ...item,
                photo: item.photo || this.getDefaultPhoto(item.usage_id) // ใช้รูป default ถ้าไม่มี photo
            }));
        },
        // Define chartData2 as a computed property so it always reflects summariesLandUse values.
        chartData2() {
            return {
                labels: this.titleLandUsage.map(landUsage => landUsage.label), // Dynamically set labels
                datasets: [
                    {
                        backgroundColor: ['#41B883', '#FFA500', '#00D8FF', '#FF6347'],
                        data: this.titleLandUsage.map(landUsage => {
                            // Find the corresponding count for each landUsage label
                            const usageData = this.summariesLandUse.find(item => item.usage_id === landUsage.value);
                            return usageData ? usageData.count : 0; // Return the count or 0 if not found
                        })
                    }
                ]
            };
        },
        chartDataPie() {
            return {
                labels: this.titleLandUsage.map(landUsage => landUsage.label), // Dynamically set labels
                datasets: [
                    {
                        backgroundColor: ['#41B883', '#FFA500', '#00D8FF', '#FF6347'],
                        data: this.titleLandUsage.map(landUsage => {
                            // Find the corresponding count for each landUsage label
                            const usageData = this.summariesLandUse.find(item => item.usage_id === landUsage.value);
                            return usageData ? usageData.count : 0; // Return the count or 0 if not found
                        })
                    }
                ]
            };
        }
        ,
        userRole() {
            const userStore = useUserStore();
            return userStore.userRole;
        }
    },
    methods: {
        getDefaultPhoto(usageId) {
            const defaultPhotos = {
                LU01: "/src/assets/icons/dashboard_icon/rubber.png",
                LU02: "/src/assets/icons/dashboard_icon/tree.png",
                LU03: "/src/assets/icons/dashboard_icon/livestock.png",
                LU04: "/src/assets/icons/dashboard_icon/other.png"
            };
            return defaultPhotos[usageId] || "/src/assets/icons/dashboard_icon/no_types.png";
        },
        getTotalLandUsage(usageId) {
            // Search for the corresponding land usage object in summariesLandUse array
            const landUsage = this.summariesLandUse.find(item => item.usage_id === usageId);

            // Return the count if found, otherwise return 0
            return landUsage ? landUsage.count : 0;
        },
        async exportToPDF() {
            // เลือกเฉพาะส่วนที่ต้องการส่งออก (ยกเว้นปุ่ม)
            const element = document.querySelector('.dashboard-box');
            if (!element) return;

            try {
                // ซ่อนปุ่ม "ส่งออกเป็น PDF" ชั่วคราว
                const exportButton = document.querySelector('.has-text-centered.mt-4');
                if (exportButton) {
                    exportButton.style.display = 'none';
                }

                // จับภาพหน้าจอของส่วนที่ต้องการ
                const canvas = await html2canvas(element, {
                    scale: 2, // เพิ่มความละเอียดของภาพ
                    useCORS: true, // อนุญาตให้ใช้ CORS สำหรับการโหลดรูปภาพ
                });

                // แสดงปุ่ม "ส่งออกเป็น PDF" กลับมา
                if (exportButton) {
                    exportButton.style.display = 'block';
                }

                // สร้าง PDF
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 210; // ความกว้างของ A4 ในหน่วย mm
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                pdf.save('dashboard.pdf');
            } catch (error) {
                console.error('Error exporting to PDF:', error);

                // แสดงปุ่ม "ส่งออกเป็น PDF" กลับมาในกรณีเกิดข้อผิดพลาด
                const exportButton = document.querySelector('.has-text-centered.mt-4');
                if (exportButton) {
                    exportButton.style.display = 'block';
                }
            }
        },
        async redoLoad() {
            console.log('reload')
            this.reload = true;
            try {
                const res_dash = await fetchOneLandUseDashboard(this.selectedSoi == ''? -1:this.selectedSoi);
                this.summariesLandUse = res_dash;
                this.isActive = true
            } catch (error) {
                console.log(error)
            } finally {
                this.reload = false;
            }
        },
        toggleDropdown() {
            this.isActive = !this.isActive;
        },
        async selectOption() {
            console.log(`Selected: `, this.selectedSoi);
            try {
                const res_dash = await fetchOneLandUseDashboard(typeof this.selectedSoi === 'string' && this.selectedSoi.trim() === '' ? '-1' : this.selectedSoi);
                this.summariesLandUse = res_dash;
                this.isActive = true;
            } catch (error) {
                this.isActive = false;
            }
        }
    },
    async created() {
        try {
            this.sois = await fetchSois();
            const res = await fetchOneLandUseDashboard();
            const res_dashboard = await fetchLandUsageActive('1');
            this.titleLandUsage = res_dashboard;

            // console.log('res-dash:', res_dashboard);
            this.summariesLandUse = res;
            console.log('res-dash:', res);
            this.isActive = true;
        } catch (error) {
            console.error(error);
        }

        // ChartJS configuration
        ChartJS.defaults.plugins.tooltip.enabled = true;
        ChartJS.register({
            id: 'show-percentages',
            afterDatasetsDraw(chart) {
                if (chart.config.type === 'pie' || chart.config.type === 'doughnut') {
                    const ctx = chart.ctx;
                    chart.data.datasets.forEach((dataset, i) => {
                        const meta = chart.getDatasetMeta(i);

                        // Calculate the total only for visible slices
                        const total = dataset.data.reduce((acc, value, index) => {
                            return !meta.data[index].hidden ? acc + value : acc;
                        }, 0);

                        meta.data.forEach((element, index) => {
                            if (!element.hidden) {
                                const dataValue = dataset.data[index];
                                const percentage = ((dataValue / total) * 100).toFixed(2);

                                // Only display the percentage if it's greater than 0
                                if (percentage > 0) {
                                    const position = element.tooltipPosition();
                                    ctx.fillStyle = '#000'; // Set font color to black
                                    ctx.font = 'bold 12px Arial';
                                    ctx.fillText(`${percentage}%`, position.x, position.y);
                                }
                            }
                        });
                    });
                }
            }
        });
    }
});
</script>

<style scoped>
.citizen-dashboard-bg {
    background-color: #c2b280;
}

/* Add margin for mobile screens */
@media screen and (max-width: 768px) {
    .is-mx-3 {
        margin-left: 1rem;
        margin-right: 1rem;
    }
}

.card {
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;
}

.card-content {
    padding: 1.5rem;
}

.chart-card {
    width: 100%;
    height: 100%;
}

.chart-container {
    display: flex;
    justify-content: center;
    /* width: 100%; */
    height: 400px;
    /* Fixed height to make charts same size */
    background-color: #fff;
}

#scope-chart {
    background-color: rebeccapurple;
}

.dashboard-box {
    min-height: 100vh;
    /* background: rgba(128, 128, 128, 0.6); */
    /* background: rgba(255, 253, 208, 0.5); */
    /* background: rgba(255, 239, 174, 0.5);  */
    /* background: rgba(255, 241, 178, 0.5);  */
}

@media (max-width: 768px) {
    .columns.is-variable.is-4 .column {
        padding: 0.5rem;
    }

    .column.is-12-tablet {
        max-width: 100%;
    }
}
</style>