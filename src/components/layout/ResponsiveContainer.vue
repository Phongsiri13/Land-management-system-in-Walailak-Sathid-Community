<template>
    <div class="container is-fluid">
        <div class="columns is-mobile is-centered">
            <div class="column is-full-mobile is-8-tablet is-8-desktop">
                <slot></slot> <!-- This will allow you to place content inside this component -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ResponsiveContainer ',
};
</script>