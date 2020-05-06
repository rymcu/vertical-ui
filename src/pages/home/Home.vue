<template>
    <el-row class="wrapper">
        <el-col v-if="mourn" style="padding-bottom: 1rem;">
            <el-image :src="dy" style="height: 180px;-webkit-filter: grayscale(100%);-moz-filter: grayscale(100%);
            -o-filter: grayscale(100%);filter: grayscale(100%);"></el-image>
        </el-col>
        <el-col :xs="24" :sm="24" :xl="24" style="margin: 0 auto;">
            <el-col v-for="article in articles" :key="article.idArticle" style="padding-bottom: 1rem;">
                <el-card>
                    <div class="card-body d-flex flex-column">
                        <el-link @click="onRouter('article',article.articleLink)" :underline="false" style="margin-bottom: .5rem;">
                            <h4 v-html="article.articleTitle"></h4>
                        </el-link>
                        <el-tag
                                style="margin-left: 0.5rem;"
                                v-for="tag in article.tags"
                                :key="tag.idTag"
                                size="mini"
                                effect="plain">
                            {{ tag.tagTitle }}
                        </el-tag>
                        <div class="text-muted article-summary-md">{{ article.articlePreviewContent }}</div>
                        <el-row class="pt-5">
                            <el-col :xs="3" :sm="1" :xl="1" class="mr-3">
                                <el-avatar v-if="article.articleAuthorAvatarUrl" size="medium" :src="article.articleAuthorAvatarUrl"></el-avatar>
                                <el-avatar v-else size="medium" src="https://rymcu.com/vertical/article/1578475481946.png"></el-avatar>
                            </el-col>
                            <el-col :xs="20" :sm="20" :xl="20">
                                <div>
                                    <el-link @click="onRouter('user', article.articleAuthorName)" :underline="false" class="text-default">{{ article.articleAuthorName }}</el-link>
                                    <small class="d-block text-muted">{{ article.timeAgo }}</small>
                                </div>
                            </el-col>
                            <el-col class="text-right">
                                <el-link :underline="false" title="总浏览数"><i class="el-icon-s-data"></i><span style="color: red;">{{ article.articleViewCount }}</span></el-link>
                            </el-col>
                        </el-row>
                    </div>
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
    import Vue from 'vue';
    import MetaInfo from 'vue-meta-info';
    import Dy from "@/assets/daonian.jpg";

    Vue.use(MetaInfo);
    export default {
        name: "Home",
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
