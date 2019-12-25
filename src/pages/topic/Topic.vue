<template>
    <el-row class="wrapper">
        <el-col>
            <el-menu type="border-card" :default-active="getActiveTopic" style="margin-top: -2px;border: 0;" mode="horizontal" @select="handleSelectTopic">
                <el-menu-item v-for="topic in topicNavs" :key="topic.idTopic" :index="topic.topicUri">{{topic.topicTitle}}</el-menu-item>
            </el-menu>
        </el-col>
        <el-col style="margin: 0 auto;">
            <el-col v-for="article in articles" :key="article.idArticle" style="padding-bottom: 1rem;">
                <el-card>
                    <div class="card-body d-flex flex-column">
                        <el-link @click="onRouter('article',article.idArticle)" :underline="false" style="margin-bottom: .5rem;">
                            <h4 v-html="article.articleTitle"></h4>
                        </el-link>
                        <div class="text-muted article-summary-md">{{ article.articlePreviewContent }}</div>
                        <el-row class="pt-5">
                            <el-col :xs="3" :sm="1" :xl="1" class="mr-3">
                                <el-avatar v-if="article.articleAuthorAvatarUrl" size="medium" :src="article.articleAuthorAvatarUrl"></el-avatar>
                                <el-avatar v-else size="medium" src="https://b.yzcdn.cn/showcase/membercenter/2018/08/06/default_avatar@2x.png"></el-avatar>
                            </el-col>
                            <el-col :xs="9" :sm="11" :xl="11">
                                <div>
                                    <el-link @click="onRouter('user', article.articleAuthorName)" :underline="false" class="text-default">{{ article.articleAuthorName }}</el-link>
                                    <small class="d-block text-muted">{{ article.timeAgo }}</small>
                                </div>
                                <div class="ml-auto text-muted">
                                    <a href="javascript:void(0)" class="icon d-none d-md-inline-block ml-3"><i
                                            class="fe fe-heart mr-1"></i></a>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
            </el-col>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "topic",
        props: ['name'],
        computed: {
            getActiveTopic () {
                return this.$store.state.activeTopic;
            }
        },
        data() {
            return {
                topicNavs: [],
                articles: [],
                pagination: {
                    currentPage: 1,
                    pageSize: 20,
                    total: 0
                }
            }
        },
        methods: {
            currentChange(val){
                const topic = this.$store.state.activeTopic;
                this.getData(topic,val);
            },
            async getData(topic,p){
                let _ts = this;
                const topicNavData = await this.axios.get('/topic/topic-nav');
                if (topicNavData) {
                    _ts.$set(_ts, 'topicNavs', topicNavData);
                }
                const responseTopData = await this.axios.get('/topic/' + topic + '?page='+p);
                if (responseTopData) {
                    responseTopData.pagination.currentPage = p;
                    _ts.$set(_ts, 'articles', responseTopData.articles);
                    _ts.$set(_ts, 'pagination', responseTopData.pagination);
                } else {
                    _ts.$set(_ts, 'articles', []);
                }
            },
            onRouter (name, data) {
                this.$router.push(
                    {
                        name: name,
                        params: {
                            id: data
                        }
                    }
                )
            },
            handleSelectTopic(item) {
                this.$store.commit('setActiveTopic', item);
                const topic = this.$store.state.activeTopic;
                const p = this.pagination.currentPage;
                this.getData(topic,p);
            }
        },
        mounted () {
            this.$store.commit('setActiveMenu', 'topic');
            this.$store.commit('setActiveTopic', this.name);
            const topic = this.$store.state.activeTopic;
            const p = this.pagination.currentPage;
            this.getData(topic,p);
        }
    }
</script>

<style scoped>

</style>