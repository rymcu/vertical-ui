<template>
    <el-row class="wrapper">
        <el-col v-if="mourn" style="padding-bottom: 1rem;">
            <el-image :src="dy" style="height: 180px;-webkit-filter: grayscale(100%);-moz-filter: grayscale(100%);
            -o-filter: grayscale(100%);filter: grayscale(100%);"></el-image>
        </el-col>
        <el-col :xs="24" :sm="24" :xl="24" style="margin: 0 auto;">
            <Article :articles="articles"></Article>
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
    import Vue from 'vue';
    import MetaInfo from 'vue-meta-info';
    import Article from '@/components/classic/Article';
    import Dy from "@/assets/daonian.jpg";

    Vue.use(MetaInfo);
    export default {
        name: "Home",
        components: {
            Article
        },
        metaInfo: {
            // set a title
            title: 'RYMCU - 嵌入式知识学习交流平台',
            // set meta
            meta: [
                {
                    name: 'keywords',
                    content: 'RYMCU,嵌入式,51,单片机,STM,STM8,STM32'
                },
                {
                    name: 'description',
                    content: 'RYMCU 致力于打造一个即严谨又活泼、专业又不失有趣，为数百万人服务的开源嵌入式知识学习交流平台。'
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
                    name: 'og:keywords',
                    content: 'RYMCU,嵌入式,51,单片机,STM,STM8,STM32'
                },
                {
                    name: 'og:title',
                    content: 'RYMCU - 嵌入式知识学习交流平台'
                },
                {
                    name: 'og:description',
                    content: 'RYMCU 致力于打造一个即严谨又活泼、专业又不失有趣，为数百万人服务的开源嵌入式知识学习交流平台。'
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
                dy: Dy,
                mourn: false,
                articles: [],
                pagination: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                }
            }
        },
        methods: {
            currentChange(val){
                this.getData(val);
            },
            async getData(p){
                let _ts = this;
                const responseTopData = await this.axios.get('/console/articles?page='+p);
                if (responseTopData) {
                    responseTopData.pagination.currentPage = p;
                    _ts.$set(_ts, 'articles', responseTopData.articles);
                    _ts.$set(_ts, 'pagination', responseTopData.pagination);
                    window.scrollTo(0, 0);
                }
            },
            onRouter (name, data) {
                if (name === 'article') {
                    this.$router.push({
                        path: data
                    })
                } else {
                    this.$router.push(
                        {
                            path: '/user/' + data
                        }
                    )
                }
            },
            loadMourn() {
                let mourn = false;
                let date = new Date();
                if (date.getMonth() == 3 && date.getDate() == 4 ) {
                    mourn = true;
                }
                this.$set(this, 'mourn', mourn);
            }
        },
        mounted () {
            this.$store.commit('setActiveMenu', 'home');
            const p = this.pagination.currentPage;
            this.getData(p);
            this.loadMourn();
        }
    }
</script>

<style scoped>
</style>
