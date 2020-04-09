<template>
    <el-row>
        <el-col :xs="24" :xl="24">
            <div class="card card-profile">
                <div v-if="user.userHomeBImgURL" class="card-header" :style="{backgroundImage:'url('+user.userHomeBImgURL+')', backgroundSize:'percentage', backgroundPosition:'50%'}" ></div>
                <div v-else class="card-header" :style="{backgroundImage:'url(https://rymcu.com/vertical/article/1574441651963.jpg)', backgroundSize:'cover', backgroundPosition:'50%'}" ></div>
                <div class="card-body text-center">
                    <img v-if="user.avatarUrl" class="card-profile-img" :src="user.avatarUrl">
                    <img v-else class="card-profile-img" src="https://rymcu.com/vertical/article/1578475481946.png">
                    <h3 class="mb-3">{{user.nickname}}</h3>
                    <p class="mb-4" v-html="user.signature"></p>
                    <!--<el-button type="primary" plain round><span class="fe fe-plus"></span> 关注</el-button>-->
                </div>
            </div>
        </el-col>
        <el-col class="text-center" style="margin-bottom: 1rem;">
            <el-row type="flex" justify="center">
                <el-col>
                    <el-menu :default-active="activeTab" mode="horizontal" @select="handleToggleTab" style="padding-left: calc(50vw - 4.8rem);">
                        <el-menu-item index="0">文章</el-menu-item>
                        <el-menu-item index="1">作品集</el-menu-item>
                    </el-menu>
                </el-col>
            </el-row>
        </el-col>
        <el-col  v-if="activeTab === '0'">
            <el-col>
                <div class="wrapper">
                    <el-row class="row-cards row-deck" :gutter="10">
                        <el-col :sm="24" :md="8" :xl="6" v-for="article in articles" :key="article.idArticle">
                            <div class="card">
                                <a v-if="article.articleThumbnailUrl" ><img class="card-img-top" style="height: 10rem;" :src="article.articleThumbnailUrl"></a>
                                <a v-else><img class="card-img-top" style="height: 10rem;" src="https://rymcu.com/vertical/article/1574441170152.jpg"></a>
                                <div class="card-body d-flex flex-column">
                                    <h4 class="article-header-md"><el-link @click="onRouter('article',article.idArticle)" :underline="false" v-html="article.articleTitle"></el-link></h4>
                                    <div class="text-muted article-summary-md">{{ article.articlePreviewContent }}</div>
                                    <div class="d-flex align-items-center pt-5 mt-auto">
                                        <div class="ml-auto text-muted">
                                            <span>{{ article.timeAgo }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col v-if="!articles" class="text-center">
                            这里什么都没有!
                        </el-col>
                    </el-row>
                </div>
            </el-col>
            <el-col>
                <div class="vertical-container text-center">
                    <el-pagination v-show="pagination.total > 12" v-model="pagination"
                                   layout="prev, pager, next"
                                   :current-page="pagination.currentPage"
                                   :total="pagination.total"
                                   @current-change="getArticles">
                    </el-pagination>
                </div>
            </el-col>
        </el-col>
        <el-col v-else>
            <el-col>
                <div class="wrapper">
                    <el-row class="row-cards row-deck" :gutter="10">
                        <el-col v-for="portfolio in portfolios" :key="portfolio.idPortfolio">
                            <el-col class="card">
                                <el-col class="card-body d-flex flex-column">
                                    <el-col :span="4" class="mr-3">
                                        <a v-if="portfolio.headImgUrl" ><el-image class="card-img-top" style="height: 10rem;" :src="portfolio.headImgUrl"></el-image></a>
                                        <a v-else><el-image class="card-img-top" style="height: 10rem;" src="https://rymcu.com/vertical/article/1574441170152.jpg"></el-image></a>
                                    </el-col>
                                    <el-col :span="18">
                                        <h4 class="article-header-md"><el-link @click="onRouter('portfolio',portfolio.idPortfolio)" :underline="false" v-html="portfolio.name"></el-link></h4>
                                        <div class="text-muted article-summary-md">{{ portfolio.description }}</div>
                                        <div class="d-flex align-items-center pt-5 mt-auto">
                                            <div class="ml-auto text-muted">
                                                <span>{{ portfolio.timeAgo }}</span>
                                            </div>
                                        </div>
                                    </el-col>
                                </el-col>
                            </el-col>
                        </el-col>
                        <el-col v-if="!portfolios" class="text-center">
                            这里什么都没有!
                        </el-col>
                    </el-row>
                </div>
            </el-col>
            <el-col>
                <div class="vertical-container text-center">
                    <el-pagination v-show="portfolioPagination.total > 12" v-model="portfolioPagination"
                                   layout="prev, pager, next"
                                   :current-page="portfolioPagination.currentPage"
                                   :total="portfolioPagination.total"
                                   @current-change="getPortfolios">
                    </el-pagination>
                </div>
            </el-col>
        </el-col>
    </el-row>
</template>

<script>
    import Vue from 'vue';
    import MetaInfo from 'vue-meta-info';

    Vue.use(MetaInfo);
    export default {
        name: "User",
        props: ["id"],
        metaInfo() {
            return {
                // set a title
                title: this.user.nickname + ' 的主页 - RYMCU',
                // set meta
                meta: [
                    {
                        name: 'keywords',
                        content: 'RYMCU,' + this.user.nickname
                    },
                    {
                        name: 'description',
                        content: this.user.signature
                    },
                    {
                        name: 'site_name',
                        content: 'RYMCU'
                    },
                    {
                        name: 'url',
                        content: 'https://rymcu.com/user/' + this.id
                    },
                    {
                        name: 'og:title',
                        content: this.user.nickname + ' 的主页 - RYMCU',
                    },
                    {
                        name: 'og:description',
                        content: this.user.nickname + ' 的主页 - ' + this.user.signature
                    },
                    {
                        name: 'og:site_name',
                        content: 'RYMCU'
                    },
                    {
                        name: 'og:url',
                        content: 'https://rymcu.com/user/' + this.id
                    }
                ]
            }
        },
        data() {
            return {
                user: {
                    nickname: '',
                    avatarUrl: 'https://rymcu.com/vertical/article/1578475481946.png',
                    signature: ''
                },
                articles: [],
                pagination: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                portfolios: [],
                portfolioPagination: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                activeTab: '0'
            }
        },
        methods: {
            currentChange(val){
                this.getData(val);
            },
            getData(p){
                this.getArticles(p);
                this.getPortfolios(p);
            },
            async getArticles(p) {
                const responseTopData = await this.axios.get('/user/'+this.id+'/articles?page='+p);
                if (responseTopData) {
                    responseTopData.pagination.currentPage = p;
                    this.$set(this, 'articles', responseTopData.articles);
                    this.$set(this, 'pagination', responseTopData.pagination);
                }
            },
            async getPortfolios(p) {
                const responseTopData = await this.axios.get('/user/'+this.id+'/portfolios?page='+p);
                if (responseTopData) {
                    responseTopData.pagination.currentPage = p;
                    this.$set(this, 'portfolios', responseTopData.portfolios);
                    this.$set(this, 'portfolioPagination', responseTopData.pagination);
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
            handleToggleTab(key, keyPath) {
                this.$set(this, 'activeTab', key);
                console.log(key, keyPath);
            }
        },
        async mounted () {
            this.$store.commit('setActiveMenu', 'user');
            const responseTopData = await this.axios.get('/user/'+this.id)
            if (responseTopData) {
                this.user = responseTopData
            }
            const p = this.pagination.currentPage;
            this.getData(p);
        }
    }
</script>

<style scoped>
    body {
        overflow-x: hidden;
    }
    .card {
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        position: relative;
        margin-bottom: 1.5rem;
        width: 100%;
    }

    .card {
        position: relative;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-direction: column;
        flex-direction: column;
        min-width: 0;
        word-wrap: break-word;
        background-color: #fff;
        background-clip: border-box;
        border: 1px solid rgba(0, 40, 100, 0.12);
        border-radius: 3px;
    }
    .card-profile .card-header {
        height: 20rem;
        background-size: cover;
    }
    .card-header:first-child {
        border-radius: calc(3px - 1px) calc(3px - 1px) 0 0;
    }
    .card-header {
        background: none;
        padding: 0.5rem 1.5rem;
        display: -ms-flexbox;
        display: flex;
        min-height: 3.5rem;
        -ms-flex-align: center;
        align-items: center;
    }
    .card-header {
        padding: 1.5rem 1.5rem;
        margin-bottom: 0;
        background-color: rgba(0, 0, 0, 0.03);
        border-bottom: 1px solid rgba(0, 40, 100, 0.12);
    }
    .card-body {
        -ms-flex: 1;
        flex: 1;
        margin: 0;
        padding: 1.5rem 1.5rem;
        position: relative;
    }

    .card-profile-img {
        max-width: 6rem;
        margin-top: -5rem;
        margin-bottom: 1rem;
        border: 3px solid #fff;
        border-radius: 100%;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
        background-color: #ffffff;
    }
    .card-img-top {
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
    }

    .card-img-top {
        width: 100%;
        border-top-left-radius: calc(3px - 1px);
        border-top-right-radius: calc(3px - 1px);
    }
    .mb-3, .my-3 {
        margin-bottom: 0.75rem !important;
    }

    h3, .h3 {
        font-size: 1.5rem;
    }
    .mb-4, .my-4 {
        margin-bottom: 1rem !important;
    }
    .article-header-md {
        position: relative;
        line-height: 1.4em;
        height: 1.4em;
        overflow: hidden;
    }

    .article-header-md a {
        font-weight: bold;
        font-size: 1em;
    }

    .article-summary-md {
        position: relative;
        line-height: 1.4em;
        height: 4.2em;
        overflow: hidden;
    }
    .el-col-6 {
        padding-right: 0.75rem;
        padding-left: 0.75rem;
    }
</style>
