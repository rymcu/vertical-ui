<template>
    <div class="article__wrapper">
        <el-col :xs="24" :sm="24" :xl="24">
            <el-card>
                <div class="card-body d-flex flex-column article">
                    <div class="article__item">
                        <h1 class="list__title" v-html="article.articleTitle"></h1>
                        <el-row class="pt-5">
                            <el-col :xs="3" :sm="1" :xl="1">
                                <el-avatar v-if="article.articleAuthorAvatarUrl" :src="article.articleAuthorAvatarUrl"></el-avatar>
                                <el-avatar v-else src="https://rymcu.com/vertical/article/1578475481946.png"></el-avatar>
                            </el-col>
                            <el-col :xs="9" :sm="11" :xl="11">
                                <div style="margin-left: 1rem;">
                                    <el-link @click="onRouter('user', article.articleAuthorName)" :underline="false" class="text-default" >{{ article.articleAuthorName }}</el-link>
                                    <small class="d-block text-muted">{{ article.timeAgo }}</small>
                                </div>
                            </el-col>
                            <el-col :xs="12" :sm="12" :xl="12" v-if="hasPermissions" class="text-right">
                                <el-dropdown trigger="click"  @command="handleCommand">
                                    <el-link :underline="false"><i class="el-icon-more"></i></el-link>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="edit">编辑</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </el-col>
                            <el-col style="margin: 1rem 0;">
                                <el-tag
                                        style="margin-right: 0.5rem;"
                                        v-for="tag in article.tags"
                                        :key="tag.idTag"
                                        size="small"
                                        effect="plain">
                                    {{ tag.tagTitle }}
                                </el-tag>
                            </el-col>
                        </el-row>
                        <div class="pt-7 pipe-content__reset" v-html="article.articleContent" style="overflow: hidden;"></div>
                    </div>
                </div>
            </el-card>
        </el-col>
    </div>
</template>

<script>
    import Vue from 'vue';
    import $ from 'jquery';
    export default {
        name: "Article",
        props: ["id"],
        computed: {
            hasPermissions() {
                let account = this.$store.state.nickname;
                if(account){
                    if (account === this.article.articleAuthor.userNickname){
                        return true;
                    }
                }
                return this.$store.getters.hasPermissions('blog_admin');
            }
        },
        data (){
            return {
                article: {
                    articleTitle: '',
                    articleContent: '',
                    timeAgo:'',
                    articleAuthorName:'',
                    articleAuthorAvatarUrl:'',
                    articleAuthor: {
                        userAvatarURL: 'https://rymcu.com/vertical/article/1578475481946.png',
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
                        params: {
                            id: data
                        }
                    }
                )
            },
            handleCommand() {
                let _ts = this;
                this.$router.push({
                    name: 'post-article',
                    query: {
                        id: _ts.article.idArticle
                    }
                })
            }
        },
        async mounted () {
            this.$store.commit('setActiveMenu', 'article');
            const responseTopData = await this.axios.get('/console/article/'+this.id);
            if (responseTopData) {
                this.$set(this, 'article', responseTopData.article);
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
