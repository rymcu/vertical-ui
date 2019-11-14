<template>
    <el-row>
        专栏
    </el-row>
</template>

<script>
    export default {
        name: "SpecialColumn",
        mounted () {
            this.$store.commit('setActiveMenu', 'specialColumn');
        }
    }
</script>

<style scoped>

</style>
