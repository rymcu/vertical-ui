<template>
    <el-row>
        <el-col>
            <el-col :span="4">
                <img :src="topic.topicIconPath" :alt="topic.topicTitle" class="navbar-brand-img">
            </el-col>
            <el-col :span="20">
                <el-col>
                    <el-col>
                        <el-link @click="onRouter('admin-topic-tag',topic)" :underline="false"><h4>{{ topic.topicTitle }}</h4></el-link>
                    </el-col>
                    <el-col>
                        <p>{{ topic.topicDescription }}</p>
                    </el-col>
                </el-col>
            </el-col>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "TopicTag",
        props: ["idTopic"],
        data() {
            return {
                topic: {}
            }
        },
        methods: {
            getData() {}
        },
        mounted() {
            // eslint-disable-next-line no-console
            console.log(this.$route.params)
            this.$store.commit("setActiveAdminMenu", "admin-topic-tag");
            this.getData();
        }
    }
</script>

<style scoped>

</style>