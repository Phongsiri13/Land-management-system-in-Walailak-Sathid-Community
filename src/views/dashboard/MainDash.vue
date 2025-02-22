<template>
    <div class="content py-5 titleBgColor">
        <!-- Header Section -->
        <div class="dashboard-box is-primary container has-background-white card px-5 my-2">
            <div class="columns is-centered is-mobile">
                <div class="column is-narrow has-text-centered">
                    <div class="has-background-white mt-2 py-3 px-5">
                        <h2 class="title is-2 has-text-link">สรุปผลการใช้ประโยชน์ที่ดิน</h2>
                    </div>
                    <!-- filter sois -->
                    <div v-if="userRole === roles[3].role_id" class="select is-rounded">
                        <select v-model="selectedSoi" @change="selectOption">
                            <option value="" selected>เลือกซอย</option>
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
                    <div class="column is-6-mobile is-3-tablet is-3-desktop">
                        <div class="card">
                            <div class="card-content">
                                <h4 class="title is-4 has-text-centered has-text-dark">ยางพารา</h4>
                                <h4 class="title is-4 has-text-centered has-text-dark">
                                    {{ summariesLandUse.total_rubber_tree }}</h4>
                            </div>
                        </div>
                    </div>

                    <div class="column is-6-mobile is-3-tablet is-3-desktop">
                        <div class="card">
                            <div class="card-content">
                                <h2 class="title is-4 has-text-centered has-text-dark">สวนผลไม้</h2>
                                <h4 class="title is-4 has-text-centered has-text-dark">
                                    {{ summariesLandUse.total_fruit_orchard }}</h4>
                            </div>
                        </div>
                    </div>

                    <div class="column is-6-mobile is-3-tablet is-3-desktop">
                        <div class="card">
                            <div class="card-content">
                                <h2 class="title is-4 has-text-centered has-text-dark">ปศุสัตว์</h2>
                                <h4 class="title is-4 has-text-centered has-text-dark">
                                    {{ summariesLandUse.total_livestock_farming }}</h4>
                            </div>
                        </div>
                    </div>

                    <div class="column is-6-mobile is-3-tablet is-3-desktop">
                        <div class="card">
                            <div class="card-content">
                                <h2 class="title is-4 has-text-centered has-text-dark">อื่นๆ</h2>
                                <h4 class="title is-4 has-text-centered has-text-dark">{{ summariesLandUse.total_other
                                    }}
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
                    <p class="title is-3 has-text-danger">โหลดข้อมูลไม่สำเร็จ</p>
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
import roles from '@/role_config';
import { defineComponent } from 'vue'
import { Bar, Pie } from 'vue-chartjs'
import { useUserStore } from '@/stores/useUserStore';
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
import axios from 'axios';
import { fetchLandUseDashboard, fetchSois, fetchOneLandUseDashboard } from '@/api/apiLand';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

export default defineComponent({
    components: { Bar, Pie },
    data() {
        return {
            selectedSoi: "",
            sois: [],
            reload: false,
            summariesLandUse: {
                total_rubber_tree: 0,
                total_fruit_orchard: 0,
                total_livestock_farming: 0,
                total_other: 0
            },
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
        // Define chartData2 as a computed property so it always reflects summariesLandUse values.
        chartData2() {
            return {
                labels: ['ยางพารา', 'สวนผลไม้', 'ปศุสัตว์', 'อื่นๆ'],
                datasets: [
                    {
                        label: 'จำนวน',
                        data: [
                            this.summariesLandUse.total_rubber_tree,
                            this.summariesLandUse.total_fruit_orchard,
                            this.summariesLandUse.total_livestock_farming,
                            this.summariesLandUse.total_other
                        ],
                        backgroundColor: ['#41B883', '#FFA500', '#00D8FF', '#FF6347']
                    }
                ]
            }
        },
        chartDataPie() {
            return {
                labels: ['ยางพารา', 'สวนผลไม้', 'ปศุสัตว์', 'อื่นๆ'],
                datasets: [
                    {
                        backgroundColor: ['#41B883', '#FFA500', '#00D8FF', '#FF6347'],
                        data: [
                            this.summariesLandUse.total_rubber_tree,
                            this.summariesLandUse.total_fruit_orchard,
                            this.summariesLandUse.total_livestock_farming,
                            this.summariesLandUse.total_other
                        ]
                    }
                ]
            }
        },
        userRole() {
            const userStore = useUserStore();
            return userStore.userRole;
        }
    },
    methods: {
        async redoLoad() {
            console.log('reload')
            this.reload = true;
            try {
                const res = await fetchLandUseDashboard();
                this.summariesLandUse = res[0];
                this.isActive = true
            } catch (error) {

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
                const res_dash = await fetchOneLandUseDashboard(this.selectedSoi);
                console.log('res:', res_dash)
                this.summariesLandUse = res_dash[0];
                this.isActive = true;
            } catch (error) {
                his.isActive = false;
            }
        }
    },
    async created() {
        try {
            this.sois = await fetchSois();
            const res = await fetchLandUseDashboard();

            this.summariesLandUse = res[0];
            console.log('res-dash:', res[0]);
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