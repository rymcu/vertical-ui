<template>
    <el-row class="article__wrapper">
        <el-col v-if="isShow">
            <el-col>
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
                                <el-col :xs="12" :sm="12" :xl="12" v-if="isLogin" class="text-right">
                                    <el-dropdown trigger="click"  @command="handleCommand">
                                        <el-link :underline="false"><i class="el-icon-more"></i></el-link>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item command="edit" v-if="hasPermissions">编辑</el-dropdown-item>
                                            <el-dropdown-item command="share">分享</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </el-col>
                                <el-col class="text-right">
                                    <el-link :underline="false" title="总浏览数"><i class="el-icon-s-data"></i><span style="color: red;">{{ article.articleViewCount }}</span></el-link>
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
                                <el-col v-if="article.portfolios && article.portfolios.length > 0">
                                    <el-col>
                                        <h4>所属作品集</h4>
                                    </el-col>
                                    <el-col style="padding: 1rem">
                                        <el-col v-for="portfolio in article.portfolios" :key="portfolio.idPortfolio" :span="8">
                                            <el-col :xs="3" :sm="3" :xl="3">
                                                <el-avatar :size="24" :src="portfolio.headImgUrl"></el-avatar>
                                            </el-col>
                                            <el-col :xs="20" :sm="20" :xl="20">
                                                <el-link @click="onRouter('portfolio', portfolio.idPortfolio)" :underline="false" class="text-default">{{ portfolio.portfolioTitle }}</el-link>
                                            </el-col>
                                        </el-col>
                                    </el-col>
                                </el-col>
                                <el-col v-if="isShare" style="margin-bottom: 1rem;">
                                    <el-input v-model="shareData.shareUrl">
                                        <el-popover slot="append"
                                                placement="bottom"
                                                width="20"
                                                trigger="hover">
                                            <el-col>
                                                <qrcode :value="shareWeiXin(shareData.shareUrl)" :options="{ width: 20 }"></qrcode>
                                            </el-col>
                                            <el-col class="text-center">
                                                <span>扫码分享至微信</span>
                                            </el-col>
                                            <el-button slot="reference"><el-image style="width: 14px;height: 14px;" :src="weiXin" fit="cover"></el-image></el-button>
                                        </el-popover>
                                    </el-input>
                                </el-col>
                            </el-row>
                            <div class="pt-7 pipe-content__reset" v-html="article.articleContent" style="overflow: hidden;"></div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col v-if="isLogin" style="margin-top: 1rem;">
                <el-col :xs="2" :sm="1" :xl="1">
                    <el-avatar :src="avatar"></el-avatar>
                </el-col>
                <el-col :xs="22" :sm="23" :xl="23" style="padding-left: 1rem;">
                    <el-input @click.native="showComment" placeholder="请输入回帖内容"></el-input>
                </el-col>
                <el-col>
                    <el-drawer
                            :visible.sync="drawer"
                            :direction="direction"
                            size="40%">
                        <el-col slot="title">
                            <el-col>
                                <el-avatar v-if="commentAuthorAvatar" :src="commentAuthorAvatar"></el-avatar>
                                <span class="text-default" style="padding-left: 1rem;">{{ title }}</span>
                            </el-col>
                        </el-col>
                        <el-col>
                            <div id="contentEditor"></div>
                        </el-col>
                        <el-col style="margin-top: 1rem;padding-right:3rem;text-align: right;">
                            <el-button type="primary" :loading="loading" @click="postComment">发布</el-button>
                        </el-col>
                    </el-drawer>
                </el-col>
            </el-col>
            <el-col v-else class="text-center" style="margin-top: 1rem;">
                <el-button type="primary" size="medium" @click="gotoLogin">登录</el-button> 后发布评论
            </el-col>
            <el-col>
                <Comment :comments="article.articleComments" :reply="reply"></Comment>
            </el-col>
        </el-col>
        <el-col v-else>
            <Component404></Component404>
        </el-col>
    </el-row>
</template>

