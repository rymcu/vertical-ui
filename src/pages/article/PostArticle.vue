<template>
    <el-row class="wrapper">
        <el-col>
            <el-input property="标题"></el-input>
        </el-col>
        <el-col>
            <div id="contentEditor"></div>
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
                tokenURL: ''
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
                        url: `${process.env.Server}/api/v1/markdown`,
                        parse: (element) => {
                            if (element.style.display === 'none') {
                                return
                            }
                            LazyLoadImage()
                            Vditor.highlightRender('github', false, document)
                        },
                        customEmoji: []
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
        },
        async mounted () {
            // const responseData = await this.axios.get('console/upload/token')
            // if (responseData) {
            //     this.$set(this, 'tokenURL', {
            //         token: responseData.uploadToken || '',
            //         URL: responseData.uploadURL || '',
            //     })
            // }
            this.contentEditor = this._initEditor({
                id: 'contentEditor',
                mode: 'both',
                height: 480,
                placeholder: '', //this.$t('inputContent', this.$store.state.locale)
                resize: false,
            });
            // this.abstractEditor = this._initEditor({
            //     id: 'abstractEditor',
            //     height: 160,
            //     mode: 'editor',
            //     placeholder: '', //this.$t('inputAbstract', this.$store.state.locale)
            //     resize: true,
            // });
        }
    }
</script>

<style scoped>

</style>