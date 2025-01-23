<template>
  <div id="map" style="height: 650px; width: 100%;"></div>
</template>

<script>
import L from 'leaflet';

export default {
  name: 'LeafletMap',
  data() {
    return {
      map: null, // To store the map instance
      center: [51.505, -0.09], // Define the center coordinates
    };
  },
  methods: {
    resetCenter() {
      this.map.setView(this.center); // Reset the map to the defined center
    },
  },
  mounted() {
    // Initialize the map
    this.map = L.map('map').setView(this.center, 15);

    // Add a tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    // Add a marker at the center
    L.marker(this.center).addTo(this.map);

    // วาดสามเหลี่ยม
    L.polygon([
      [51.509, -0.08], // จุดแรก
      [51.503, -0.06], // จุดที่สอง
      [51.51, -0.047]  // จุดที่สาม
    ], {
      color: 'blue',
      fillColor: '#3388ff',
      fillOpacity: 0.5,
    }).addTo(this.map).bindPopup("นี่คือสามเหลี่ยม");

    // วาดสี่เหลี่ยม
    L.rectangle([
      [51.49, -0.1],  // มุมบนซ้าย
      [51.5, -0.06]   // มุมล่างขวา
    ], {
      color: 'red',
      fillColor: '#ff6666',
      weight: 1,

    }).addTo(this.map).bindPopup("นี่คือสี่เหลี่ยม");

    const roundedRectangleCoords = [
      [51.505, -0.09],   // จุดเริ่มต้น
      [51.505, -0.07],   // ด้านบน
      [51.503, -0.065],  // โค้งด้านขวา
      [51.501, -0.07],   // ด้านล่าง
      [51.501, -0.08],   // ด้านซ้าย
      [51.503, -0.095],  // โค้งด้านซ้าย
      [51.505, -0.09],   // กลับมาที่จุดเริ่มต้น
    ];

    // เพิ่มเส้น Polyline
    L.polyline(roundedRectangleCoords, {
      color: 'green',
      weight: 4,
      smoothFactor: 1, // ใช้ smoothFactor เพื่อทำให้เส้นโค้งนุ่มนวลขึ้น
    }).addTo(this.map).bindPopup("สี่เหลี่ยมโค้งมน");

    // Force the map to center after drag or zoom
    this.map.on('dragend', this.resetCenter);
    this.map.on('zoomend', this.resetCenter);
  },
};
</script>

<style>
/* Ensure the map container has a height */
#map {
  z-index: -1;
}
</style>
