<template>
    <el-row type="flex" justify="center" :gutter="8">
        <el-col :span="20">
            <el-col :span="4">
                <el-menu
                        :default-active="getActiveAdminMenu"
                        class="el-menu-vertical-demo"
                        @select="handleSelectMenu">
                    <el-menu-item index="admin-dashboard">
                        <i class="el-icon-s-data"></i>
                        <span slot="title">Dashboard</span>
                    </el-menu-item>
                    <el-menu-item index="admin-user">
                        <i class="el-icon-s-custom"></i>
                        <span slot="title">用户管理</span>
                    </el-menu-item>
                    <el-menu-item index="admin-topic">
                        <i class="el-icon-postcard"></i>
                        <span slot="title">专题管理</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="20">
                <router-view></router-view>
            </el-col>
        </el-col>
    </el-row>
</template>

<script>
    /* eslint-disable no-console */

    export default {
        name: "Admin",
        computed: {
            getActiveAdminMenu () {
                return this.$store.state.activeMenu;
            }
        },
        methods: {
            handleSelectMenu(item) {
                let _ts = this;
                let activeMenu = _ts.$store.state.activeMenu;
                if (activeMenu !== item) {
                    _ts.$store.commit('setActiveMenu', item);
                    _ts.$router.push(
                        {
                            name: item
                        }
                    )
                }
            }
        }
    }
</script>

<style scoped>

</style>
