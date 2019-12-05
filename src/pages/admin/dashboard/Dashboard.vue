<template>
    <el-row>
        Dashboard
    </el-row>
</template>

<script>
    export default {
        name: "Dashboard",
        mounted() {
            this.$store.commit("setActiveMenu", "admin-dashboard");
        }
    }
</script>

<style scoped>

</style>