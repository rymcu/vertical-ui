<template>
    <el-row>
        <el-col v-if="topic.idTopic">
            <el-col :span="2" class="text-right">
                <img :src="topic.topicIconPath" :alt="topic.topicTitle" class="topic-brand-img">
            </el-col>
            <el-col :span="20">
                <el-col>
                    <el-col :span="20">
                        <span class="topic-title">{{ topic.topicTitle }}</span>
                        <span class="text-muted" v-if="topic.topicTagCount">{{ topic.topicTagCount }} 引用</span>
                        <span class="text-muted" v-else> <span style="color: #F56C6C;">0</span> 引用</span>
                    </el-col>
                    <el-col v-if="hasPermissions" :span="4" class="text-right">
                        <el-dropdown trigger="click"  @command="handleCommand">
                            <el-link :underline="false"><i class="el-icon-more"></i></el-link>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="edit">管理</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
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
        computed: {
            hasPermissions() {
                let _ts = this;
                return _ts.$store.getters.hasPermissions('topic');
            }
        },
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
                },
                pagination: {
                    currentPage: 1,
                    pageSize: 20,
                    total: 0
                }
            }
        },
        methods: {
            getData() {
                let _ts = this;
                _ts.axios.get("/admin/topic/" + _ts.topicUri,{
                    params: {
                        currentPage: _ts.pagination.currentPage
                    }
                }).then(function (res) {
                    _ts.$set(_ts,'topic', res.topic);
                    _ts.$set(_ts,'pagination', res.pagination);
                })
            },
            handleCommand(command) {
                this.$router.push({
                    name: command
                })
            }
        },
        mounted() {
            this.$store.commit("setActiveMenu", "admin-topic-tag");
            this.getData();
        }
    }
</script>

<style scoped>
    .topic-title {
        font-weight: bold;
        font-size: 1.5em;
        margin-right: 1.5rem;
    }
</style>
