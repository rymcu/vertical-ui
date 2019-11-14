<template>
    <el-row class="wrapper">
        <el-col v-for="article in articles" :key="article.oId" style="padding-bottom: 20px;">
            <el-card>
                <div class="card-body d-flex flex-column">
                    <h4><router-link :to="{name: 'article', params: {oId: article.oId}}"  v-html="article.articleTitle"></router-link></h4>
                    <div class="text-muted article-summary-md">{{ article.articlePreviewContent }}</div>
                    <el-row class="pt-5">
                        <el-col :span="1" class="mr-3">
                            <div class="avatar avatar-md"
                                 :style="{backgroundImage:'url(' + article.articleAuthor.userAvatarURL + ')'}">
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div>
                                <router-link :to="{name: 'user', params: {userName: article.articleAuthorName}}" class="text-default">{{ article.articleAuthor.userName }}</router-link>
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
    </el-row>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                articles: [],
                pagination: {
                    "paginationPageCount": 0,
                    "paginationPageNums": [],
                    "currentPage": 1
                },
                followers: [],
                newbies: []
            }
        },
        methods: {
            currentChange(val){
                this.getData(val);
            },
            async getData(p){
                const responseTopData = await this.axios.get('articles/latest/perfect?p='+p);
                if (responseTopData) {
                    responseTopData.pagination.currentPage = p;
                    this.$set(this, 'articles', responseTopData.articles);
                    this.$set(this, 'pagination', responseTopData.pagination);
                }
            },
            async getFollowers(){
                const responseTopData = await this.axios.get('tops/users/followers');
                if(responseTopData){
                    this.$set(this,'followers',responseTopData.users)
                }
            },
            async getNewbies(){
                const responseTopData = await this.axios.get('tops/users/newbies');
                if(responseTopData){
                    this.$set(this,'newbies',responseTopData.users)
                }
            }
        },
        mounted () {
            const p = this.pagination.currentPage;
            this.getData(p);
            this.getFollowers();
            this.getNewbies();
        }
    }
</script>

<style scoped>
    .wrapper {
        width: 90%;
        margin: 0 auto;
        /*display: flex;*/
        min-width: 720px;
        max-width: 980px;
        float: none;
    }
</style>
