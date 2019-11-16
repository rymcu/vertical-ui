<template>
    <el-row>
        <el-col :xs="24" :xl="24">
            <div class="card card-profile">
                <div v-if="!user.userHomeBImgURL" class="card-header" :style="{backgroundImage:'url(https://img.hacpai.com/bg/home/1353745196544_1560001814590.jpg)', backgroundSize:'cover', backgroundPosition:'50%'}" ></div>
                <div v-if="user.userHomeBImgURL" class="card-header" :style="{backgroundImage:'url('+user.userHomeBImgURL+')', backgroundSize:'cover', backgroundPosition:'50%'}" ></div>
                <div class="card-body text-center">
                    <img class="card-profile-img" :src="user.userAvatarURL">
                    <h3 class="mb-3">{{user.userName}}</h3>
                    <p class="mb-4" v-html="user.userIntro"></p>
                    <!--<el-button type="primary" plain round><span class="fe fe-plus"></span> 关注</el-button>-->
                </div>
            </div>
        </el-col>
        <el-col>
            <div class="wrapper">
                <el-row class="row-cards row-deck" :gutter="10">
                    <el-col :sm="24" :xl="6" v-for="article in articles" :key="article.oId">
                        <div class="card">
                            <a v-show="article.articleImg1URL" ><img class="card-img-top" style="height: 10rem;" :src="article.articleImg1URL"></a>
                            <a v-show="!article.articleImg1URL"><img class="card-img-top" style="height: 10rem;" src="https://b.yzcdn.cn/showcase/membercenter/2018/08/06/default_avatar@2x.png"></a>
                            <div class="card-body d-flex flex-column">
                                <h4 class="article-header-md"><el-link @click="onRouter('article',article.oId)" :underline="false" v-html="article.articleTitle"></el-link></h4>
                                <div class="text-muted article-summary-md">{{ article.articlePreviewContent }}</div>
                                <div class="d-flex align-items-center pt-5 mt-auto">
                                    <div class="ml-auto text-muted">
                                        <span>{{ article.timeAgo }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-col>
        <!--<el-col>
            <div class="vertical-container text-center">
                <el-pagination v-show="pagination" v-model="pagination"
                               :page-size="20"
                               :pager-count="8"
                               layout="prev, pager, next"
                               :current-page="pagination.currentPage"
                               :page-count="pagination.paginationPageCount"
                               @current-change="currentChange">
                </el-pagination>
            </div>
        </el-col>-->
    </el-row>
</template>

<script>
    export default {
        name: "User",
        data() {
            return {
                user: {
                    userName: '',
                    userAvatarURL: 'https://b.yzcdn.cn/showcase/membercenter/2018/08/06/default_avatar@2x.png',
                    userIntro: ''
                },
                articles: [],
                pagination: {
                    "paginationPageCount": 0,
                    "paginationPageNums": [],
                    "currentPage": 1
                }
            }
        },
        methods: {
            currentChange(val){
                this.getData(val);
            },
            async getData(p){
                const responseTopData = await this.axios.get('/user/'+this.$route.query.data+'/articles?p='+p);
                if (responseTopData) {
                    responseTopData.pagination.currentPage = p;
                    this.$set(this, 'articles', responseTopData.articles)
                    this.$set(this, 'pagination', responseTopData.pagination)
                }
            },
            onRouter (name, data) {
                this.$router.push(
                    {
                        name: name,
                        query: {
                            data: data
                        }
                    }
                )
            }
        },
        async mounted () {
            this.$store.commit('setActiveMenu', 'user');
            const responseTopData = await this.axios.get('/user/'+this.$route.query.data)
            if (responseTopData) {
                this.user = responseTopData.user
            }
            const p = this.pagination.currentPage;
            this.getData(p);
        }
    }
</script>

<style scoped>
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
