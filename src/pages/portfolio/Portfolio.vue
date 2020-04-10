<template>
    <el-row class="wrapper">
        <el-col>
            <el-col :xs="3" :sm="3" :xl="3" class="mr-3">
                <el-image :src="portfolio.headImgUrl"></el-image>
            </el-col>
            <el-col :xs="20" :sm="20" :xl="20">
                <el-col>
                    <h1>{{ portfolio.portfolioTitle }}</h1>
                </el-col>
                <el-col style="margin-bottom: .5rem;">
                    <span class="text-default" style="padding-right: 1rem;">作者</span>
                    <el-link @click="onRouter('user', portfolio.portfolioAuthorName)" :underline="false" class="text-default">
                        <el-avatar :src="portfolio.portfolioAuthorAvatarUrl" :size="16"></el-avatar> {{ portfolio.portfolioAuthorName }}
                    </el-link>
                </el-col>
                <el-col style="margin-bottom: .5rem;">
                    <span class="text-default" style="padding-right: 1rem;">文章</span> {{portfolio.articleNumber}}篇
                </el-col>
                <el-col style="margin-bottom: .5rem;">
                    {{ portfolio.portfolioDescription }}
                </el-col>
            </el-col>
        </el-col>
        <el-col>
            <el-col v-if="isAuthor" style="text-align: right;">
                <el-col>
                    <el-link @click="showBindArticleDialog(portfolio.idPortfolio)" :underline="false" class="text-default">添加文章</el-link>
                </el-col>
            </el-col>
            <el-divider><i class="el-icon-loading"></i></el-divider>
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
    Vue.use(MetaInfo);
    export default {
        name: "Portfolio",
        props: ["id"],
        components: {
            Article
        },
        computed: {
            isAuthor() {
                let name = this.portfolio.portfolioAuthorName;
                return this.$store.getters.isAuthor(name);
            }
        },
        metaInfo() {
            return {
                // set a title
                title: this.portfolio.portfolioTitle + ' - RYMCU',
                // set meta
                meta: [
                    {
                        name: 'keywords',
                        content: 'RYMCU,' + this.portfolio.portfolioTitle
                    },
                    {
                        name: 'description',
                        content: this.portfolio.portfolioDescription
                    },
                    {
                        name: 'site_name',
                        content: 'RYMCU'
                    },
                    {
                        name: 'url',
                        content: this.portfolio.portfolioPermalink
                    },
                    {
                        name: 'og:title',
                        content: this.portfolio.portfolioTitle + ' - RYMCU'
                    },
                    {
                        name: 'og:description',
                        content: this.portfolio.portfolioDescription
                    },
                    {
                        name: 'og:site_name',
                        content: 'RYMCU'
                    },
                    {
                        name: 'og:url',
                        content: this.portfolio.portfolioPermalink
                    }
                ]
            }
        },
        data() {
            return {
                portfolio: {},
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
                this.getArticleData(val);
            },
            async getArticleData(p){
                let _ts = this;
                const responseTopData = await this.axios.get('/console/portfolio/' + _ts.id + '/articles?page='+p);
                if (responseTopData) {
                    responseTopData.pagination.currentPage = p;
                    _ts.$set(_ts, 'articles', responseTopData.articles);
                    _ts.$set(_ts, 'pagination', responseTopData.pagination);
                    window.scrollTo(0, 0);
                }
            },
            async getData() {
                let _ts = this;
                let responseData = await _ts.axios.get('/console/portfolio/' + _ts.id);
                if (responseData) {
                    _ts.$set(_ts, 'portfolio', responseData.portfolio);
                    await _ts.getArticleData(_ts.pagination.currentPage);
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
            showBindArticleDialog(idPortfolio) {
                this.$router.push({
                    name: 'bind-article',
                    params: {
                        id: idPortfolio
                    }
                });
            },
        },
        mounted() {
            this.getData();
        }
    }
</script>

<style scoped>

</style>
