<template>
    <el-row>
        <el-col>
            <el-col style="margin-bottom: 1rem;">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path: '/admin/topics' }">专题管理</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path: '/admin/topic/' + topic.topicUri }">{{ topic.topicTitle }}</el-breadcrumb-item>
                    <el-breadcrumb-item>关联标签</el-breadcrumb-item>
                </el-breadcrumb>
            </el-col>
            <el-col>
                <el-input placeholder="请输入标签名" v-model="tagTitle">
                    <el-button @click="getTags" slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </el-col>
            <el-col v-for="tag in tags" :key="tag.idTag">
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
                        <el-button size="small" @click="bindTopicTag(tag.idTag)">关联</el-button>
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
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "BindTopicTag",
        props: ["id"],
        data() {
            return {
                topic: {
                    topicTitle: '',
                    topicUri: ''
                },
                tags: [],
                tagTitle: '',
                pagination: {
                    currentPage: 1,
                    pageSize: 20,
                    total: 0
                }
            }
        },
        methods: {
            currentChange(val){
                this.getTags(val);
            },
            getData() {
                let _ts = this;
                _ts.axios.get('/admin/topic/detail/' + _ts.id).then(function (res) {
                    _ts.$set(_ts,'topic', res);
                    const p = _ts.pagination.currentPage;
                    _ts.getTags(p);
                });
            },
            getTags(p) {
                let _ts = this;
                _ts.axios.get('/admin/topic/unbind-topic-tags', {
                    params: {
                        idTopic: _ts.id,
                        tagTitle: _ts.tagTitle,
                        page: p
                    }
                }).then(function (res) {
                    if (res) {
                        _ts.$set(_ts, 'tags', res.tags);
                        _ts.$set(_ts,'pagination', res.pagination);
                    }
                });
            },
            bindTopicTag(idTag) {
                let _ts = this;
                this.$confirm('确定关联吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _ts.axios.post('/admin/topic/bind-topic-tag', {
                        idTag: idTag,
                        idTopic: _ts.topic.idTopic
                    }).then(function (res) {
                        if (res && res.message) {
                            _ts.$message.error(res.message);
                        } else {
                            _ts.getData();
                        }
                    })
                }).catch(() => {
                });
            }
        },
        mounted() {
            this.getData()
        }
    }
</script>

<style scoped>

</style>