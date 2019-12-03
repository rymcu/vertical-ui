<template>
    <el-row>
        <el-col v-if="topic.idTopic">
            <el-col :span="2" style="text-align: right;align-items: center;display: flex;">
                <img :src="topic.topicIconPath" :alt="topic.topicTitle" class="topic-brand-img">
            </el-col>
            <el-col :span="20">
                <el-col>
                    <el-col>
                        <h2>{{ topic.topicTitle }}</h2>
                    </el-col>
                    <el-col>
                        <p>{{ topic.topicDescription }}</p>
                    </el-col>
                </el-col>
            </el-col>
        </el-col>
        <el-col v-else>
            <el-col :span="2" style="text-align: right;">
                <img :src="topicIconPath" :alt="topicTitle" class="topic-brand-img">
            </el-col>
            <el-col :span="20">
                <el-col>
                    <el-col>
                        <h2>{{ topicTitle }}</h2>
                    </el-col>
                    <el-col>
                        <p>{{ topicDescription }}</p>
                    </el-col>
                </el-col>
            </el-col>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "TopicTag",
        props: {
            idTopic: {
                type: Number,
                default: 0
            },
            topicTitle: {
                type: String,
                default: ''
            },
            topicUri: {
                type: String,
                default: ''
            },
            topicIconPath: {
                type: String,
                default: ''
            },
            topicDescription: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                topic: {
                    idTopic: 0,
                    topicTitle: '',
                    topicUri: '',
                    topicIconPath: '',
                    topicDescription: '',
                    topicTags: {}
                }
            }
        },
        methods: {
            getData() {
                let _ts = this;
                _ts.axios.get("/admin/topic")
            }
        },
        mounted() {
            this.$store.commit("setActiveMenu", "admin-topic-tag");
            this.getData();
        }
    }
</script>

<style scoped>

</style>
