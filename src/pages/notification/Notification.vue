<template>
    <el-row class="wrapper">
        <el-col style="margin-bottom: 1rem;">
            <h1>通知</h1>
        </el-col>
        <el-col v-for="notification in notifications" :key="notification.idNotification">
            <el-col v-if="notification.dataType == 0">
                <el-col :xs="9" :sm="11" :xl="11">
                    <el-link :underline="false" @click="onRouter(notification)" style="font-size: 1.1em;" v-html="notification.dataSummary"></el-link>
                    <el-col>{{ notification.createdTime }}</el-col>
                </el-col>
                <el-col :xs="3" :sm="1" :xl="1" class="mr-3">
                    <el-link v-if="notification.hasRead === '0'" :underline="false" @click="read(notification.idNotification)">
                        <i class="el-icon-check"></i>
                    </el-link>
                </el-col>
            </el-col>
            <el-col v-else-if="notification.dataType == 1">
                <el-col :xs="9" :sm="11" :xl="11">
                    <el-link :underline="false" style="font-size: 1.1em;" v-html="notification.dataSummary"></el-link>
                    <el-col>{{ notification.createdTime }}</el-col>
                </el-col>
                <el-col :xs="3" :sm="1" :xl="1" class="mr-3">
                    <el-link v-if="notification.hasRead === '0'" :underline="false" @click="read(notification.idNotification)">
                        <i class="el-icon-check"></i>
                    </el-link>
                </el-col>
            </el-col>
            <el-col v-else>
                <el-col :xs="21" :sm="23" :xl="23">
                    <el-link :underline="false" style="font-size: 1.1em;" v-html="notification.dataSummary"></el-link>
                    <el-col>{{ notification.createdTime }}</el-col>
                </el-col>
                <el-col :xs="3" :sm="1" :xl="1" class="text-right" style="padding-right: 1rem;">
                    <el-link v-if="notification.hasRead === '0'" :underline="false" @click="read(notification.idNotification)">
                        <i class="el-icon-check" style="font-weight: bold;"></i>
                    </el-link>
                </el-col>
            </el-col>
            <el-col>
                <el-divider></el-divider>
            </el-col>
        </el-col>
        <el-col>
            <div class="vertical-container text-center">
                <el-pagination v-show="pagination.total > 10" v-model="pagination"
                               layout="prev, pager, next"
                               :current-page="pagination.currentPage"
                               :total="pagination.total"
                               @current-change="currentChange">
                </el-pagination>
            </div>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "Notification",
        data() {
            return {
                notifications: [],
                pagination: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                }
            }
        },
        methods: {
            async getData(p) {
                let _ts = this;
                let responseTopData = await _ts.axios.get('/notification/all?page=' + p)
                    if (responseTopData) {
                        responseTopData.pagination.currentPage = p;
                        _ts.$set(_ts, 'notifications', responseTopData.notifications);
                        _ts.$set(_ts, 'pagination', responseTopData.pagination);
                        window.scrollTo(0, 0);
                    }
            },
            onRouter(notification) {
                if ('0' === notification.dataType) {
                    this.read(notification.idNotification);
                    this.$router.push({
                        path: '/article/' + notification.dataId
                    })
                }
            },
            read(id) {
                let _ts = this;
                this.axios.put('/notification/read/' + id).then(function () {
                    _ts.getData();
                });
            },
            currentChange(val){
                this.getData(val);
            }
        },
        mounted() {
            const p = this.pagination.currentPage;
            this.getData(p);
        }
    }
</script>

<style scoped>

</style>
