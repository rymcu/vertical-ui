<template>
    <el-row>
        <el-col style="margin-bottom: 1rem;">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/admin/topics' }">专题管理</el-breadcrumb-item>
                <el-breadcrumb-item>{{ topic.topicTitle }}</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
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
                                <el-dropdown-item command="admin-post-topic">管理</el-dropdown-item>
                                <el-dropdown-item command="admin-bind-topic-tag">关联标签</el-dropdown-item>
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
        <el-col v-for="tag in topic.tags" :key="tag.idTag">
            <el-card style="margin: .5rem;">
                <el-col :span="1">
                    <el-avatar shape="square" :src="tag.tagIconPath" fit="scale-down"></el-avatar>
                </el-col>
                <el-col :span="20">
                    <el-col>
                        <span class="tag-title">{{ tag.tagTitle }}</span>
                    </el-col>
                    <el-col>
                        <span class="text-muted" v-if="tag.tagArticleCount">{{ tag.tagArticleCount }} 引用</span>
                        <span class="text-muted" v-else> <span style="color: #F56C6C;">0</span> 引用</span>
                    </el-col>
                </el-col>
                <el-col :span="3" class="text-right">
                    <el-button size="small" @click="unbindTopicTag(tag.idTag)">取消关联</el-button>
                </el-col>
                <el-col style="margin-bottom: .8rem">{{ tag.tagDescription }}</el-col>
            </el-card>
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
        name: "TopicTag",
        computed: {
            hasPermissions() {
                return this.$store.getters.hasPermissions('topic');
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
                tags: [],
                pagination: {
                    currentPage: 1,
                    pageSize: 20,
                    total: 0
                }
            }
        },
        methods: {
            currentChange(val){
                this.getData(val);
            },
            getData(p) {
                let _ts = this;
                _ts.axios.get("/admin/topic/" + _ts.topicUri + '?page=' + p).then(function (res) {
                    _ts.$set(_ts,'topic', res.topic);
                    _ts.$set(_ts,'pagination', res.pagination);
                })
            },
            handleCommand(command) {
                let _ts = this;
                _ts.$router.push({
                    name: command,
                    params: {
                        id: _ts.topic.idTopic
                    }
                })
            },
            unbindTopicTag(idTag) {
                let _ts = this;
                this.$confirm('确定取消关联吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _ts.axios.delete('/admin/topic/unbind-topic-tag', {
                        data: {
                            idTag: idTag,
                            idTopic: _ts.topic.idTopic
                        }
                    }).then(function (res) {
                        if (res && res.message) {
                            _ts.$message.error(res.message);
                        } else {
                            const p = _ts.pagination.currentPage;
                            _ts.getData(p);
                        }
                    })
                }).catch(() => {
                });
            }
        },
        mounted() {
            this.$store.commit("setActiveMenu", "admin-topic-tag");
            const p = this.pagination.currentPage;
            this.getData(p);
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
