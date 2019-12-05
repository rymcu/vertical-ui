<template>
    <el-row :gutter="8" class="text-center">
        <el-col :span="4">
            <el-card>
                <el-col class="mt-2rem dashboard-number">{{ dashboard.countUserNum }}</el-col>
                <el-col class="mt-2rem">总用户数</el-col>
            </el-card>
        </el-col>
        <el-col :span="4">
            <el-card>
                <el-col class="mt-2rem dashboard-number">{{ dashboard.newUserNum }}</el-col>
                <el-col class="mt-2rem">新增用户</el-col>
            </el-card>
        </el-col>
        <el-col :span="4">
            <el-card>
                <el-col class="mt-2rem dashboard-number">{{ dashboard.countArticleNum }}</el-col>
                <el-col class="mt-2rem">总文章数</el-col>
            </el-card>
        </el-col>
        <el-col :span="4">
            <el-card>
                <el-col class="mt-2rem dashboard-number">{{ dashboard.newArticleNum }}</el-col>
                <el-col class="mt-2rem">新增文章</el-col>
            </el-card>
        </el-col>
        <el-col :span="4">
            <el-card>
                <el-col class="mt-2rem dashboard-number">{{ dashboard.countViewNum }}</el-col>
                <el-col class="mt-2rem">总浏览量</el-col>
            </el-card>
        </el-col>
        <el-col :span="4">
            <el-card>
                <el-col class="mt-2rem dashboard-number">{{ dashboard.toadyViewNum }}</el-col>
                <el-col class="mt-2rem">今日浏览量</el-col>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "Dashboard",
        data() {
            return {
                dashboard: {}
            }
        },
        methods: {
            async getData() {
                let _ts = this;
                const responseData = await _ts.axios.get('/admin/dashboard');
                if (responseData) {
                    _ts.$set(_ts, 'dashboard', responseData);
                }
            }
        },
        mounted() {
            this.$store.commit("setActiveMenu", "admin-dashboard");
            this.getData();
        }
    }
</script>

<style scoped>
    .mt-2rem {
        margin: 2rem auto;
    }

    .dashboard-number {
        font-weight: bold;
        font-size: 2em;
    }
</style>