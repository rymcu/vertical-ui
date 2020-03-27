<template>
    <el-container>
        <el-header>
            <Header></Header>
        </el-header>
        <el-main>
            <router-view/>
        </el-main>
        <el-footer style="height: auto;">
            <Footer></Footer>
        </el-footer>
        <div v-if="isPostArticle && isShow" style="position: fixed;bottom: 10vh;right: 3vw;">
            <el-col v-if="isPostArticle" :xs="0" :xl="24">
                <el-popover
                        placement="right"
                        width="20"
                        trigger="hover">
                    <el-col>
                        <el-image :src="rymcu"></el-image>
                    </el-col>
                    <el-col class="text-center">
                        <span>扫码关注公众号</span>
                    </el-col>
                    <el-button slot="reference" circle><img style="width: 14px;height: 14px;" :src="weiXin" fit="cover"/></el-button>
                </el-popover>
            </el-col>
            <el-col style="padding-top: 1rem;" :xs="0" :xl="24">
                <el-button circle @click="backTop" icon="el-icon-caret-top"></el-button>
            </el-col>
        </div>
    </el-container>
</template>

<script>
    import Header from "@/components/classic/Header";
    import Footer from "@/components/classic/Footer";
    import WeiXin from "@/assets/weixin.png";
    import Rymcu from "@/assets/rymcugzh.jpg";
    export default {
        name: "index",
        components: {
            Header,
            Footer
        },
        computed: {
            showLoginDialog () {
                return this.$store.state.login
            },
            isPostArticle() {
                if (this.$route.name == 'post-article') {
                    return false;
                }
                return true;
            }
        },
        data() {
            let validateAccount = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入账号'));
                } else {
                    if (this.user.account !== '') {
                        this.$refs.ruleForm.validateField('account');
                    }
                    callback();
                }
            };
            let validatePassWord = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.user.password !== '') {
                        this.$refs.ruleForm.validateField('password');
                    }
                    callback();
                }
            };
            return {
                rymcu: Rymcu,
                weiXin: WeiXin,
                user: {
                    account: '',
                    password: ''
                },
                rules: {
                    account: [
                        { validator: validateAccount, trigger: 'blur' }
                    ],
                    password: [
                        { validator: validatePassWord, trigger: 'blur' }
                    ]
                },
                isShow: false
            }
        },
        methods: {
            hideLoginDialog() {
                this.$store.commit('setLogin', false)
            },
            login() {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        this.$message('error!');
                        return false;
                    }
                });
            },
            register() {},
            backTop() {
                window.scrollTo(0, 0);
            },
            handleScroll(){
                let _ts = this;
                let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                if (scrollTop > 100) {
                    _ts.$set(_ts, 'isShow', true);
                } else {
                    _ts.$set(_ts, 'isShow', false);
                }
            }
        },
        mounted() {
            window.addEventListener('scroll',this.handleScroll,true);
        }
    }
</script>

<style scoped>
    .el-header {
        padding-bottom: 1rem;
        background: #fff;
        border-bottom: 1px solid rgba(0, 40, 100, 0.12);
        z-index: 80;
    }

    .el-main {
        padding: 20px 0;
        background-attachment: fixed;
        min-height: 280px;
        margin-bottom: 60px;
        overflow-x: hidden;
    }

    .el-footer {
        position: fixed;
        bottom: 0;
        width: 100%;
        padding-top: 1rem;
        padding-bottom: 1rem;
        background: #fff;
        border-top: 1px solid rgba(0, 40, 100, 0.12);
        z-index: 80;
    }
</style>
