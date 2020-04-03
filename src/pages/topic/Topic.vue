<template>
    <el-row class="wrapper">
        <el-col style="margin-bottom: 1rem;">
            <el-menu type="border-card" :default-active="getActiveTopic" style="margin-top: -2px;border: 0;" mode="horizontal" @select="handleSelectTopic">
                <el-menu-item v-for="topic in topicNavs" :key="topic.idTopic" :index="topic.topicUri">{{topic.topicTitle}}</el-menu-item>
            </el-menu>
        </el-col>
        <el-col style="margin: 0 auto;">
            <Article :articles="articles"></Article>
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
    import Vue from 'vue';
    import MetaInfo from 'vue-meta-info';
    import Article from '@/components/classic/Article';

    Vue.use(MetaInfo);
    export default {
        name: "topic",
        components: {
            Article
        },
        props: ['name'],
        computed: {
            getActiveTopic () {
                return this.$store.state.activeTopic;
            }
        },
        metaInfo: {
            // set a title
            title: 'RYMCU - 嵌入式知识共享平台',
            // set meta
            meta: [
                {
                    name: 'keywords',
                    content: 'RYMCU'
                },
                {
                    name: 'description',
                    content: '嵌入式知识共享平台'
                },
                {
                    name: 'site_name',
                    content: 'RYMCU'
                },
                {
                    name: 'url',
                    content: 'https://rymcu.com'
                },
                {
                    name: 'og:title',
                    content: 'RYMCU - 嵌入式知识共享平台'
                },
                {
                    name: 'og:description',
                    content: '嵌入式知识共享平台'
                },
                {
                    name: 'og:site_name',
                    content: 'RYMCU'
                },
                {
                    name: 'og:url',
                    content: 'https://rymcu.com'
                }
            ]
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
                window.scrollTo(0, 0);
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
                this.$router.push({
                    path: '/topic/' + item
                });
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
