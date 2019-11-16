<template>
    <el-row class="wrapper">
        <el-col :xs="24" :sm="24" :xl="24" style="margin: 0 auto;">
            <el-col v-for="article in articles" :key="article.oId" style="padding-bottom: 1rem;">
                <el-card>
                    <div class="card-body d-flex flex-column">
                        <el-link @click="onRouter('comment',article.oId)" :underline="false" style="margin-bottom: .5rem;">
                            <h4 v-html="article.articleTitle"></h4>
                        </el-link>
                        <div class="text-muted article-summary-md">{{ article.articlePreviewContent }}</div>
                        <el-row class="pt-5">
                            <el-col :xs="3" :sm="1" :xl="1" class="mr-3">
                                <div class="avatar avatar-md"
                                     :style="{backgroundImage:'url(' + article.articleAuthor.userAvatarURL + ')'}">
                                </div>
                            </el-col>
                            <el-col :xs="9" :sm="11" :xl="11">
                                <div>
                                    <el-link @click="onRouter('user', article.articleAuthorName)" :underline="false" class="text-default">{{ article.articleAuthor.userName }}</el-link>
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
        name: "Home",
        data() {
            return {
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
                const responseTopData = await this.axios.get('/articles/latest/perfect?p='+p);
                if (responseTopData) {
                    responseTopData.pagination.currentPage = p;
                    this.$set(this, 'articles', responseTopData.articles);
                    this.$set(this, 'pagination', responseTopData.pagination);
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
        mounted () {
            this.$store.commit('setActiveMenu', 'home');
            const p = this.pagination.currentPage;
            this.getData(p);
        }
    }
</script>

<style scoped>
</style>
