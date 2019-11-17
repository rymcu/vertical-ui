<template>
    <el-row>
        <el-col>
            <el-input v-model="article.articleTitle" placeholder="请输入标题"></el-input>
        </el-col>
        <el-col>
            <div id="contentEditor"></div>
        </el-col>
        <el-col style="margin-top: 1rem;">
            <el-select
                    style="width: 100%;"
                    v-model="value"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    remote
                    :remote-method="remoteMethod"
                    placeholder="请选择文章标签"
                    :loading="loading">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
        </el-col>
        <el-col style="margin-top: 1rem;padding-right:3rem;text-align: right;">
            <el-button type="primary" @click="postArticle">发布</el-button>
        </el-col>
    </el-row>
</template>

<script>
    /* eslint-disable no-console,no-useless-escape */
    import { LazyLoadImage } from '../../plugins/utils'
    import Vditor from 'vditor'
    export default {
        name: "postArticle",
        data() {
            return {
                tokenURL: {},
                article: {
                    articleTitle: '',
                    articleType: 0
                },
                options: [],
                value: [],
                list: [],
                loading: false,
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
                        token: this.tokenURL.token,
                        filename: name => name.replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '').
                        replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '').
                        replace('/\\s/g', ''),
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
            async postArticle() {
                let _ts = this;
                let articleContent = _ts.contentEditor.getValue();
                let articleContentHtml = await _ts.contentEditor.getHTML();
                let article = {
                    idArticle: _ts.article.idArticle,
                    articleTitle: _ts.article.articleTitle,
                    articleContent: articleContent,
                    articleContentHtml: articleContentHtml,
                    articleTags: _ts.value.join(",")
                };
                _ts.axios.post('/article/post',_ts.qs.stringify(article)).then(function (res) {
                    console.log(res);
                    if(res) {
                        if (res.message) {
                            _ts.$message(res.message);
                            return false;
                        }
                        _ts.$router.push({
                            name: 'article',
                            query: {
                                data: res.id
                            }
                        })
                    }
                })

            }
        },
        async mounted () {
            // const responseData = await this.axios.get('/upload/token?q=1');
            // if (responseData) {
            //     this.$set(this, 'tokenURL', {
            //         token: responseData.uploadToken || '',
            //         URL: responseData.uploadURL || '',
            //     })
            // }
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
        }
    }
</script>

<style lang="scss">
    @import "~vditor/src/assets/scss/classic.scss";
</style>