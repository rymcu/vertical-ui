<template>
    <el-container>
        <el-header>
            <Header></Header>
        </el-header>
        <el-main>
            <router-view/>
        </el-main>
        <el-footer>
            <Footer></Footer>
        </el-footer>
        <el-dialog
                title="登录"
                :visible.sync="showLoginDialog"
                width="30%"
                :before-close="hideLoginDialog"
                center>
                <el-form :model="user" status-icon :rules="rules" ref="ruleForm" label-width="100px" style="align-items: center;">
                    <el-form-item label="账号" prop="pass">
                        <el-input v-model="user.account" autocomplete="off" style="width: 275px;"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="pass">
                        <el-input type="password" v-model="user.password" autocomplete="off" style="width: 275px;" show-password></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="login" style="width: 135px;">登录</el-button>
                        <el-button @click="register" style="width: 130px;">注册</el-button>
                    </el-form-item>
                </el-form>
        </el-dialog>
    </el-container>
</template>

<script>
    import Header from "@/components/classic/Header";
    import Footer from "@/components/classic/Footer";
    export default {
        name: "Index",
        components: {
            Header,
            Footer
        },
        computed: {
            showLoginDialog () {
                return this.$store.state.login
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
                }
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
                        this.$message('error!')
                        return false;
                    }
                });
            },
            register() {}
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
