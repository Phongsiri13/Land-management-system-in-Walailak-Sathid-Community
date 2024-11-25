<template>
  <div>
    <div style="height: 300px; width: 400px">
      <Bar :data="chartData1" :options="chartOptions1" class="chart-card" />
    </div>

    <div style="height: 300px; width: 400px">
      <Bar :data="chartData2" :options="chartOptions2" />
    </div>

    <div style="height: 300px; width: 400px">
      <Pie :data="chartDataPie" :options="chartOptionsPie" />
    </div>
  </div>
</template>

<script>
import { store } from '@/store'
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

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

export default defineComponent({
  components: { Bar, Pie },
  data() {
    return {
      store,
      chartData1: {
        labels: ['January', 'February', 'March'],
        datasets: [
          {
            label: 'ไก่ย่าง',
            data: [40, 20, 12],
            backgroundColor: '#3e95cd'
          }
        ]
      },
      chartOptions1: {
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
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        }
      },

      chartData2: {
        labels: ['April', 'May', 'June'],
        datasets: [
          {
            label: 'หมูย่าง',
            data: [30, 25, 18],
            backgroundColor: '#8e5ea2'
          }
        ]
      },
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
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        }
      },
      // pie data
      chartDataPie: {
        labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
        datasets: [
          {
            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
            data: [40, 20, 80, 10]
          }
        ]
      },
      chartOptionsPie: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            enabled: true // Disable tooltip if you don't need it
          }
        },
        // Ref to labels
        onClick: (event, elements) => {
          // const chart = elements[0]._chart;
          // const x = event.clientX;
          // const y = event.clientY;

          // Check if a label was clicked
          // const labelClicked = chart.scales['x-axis-0'].getLabelForValue(x);

          // If a label was clicked, log "hello world"
          console.log(`hello world`)
        }
      }
    }
  },
  mounted() {
    this.store.status_path_change = false

    // Custom Plugin to display value and percentage
    ChartJS.defaults.plugins.tooltip.enabled = true // Ensure tooltips are disabled
    ChartJS.register({
      id: 'show-percentages',
      afterDatasetsDraw(chart) {
        // Filter
        if (chart.config.type === 'pie' || chart.config.type === 'doughnut') {
          const ctx = chart.ctx
          chart.data.datasets.forEach((dataset, i) => {
            const meta = chart.getDatasetMeta(i)

            // Calculate the total only for visible slices
            const visibleData = dataset.data.filter((value, index) => !meta.data[index].hidden)
            const total = visibleData.reduce((acc, val) => acc + val, 0)

            meta.data.forEach((element, index) => {
              if (!element.hidden) {
                const dataValue = dataset.data[index]
                const percentage = ((dataValue / total) * 100).toFixed(2) + '%'

                const position = element.tooltipPosition()
                ctx.fillStyle = '#000' // Set font color to black
                ctx.font = 'bold 12px Arial'

                // Only display percentage
                const text = `${percentage}`
                const textX = position.x
                const textY = position.y

                ctx.fillText(text, textX, textY)
              }
            })
          })
        }
      }
    })
  }
})
</script>