<script>
    import Vue from 'vue';
    import $ from 'jquery';
    import MetaInfo from 'vue-meta-info';
    import Vditor from 'vditor';
    import {LazyLoadImage} from "../../plugins/utils";
    import Comment from '@/components/classic/comment/Comment';
    import Component404 from '@/components/classic/404';
    import WeiXin from "@/assets/weixin.png";
    import VueQrcode from '@chenfengyuan/vue-qrcode';
    Vue.component(VueQrcode.name, VueQrcode);

    Vue.use(MetaInfo);
    export default {
        name: "Article",
        props: ["id"],
        components: {
            Comment,
            Component404
        },
        computed: {
            hasPermissions() {
                let account = this.$store.state.nickname;
                if(account){
                    if (account === this.article.articleAuthor.userNickname){
                        return true;
                    }
                }
                return this.$store.getters.hasPermissions('blog_admin');
            },
            isLogin () {
                return this.$store.getters.isLogin;
            },
            avatar() {
                return this.$store.state.avatarURL;
            }
        },
        metaInfo() {
            return {
                // set a title
                title: this.article.articleTitle + ' - RYMCU',
                // set meta
                meta: [
                    {
                        name: 'keywords',
                        content: 'RYMCU,' + this.article.articleTags
                    },
                    {
                        name: 'description',
                        content: this.article.articlePreviewContent
                    },
                    {
                        name: 'site_name',
                        content: 'RYMCU'
                    },
                    {
                        name: 'url',
                        content: this.article.articlePermalink
                    },
                    {
                        name: 'og:title',
                        content: this.article.articleTitle + ' - RYMCU'
                    },
                    {
                        name: 'og:description',
                        content: this.article.articlePreviewContent
                    },
                    {
                        name: 'og:site_name',
                        content: 'RYMCU'
                    },
                    {
                        name: 'og:url',
                        content: this.article.articlePermalink
                    }
                ]
            }
        },
        data (){
            return {
                tokenURL: {},
                weiXin: WeiXin,
                drawer: false,
                direction: 'btt',
                initEditor: false,
                isShow: true,
                loading: false,
                title: '',
                commentAuthorAvatar: '',
                commentOriginalCommentId: 0,
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
                    "paginationPageCount": Number,
                    "paginationPageNums": Array
                },
                shareData: Object,
                isShare: false
            }
        },
        methods: {
            _initEditor (data) {
                let toolbar;
                if (window.innerWidth < 768) {
                    toolbar = [
                        'emoji',
                        'headings',
                        'bold',
                        'italic',
                        'strike',
                        'link',
                        '|',
                        'list',
                        'ordered-list',
                        'check',
                        'outdent',
                        'indent',
                        '|',
                        'quote',
                        'line',
                        'code',
                        'inline-code',
                        'insert-before',
                        'insert-after',
                        '|',
                        'upload',
                        'record',
                        'table',
                        '|',
                        'undo',
                        'redo',
                        '|',
                        'edit-mode',
                        'content-theme',
                        'code-theme',
                        {
                            name: 'more',
                            toolbar: [
                                'fullscreen',
                                'both',
                                'format',
                                'preview',
                                'info',
                                'help',
                            ],
                        }]
                }
                return new Vditor(data.id, {
                    toolbar,
                    mode: 'sv',
                    tab: '\t',
                    cache: {
                        enable: this.$route.query.id ? false : true,
                        id: this.$route.query.id ? this.$route.query.id : '',
                    },
                    preview: {
                        markdown: {
                            toc: true,
                        },
                        delay: 500,
                        mode: data.mode,
                        /*url: `${process.env.Server}/api/console/markdown`,*/
                        parse: (element) => {
                            if (element.style.display === 'none') {
                                return
                            }
                            LazyLoadImage();
                            Vditor.highlightRender({style:'github'}, element, document);
                        }
                    },
                    upload: {
                        max: 10 * 1024 * 1024,
                        url: this.tokenURL.URL,
                        linkToImgUrl: this.tokenURL.URL,
                        token: this.tokenURL.token,
                        filename: name => name.replace(/\?|\\|\/|:|\||<|>|\*|\[|\]|\s+/g, '-')
                    },
                    height: data.height,
                    counter: 102400,
                    resize: {
                        enable: data.resize,
                    },
                    lang: this.$store.state.locale,
                    placeholder: data.placeholder,
                })
            },
            _loadEditor() {
                let _ts = this;
                if (!_ts.initEditor) {
                    _ts.$set(_ts, 'initEditor', true);
                    setTimeout(function () {
                        _ts.contentEditor = _ts._initEditor({
                            id: 'contentEditor',
                            mode: 'both',
                            height: 200,
                            placeholder: '', //this.$t('inputContent', this.$store.state.locale)
                            resize: false,
                        });
                        _ts.contentEditor.setValue('');
                    }, 500);
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
            handleCommand(item) {
                let _ts = this;
                if (item === 'edit') {
                    _ts.$router.push({
                        name: 'post-article',
                        query: {
                            id: _ts.article.idArticle
                        }
                    })
                } else {
                    _ts.axios.get('/article/' + _ts.article.idArticle + '/share').then(function (res) {
                        if (res) {
                            _ts.$set(_ts, 'shareData', res);
                            _ts.$set(_ts, 'isShare', true);
                        }
                    });
                }
            },
            showComment() {
                let _ts = this;
                _ts.$set(_ts, 'drawer', true);
                _ts.$set(_ts, 'title', _ts.article.articleTitle);
                _ts.$set(_ts, 'commentAuthorAvatar', '');
                _ts.$set(_ts, 'commentOriginalCommentId', 0);
                _ts._loadEditor();
            },
            reply(comment) {
                let _ts = this;
                _ts.$set(_ts, 'drawer', true);
                _ts.$set(_ts, 'title', comment.commenter.userNickname);
                _ts.$set(_ts, 'commentAuthorAvatar', comment.commenter.userAvatarURL);
                _ts.$set(_ts, 'commentOriginalCommentId', comment.idComment);
                _ts._loadEditor();
            },
            async postComment() {
                let _ts = this;
                _ts.$set(_ts, 'loading', true);
                let commentContent = await _ts.contentEditor.getHTML();
                if(!(commentContent)){
                    _ts.$message("回帖内容不能为空！");
                    return false;
                }
                let comment = {
                    commentArticleId: _ts.article.idArticle,
                    commentContent: commentContent,
                    commentOriginalCommentId: _ts.commentOriginalCommentId,
                    commentAuthorId: _ts.$store.state.idUser
                };
                _ts.axios.post('/comment/post', comment).then(function (res) {
                    if(res) {
                        if (res.message) {
                            _ts.$message(res.message);
                            return false;
                        }
                        _ts.contentEditor.setValue('');
                        _ts.$set(_ts, 'drawer', false);
                        _ts.getComments();
                    }
                    _ts.$set(_ts, 'loading', false);
                })
            },
            getComments() {
                let _ts = this;
                _ts.axios.get('/article/' + _ts.article.idArticle + '/comments').then(function (res) {
                    if (res.message) {
                        _ts.$message(res.message);
                        return false;
                    }
                    let article = _ts.article;
                    article.articleComments = res.comments;
                    _ts.$set(_ts, 'article', article);
                })
            },
            gotoLogin() {
                this.$router.push({
                    name: 'login'
                })
            },
            shareWeiXin(url) {
                let path = url + '?s=' + this.$store.state.userNickname
                return path;
            }
        },
        async mounted () {
            let _ts = this;
            _ts.$store.commit('setActiveMenu', 'article');
            const responseTopData = await _ts.axios.get('/console/article/' + _ts.id);
            if (responseTopData && responseTopData.article) {
                let article = responseTopData.article;
                _ts.$set(_ts, 'article', article);
                _ts.$set(_ts, 'isShow', true);

                Vue.nextTick(() => {
                    $('*[data-src]').each(function () {
                        const testImage = this.getAttribute('data-src');
                        this.style.backgroundImage = 'url(' + testImage + ')';
                        this.removeAttribute('data-src');
                    })
                });
            } else {
                _ts.$set(_ts, 'isShow', false);
                return ;
            }

            if (_ts.isLogin) {
                const responseData = await this.axios.get('/upload/token');
                if (responseData) {
                    _ts.$set(_ts, 'tokenURL', {
                        token: responseData.uploadToken || '',
                        URL: responseData.uploadURL || '',
                    })
                }
            }

        }
    }
</script>

<style lang="scss">
    @import "~vditor/src/assets/scss/index.scss";
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
