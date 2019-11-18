<template>
    <div class="article__wrapper">
        <el-col :xs="24" :sm="24" :xl="24">
            <el-card>
                <div class="card-body d-flex flex-column">
                    <article class="article__item">
                        <h1 class="list__title" v-html="article.articleTitle"></h1>
                        <el-row class="pt-5">
                            <el-col :xs="3" :sm="1" :xl="1" class="mr-3">
                                <el-avatar v-if="article.articleAuthorAvatarUrl" :src="article.articleAuthorAvatarUrl"></el-avatar>
                                <el-avatar v-else src="https://b.yzcdn.cn/showcase/membercenter/2018/08/06/default_avatar@2x.png"></el-avatar>
                            </el-col>
                            <el-col :xs="9" :sm="11" :xl="11">
                                <div>
                                    <el-link @click="onRouter('user', article.articleAuthorName)" :underline="false" class="text-default" >{{ article.articleAuthorName }}</el-link>
                                    <small class="d-block text-muted">{{ article.timeAgo }}</small>
                                </div>
                            </el-col>
                        </el-row>
                        <div class="pt-7 pipe-content__reset" v-html="article.articleContent" style="overflow: hidden;"></div>
                    </article>
                </div>
            </el-card>
        </el-col>
    </div>
</template>

<script>
    import Vue from 'vue';
    import $ from 'jquery';
    export default {
        name: "article",
        props: ["id"],
        data (){
            return {
                article: {
                    articleTitle: '',
                    articleContent: '',
                    timeAgo:'',
                    articleAuthorName:'',
                    articleAuthorAvatarUrl:'',
                    articleAuthor: {
                        userAvatarURL: 'https://b.yzcdn.cn/showcase/membercenter/2018/08/06/default_avatar@2x.png',
                        userNickname: ''
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
            this.$store.commit('setActiveMenu', 'article');
            const responseTopData = await this.axios.get('/article/detail/'+this.id);
            if (responseTopData) {
                // eslint-disable-next-line no-console
                console.log(responseTopData)
                this.$set(this, 'article', responseTopData.article);
                //this.$set(this, 'pagination', responseTopData.pagination);
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
        max-width: 980px;
        margin: 0 auto;
        display: block;
        padding-left: 1rem;
        padding-right: 1rem;
        box-sizing: border-box;
    }
</style>
