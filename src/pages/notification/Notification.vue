<template>
    <el-row class="wrapper">
        <el-col>
            <h1>通知</h1>
        </el-col>
        <el-col v-for="notification in notifications" :key="notification.idNotification">
            <el-col v-if="notification.dataType"></el-col>
            <el-col v-else>
                <el-col :xs="3" :sm="1" :xl="1" class="mr-3">
                    <el-avatar size="medium" src="https://b.yzcdn.cn/showcase/membercenter/2018/08/06/default_avatar@2x.png"></el-avatar>
                </el-col>
                <el-col :xs="9" :sm="11" :xl="11">
                    <span>{{ notification.dataSummary }}</span>
                </el-col>
            </el-col>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "Notification",
        data() {
            return {
                notifications: []
            }
        },
        methods: {
            getData() {
                let _ts = this;
                _ts.axios.get('/notification/all').then(function (res) {
                    if (res) {
                        _ts.$set(_ts, 'notifications', res.notifications)
                    }
                })
            }
        },
        mounted() {
            this.getData();
        }
    }
</script>

<style scoped>

</style>