<template>
    <div class="article__wrapper">
        <el-col :xl="20">
            <el-card>
                <div  class="card-body d-flex flex-column">
                    <h1 v-html="article.articleTitle"></h1>
                    <el-row class="pt-5">
                        <el-col :span="1" class="mr-3">
                            <div class="avatar avatar-md"
                                 :style="{backgroundImage:'url(' + article.articleAuthor.userAvatarURL + ')'}">
                            </div>
                        </el-col>
                        <el-col :xl="4">
                            <div>
                                <router-link :to="{name: 'user', params: {userName: article.articleAuthorName}}" class="text-default" >{{ article.articleAuthor.userName }}</router-link>
                                <small class="d-block text-muted">{{ article.timeAgo }}</small>
                            </div>
                        </el-col>
                    </el-row>
                    <div class="pt-7 pipe-content__reset" v-html="article.articleContent" style="overflow: hidden;"></div>
                </div>
            </el-card>
        </el-col>
    </div>
</template>

<script>
    import Vue from 'vue';
    import $ from 'jquery';
    export default {
        name: "Comment",
        data (){
            return {
                article: {
                    articleTitle: '',
                    articleContent: '',
                    timeAgo:'',
                    articleAuthor: {
                        userAvatarURL: '',
                        userName: ''
                    }
                },
                pagination: {
                    "paginationPageCount": 0,
                    "paginationPageNums": []
                }
            }
        },
        async mounted () {
            this.$store.commit('setActiveMenu', 'comment');
            const responseTopData = await this.axios.get('/article/'+this.$route.query.data)
            if (responseTopData) {
                this.$set(this, 'article', responseTopData.article);
                this.$set(this, 'pagination', responseTopData.pagination);
                Vue.nextTick(() => {
                    $('*[data-src]').each(function () {
                        const testImage = this.getAttribute('data-src');
                        this.style.backgroundImage = 'url(' + testImage + ')';
                        this.removeAttribute('data-src');
                    })
                });
            }
        }
    }
</script>

<style lang="scss">
    @import '../../theme/scss/basic';
    @import '../../theme/scss/github';
    .article__wrapper {
        max-width: 768px;
        width: 90%;
        margin: 0 auto;
        display: block;
        padding-left: 15px;
        padding-right: 15px;
        box-sizing: border-box;
    }
</style>
