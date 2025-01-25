<template>
    <nav class="navbar navigator-color" role="navigation" aria-label="main navigation">
        <div class="navbar-menu is-active">
            <!-- Start Section -->
            <div class="navbar-item">
                <RouterLink to="/" class="navbar-item has-text-white" active-class="is-active"
                    exact-active-class="is-active">
                    <span class="icon">
                        <i class="fas fa-home" style="color: white;"></i>
                    </span>
                </RouterLink>
            </div>
            <div class="navbar-item">
                <RouterLink to="/dashboard" class="navbar-item has-text-white" active-class="is-active"
                    exact-active-class="is-active">
                    <span class="icon">
                        <i class="fas fa-folder" style="color: white;"></i>
                    </span>
                </RouterLink>
            </div>

            <!-- Middle Section -->
            <div class="navbar-start" style="display: flex; justify-content: center; flex: 1;">
                <div class="field has-addons" style="width: 60%; max-width: 500px;">
                    <div class="control is-expanded">
                        <input class="input" type="text" placeholder="ค้นหา แปลงที่ดิน " v-model="searchQuery" />
                    </div>
                    <div class="control">
                        <button class="button is-dark" @click="search">
                            <span class="icon">
                                <i class="fas fa-search"></i>
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- End Section -->
            <div class="navbar-item">
                <RouterLink to="/login" class="navbar-item has-text-white" active-class="is-active"
                    exact-active-class="is-active">
                    <span class="icon">
                        <i class="fas fa-sign-out-alt" style="color: white;"></i>
                        <!-- <img src="@/assets/icons/search-white.png" :width="34" :height="34" alt="Search Icon"> -->
                    </span>
                </RouterLink>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    data() {
        return {
            searchQuery: "", // For storing the user's input
        };
    },
    methods: {
        search() {
            // This method could also navigate to a new route if needed
            this.$router.push({ path: '/search', query: { q: this.searchQuery } });
            this.results = [...this.mockData]
        },
        performSearch() {
            console.log("Searching for:", this.searchQuery);
        },
    },
};
</script>

<style>
.navbar {
    height: 60px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input {
    border-radius: 0;
}

.button {
    border-radius: 0;
}

.navbar-menu {
    display: flex;
    align-items: center;
    /* Vertically align items */
}
</style>