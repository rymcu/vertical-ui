<template>
    <el-row class="wrapper">
        <el-col v-if="isEdit" style="margin-bottom: 1rem;">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/portfolio-manager/' + id }">{{ portfolio.portfolioTitle }}</el-breadcrumb-item>
                <el-breadcrumb-item>更新作品集</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col>
            <h1>创建作品集</h1>
        </el-col>
        <el-col style="margin-bottom: 1rem;">
            作品集需要有明确的写作方向，如果您在某个领域有深度的研究，欢迎创建自己的作品集分享自己的观点
        </el-col>
        <el-col>
            <el-form :model="portfolio" :rules="rules" ref="topic" label-width="100px">
                <el-form-item label="作品集名称" prop="name">
                    <el-input v-model="portfolio.portfolioTitle"></el-input>
                </el-form-item>
                <el-form-item label="图标">
                    <el-upload
                            class="avatar-uploader"
                            :action="tokenURL.URL"
                            :multiple="true"
                            :with-credentials="true"
                            :headers="uploadHeaders"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="headImgUrl" class="topic-brand-img" :src="headImgUrl">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>

                <el-form-item label="作品集介绍" prop="description">
                    <div id="contentEditor"></div>
                </el-form-item>
                <el-form-item class="text-right">
                    <el-button v-if="isEdit" @click="updatePortfolio" :loading="loading">更新</el-button>
                    <el-button v-else @click="updatePortfolio" :loading="loading">提交</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script>
    import { LazyLoadImage } from '../../plugins/utils'
    import Vditor from 'vditor'
    export default {
        name: "PostPortfolio",
        computed: {
            uploadHeaders() {
                let token = this.$store.getters.uploadHeaders;
                return { 'X-Upload-Token': token }
            }
        },
        props: ["id"],
        data() {
            return {
                portfolio: {
                    idPortfolio: 0
                },
                rules: {
                    name: [
                        {required: true, message: '请输入作品集名称', trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: '请输入作品集介绍', trigger: 'blur'}
                    ]
                },
                loading: false,
                tokenURL: {
                    URL: '',
                    token: ''
                },
                headImgUrl: '',
                isEdit: false
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
            handleAvatarSuccess(res) {
                let _ts = this;
                if (res && res.data && res.data.url) {
                    let portfolio = _ts.portfolio;
                    portfolio.headImgUrl = res.data.url;
                    _ts.$set(_ts, 'portfolio', portfolio);
                    _ts.$set(_ts, 'headImgUrl', res.data.url);
                } else {
                    _ts.$message.error('上传失败!');
                }
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!(isJPG || isPNG)) {
                    this.$message.error('上传图标只能是 JPG 或者 PNG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图标大小不能超过 2MB!');
                }
                return (isJPG || isPNG) && isLt2M;
            },
            async getData() {
                let _ts = this;
                const responseData = await _ts.axios.get('/portfolio/detail/' + _ts.id);
                if (responseData) {
                    _ts.$set(_ts,'portfolio',responseData.portfolio);
                    _ts.$set(_ts,'headImgUrl',responseData.portfolio.headImgUrl);
                    _ts.contentEditor.setValue(responseData.portfolio.portfolioDescription);
                }
            },
            async updatePortfolio() {
                let _ts = this;
                _ts.$set(_ts,'loading', true);
                let id = _ts.portfolio.idPortfolio;
                let portfolioDescription = _ts.contentEditor.getValue();
                let portfolioDescriptionHtml = await _ts.contentEditor.getHTML();
                let data = _ts.portfolio;
                data.portfolioDescription = portfolioDescription;
                data.portfolioDescriptionHtml = portfolioDescriptionHtml;
                let title = id?'更新':'添加';
                _ts.axios[id?'put':'post']('/portfolio/post', data).then(function (res) {
                    if (res && res.message) {
                        _ts.$message.error(res.message);
                    } else {
                        _ts.$message({
                            type: 'success',
                            message: title + '成功!'
                        });
                        _ts.$set(_ts,'loading', false);
                        _ts.getData();
                    }
                })
            }
        },
        mounted() {
            let _ts = this;
            _ts.$store.commit("setActiveMenu", "portfolio-post");
            this.axios.get('/upload/simple/token').then(function (res) {
                if (res) {
                    _ts.$store.commit('setUploadHeaders', res.uploadToken);
                    _ts.$set(_ts, 'tokenURL', {
                        token: res.uploadToken || '',
                        URL: res.uploadURL || '',
                    })
                }
            });

            this.contentEditor = this._initEditor({
                id: 'contentEditor',
                mode: 'both',
                height: 480,
                placeholder: '', //this.$t('inputContent', this.$store.state.locale)
                resize: false,
            });

            if (_ts.id) {
                _ts.$set(_ts, 'isEdit', true);
                _ts.getData();
            } else {
                _ts.$set(_ts, 'isEdit', false);
            }
        }
    }
</script>

<style lang="scss">
    @import "~vditor/src/assets/scss/classic.scss";
</style>
