<template>
    <div class="sidebar">
      <div
        class="nav-item"
        v-for="item in navItems"
        :key="item.id"
        :class="{ active: item.active }"
        @click="navigate(item)"
      >
        <img :src="item.icon" :alt="item.label" />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        navItems: [
          { id: 1, label: "Home", icon: require('@/assets/icons/home-icon.svg'), active: true },
          { id: 3, label: "Dashboard", icon: require('@/assets/icons/dashboard-icon.svg'), active: false },
          { id: 5, label: "Add", icon: require('@/assets/icons/add-icon.svg'), active: false },
          { id: 6, label: "Exit", icon: require('@/assets/icons/exit-icon.svg'), active: false },
        ],
      };
    },
    methods: {
      navigate(item) {
        this.navItems.forEach((nav) => (nav.active = false));
        item.active = true;
        console.log(`Navigating to ${item.label}`);
        // Add your navigation logic here
      },
    },
  };
  </script>
  
  <style scoped>
  .sidebar {
    width: 300px;
    background-color: #0f291d;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 0;
    height: 100vh;
  }
  
  .nav-item {
    margin: 10px 0;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 8px;
  }
  
  .nav-item img {
    width: 24px;
    height: 24px;
  }
  
  .nav-item.active {
    background-color: #2d3c33;
  }
  </style>
  