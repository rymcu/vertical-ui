<template>
    <div class="article__wrapper">
        <el-col :xs="24" :sm="24" :xl="24">
            <el-card>
                <div class="card-body d-flex flex-column pipe-content__reset">
                    <h1 class="list__title" v-html="article.articleTitle"></h1>
                    <el-row class="pt-5">
                        <el-col :xs="3" :sm="1" :xl="1" class="mr-3">
                            <div class="avatar avatar-md"
                                 :style="{backgroundImage:'url(' + article.articleAuthor.userAvatarURL + ')'}">
                            </div>
                        </el-col>
                        <el-col :xs="9" :sm="11" :xl="11">
                            <div>
                                <el-link @click="onRouter('user', article.articleAuthorName)" :underline="false" class="text-default" >{{ article.articleAuthor.userName }}</el-link>
                                <small class="d-block text-muted">{{ article.timeAgo }}</small>
                            </div>
                        </el-col>
                    </el-row>
                    <div class="pt-7" v-html="article.articleContent" style="overflow: hidden;"></div>
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
                        userAvatarURL: 'https://b.yzcdn.cn/showcase/membercenter/2018/08/06/default_avatar@2x.png',
                        userName: ''
                    }
                },
                pagination: {
                    "paginationPageCount": 0,
                    "paginationPageNums": []
                }
            }
        },
        methods: {
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
            this.$store.commit('setActiveMenu', 'comment');
            const responseTopData = await this.axios.get('/article/'+this.$route.query.data);
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
    .article__wrapper {
        max-width: 980px;
        margin: 0 auto;
        display: block;
        padding-left: 1rem;
        padding-right: 1rem;
        box-sizing: border-box;
    }
</style>
