<template>
    <el-row class="articles">
        <el-col>
            <el-input
                v-model="articleTitle"
                class="article-title"
                placeholder="请输入标题"
                @change="setLocalstorage('title',articleTitle)">
            </el-input>
        </el-col>
        <el-col>
            <div id="contentEditor"></div>
        </el-col>
        <el-col style="margin-top: 1rem;">
            <el-select
                    style="width: 100%;"
                    v-model="articleTags"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    remote
                    :remote-method="remoteMethod"
                    placeholder="请选择文章标签"
                    :loading="loading"
                    @change="setLocalstorage('tags',articleTags)">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </el-col>
        <el-col v-if="!isEdit" style="margin-top: 1rem;padding-right:3rem;text-align: right;">
            <el-button :loading="doLoading" @click="saveArticle">保存草稿</el-button>
            <el-button type="primary" :loading="doLoading" @click="postArticle">发布</el-button>
        </el-col>
        <el-col v-else style="margin-top: 1rem;padding-right:3rem;text-align: right;">
            <el-button type="danger" :loading="doLoading" @click="deleteArticle">删除</el-button>
            <el-button v-if="articleStatus === '0'" :loading="doLoading" type="primary" @click="postArticle">更新</el-button>
            <el-button v-else :loading="doLoading" @click="saveArticle">保存草稿</el-button>
        </el-col>
    </el-row>
</template>

