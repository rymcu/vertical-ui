<template>
    <el-row :gutter="8">
        <el-col :span="8" style="margin-bottom: .5rem;" v-for="topic in topics" :key="topic.idTopic">
            <el-card>
                <div class="card-body d-flex flex-column">
                    <el-col :span="4" style="text-align: right;">
                        <img :src="topic.topicIconPath" :alt="topic.topicTitle" class="topic-brand-img">
                    </el-col>
                    <el-col :span="20">
                        <el-col>
                            <el-col>
                                <el-link @click="onRouter('admin-topic-tag',topic)" :underline="false"><h4>{{ topic.topicTitle }}</h4></el-link>
                            </el-col>
                            <el-col>
                                <div class="text-muted article-summary-md">{{ topic.topicDescription }}</div>
                            </el-col>
                        </el-col>
                    </el-col>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "AdminTopic",
        computed: {
            isAdmin() {
                return true
            }
        },
        data() {
            return {
                topics: []
            }
        },
        methods: {
            getData() {
                let _ts = this;
                _ts.axios.get("/admin/topics").then(function (res) {
                    _ts.$set(_ts,"topics",res.topics);
                })
            },
            onRouter(item,data) {
                this.$router.push({
                    name: item,
                    params: data
                })
            }
        },
        mounted() {
            this.$store.commit("setActiveMenu", "admin-topic");
            this.getData();
        }
    }
</script>

<style scoped>

</style>