<script>
    import { LazyLoadImage } from '../../plugins/utils'
    import Vditor from 'vditor'
    export default {
        name: "PostArticle",
        data() {
            return {
                tokenURL: {},
                idArticle: 0,
                articleTitle: '',
                articleContent: '',
                articleType: 0,
                articleTags: [],
                articleStatus: '0',
                options: [],
                list: [],
                loading: false,
                doLoading: false,
                isEdit: false,
                states: ["Alabama", "Alaska", "Arizona",
                    "Arkansas", "California", "Colorado",
                    "Connecticut", "Delaware", "Florida",
                    "Georgia", "Hawaii", "Idaho", "Illinois",
                    "Indiana", "Iowa", "Kansas", "Kentucky",
                    "Louisiana", "Maine", "Maryland",
                    "Massachusetts", "Michigan", "Minnesota",
                    "Mississippi", "Missouri", "Montana",
                    "Nebraska", "Nevada", "New Hampshire",
                    "New Jersey", "New Mexico", "New York",
                    "North Carolina", "North Dakota", "Ohio",
                    "Oklahoma", "Oregon", "Pennsylvania",
                    "Rhode Island", "South Carolina",
                    "South Dakota", "Tennessee", "Texas",
                    "Utah", "Vermont", "Virginia",
                    "Washington", "West Virginia", "Wisconsin",
                    "Wyoming"]
            }
        },
        methods: {
            _initEditor (data) {
                return new Vditor(data.id, {
                    tab: '\t',
                    cache: this.$route.query.id ? false : true,
                    preview: {
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
            setLocalstorage (type) {
                if (typeof arguments[0] === 'object') {
                    localStorage.setItem('articleTags', arguments[1]);
                    return
                }
                switch (type) {
                    case 'title': {
                        localStorage.setItem('article-title', arguments[1])
                        break;
                    }
                    case 'tags': {
                        localStorage.setItem('article-tags', arguments[1]);
                        break;
                    }
                }
            },
            _setDefaultLocalStorage () {
                if (localStorage.getItem('article-title')) {
                    this.title = localStorage.getItem('article-title')
                    this.$set(this, 'articleTitle', localStorage.getItem('article-title'))
                } else {
                    this.$set(this, 'articleTitle', '')
                }
                if (localStorage.getItem('article-tags')) {
                    this.$set(this, 'articleTags', localStorage.getItem('article-tags').split(','))
                } else {
                    this.$set(this, 'articleTags', [])
                }
            },
            remoteMethod(query) {
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        this.options = this.list.filter(item => {
                            return item.label.toLowerCase()
                                .indexOf(query.toLowerCase()) > -1;
                        });
                    }, 200);
                } else {
                    this.options = [];
                }
            },
            deleteArticle() {
                let _ts = this;
                _ts.doLoading = true;
                this.$confirm('确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let id = _ts.$route.query.id;
                    _ts.axios.delete('/article/delete/'+ id).then(function (res) {
                        console.log(res);
                        if(res){
                            _ts.$message(res.message);
                            return false;
                        }
                        localStorage.removeItem('article-title');
                        localStorage.removeItem('article-tags');
                        _ts.contentEditor.setValue('');
                        _ts.$router.push({
                            name: 'home'
                        })
                    })
                }).catch(() => {
                    _ts.doLoading = false;
                });

            },
            async postArticle() {
                let _ts = this;
                _ts.doLoading = true;
                let id = _ts.$route.query.id;
                let articleContent = _ts.contentEditor.getValue();
                let articleContentHtml = await _ts.contentEditor.getHTML();
                if(!(_ts.articleTitle && articleContent)){
                    _ts.$message("标题/正文不能为空！");
                    return false;
                }
                let article = {
                    idArticle: _ts.idArticle,
                    articleTitle: _ts.articleTitle,
                    articleContent: articleContent,
                    articleContentHtml: articleContentHtml,
                    articleTags: _ts.articleTags.join(","),
                    articleStatus: 0
                };
                _ts.axios[id ? 'put' : 'post']('/article/post', article).then(function (res) {
                    if(res) {
                        if (res.message) {
                            _ts.$message(res.message);
                            return false;
                        }
                        localStorage.removeItem('article-title');
                        localStorage.removeItem('article-tags');
                        _ts.contentEditor.setValue('');
                        _ts.$router.push({
                            name: 'article',
                            params: {
                                id: res.id
                            }
                        })
                    }
                })

            },
            async saveArticle() {
                let _ts = this;
                _ts.doLoading = true;
                let id = _ts.$route.query.id;
                let articleContent = _ts.contentEditor.getValue();
                let articleContentHtml = await _ts.contentEditor.getHTML();
                if(!(_ts.articleTitle && articleContent)){
                    _ts.$message("标题/正文不能为空！");
                    return false;
                }
                let article = {
                    idArticle: _ts.idArticle,
                    articleTitle: _ts.articleTitle,
                    articleContent: articleContent,
                    articleContentHtml: articleContentHtml,
                    articleTags: _ts.articleTags.join(","),
                    articleStatus: 1
                };
                _ts.axios[id ? 'put' : 'post']('/article/post', article).then(function (res) {
                    if(res) {
                        if (res.message) {
                            _ts.$message(res.message);
                            return false;
                        }
                        localStorage.removeItem('article-title');
                        localStorage.removeItem('article-tags');
                        _ts.contentEditor.setValue('');
                        _ts.$router.push({
                            name: 'article',
                            params: {
                                id: res.id
                            }
                        })
                    }
                })
            }
        },
        async mounted () {
            let _ts = this;
            this.$store.commit('setActiveMenu', 'post-article');
            const responseData = await this.axios.get('/upload/token');
            if (responseData) {
                this.$set(this, 'tokenURL', {
                    token: responseData.uploadToken || '',
                    URL: responseData.uploadURL || '',
                })
            }
            this.list = this.states.map(item => {
                return { value: item, label: item };
            });

            this.contentEditor = this._initEditor({
                id: 'contentEditor',
                mode: 'both',
                height: 480,
                placeholder: '', //this.$t('inputContent', this.$store.state.locale)
                resize: false,
            });

            let id = _ts.$route.query.id;

            if (id) {
                _ts.$set(_ts, 'isEdit', true);
                const responseData = await this.axios.get(`/article/detail/${id}`);
                if (responseData) {
                    let article = responseData.article;
                    this.$set(this, 'idArticle', article.idArticle);
                    this.$set(this, 'articleTitle', article.articleTitle);
                    this.$set(this, 'articleContent', article.articleContent);
                    this.$set(this, 'articleTags', (article.articleTags).split(','));
                    localStorage.setItem("article-title", article.articleTitle);
                    localStorage.setItem("article-tags", (article.articleTags).split(','));
                    this.contentEditor.setValue(article.articleContent);
                }
            } else {
                _ts.$set(_ts, 'isEdit', false);
                // set storage
                this._setDefaultLocalStorage();
                setTimeout(() => {
                    document.querySelector('.article-title .el-input__inner').focus()
                }, 100)
            }
        }
    }
</script>

<style lang="scss">
    @import "~vditor/src/assets/scss/classic.scss";
    .articles {
        //padding: 0 10px;
    }
</style>
