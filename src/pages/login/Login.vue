<template>
    <el-row class="wrapper">
        <el-col :span="12" class="flex-inline">
            <el-form :model="user" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="账号" prop="pass">
                    <el-input v-model="user.account" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pass">
                    <el-input type="password" v-model="user.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="login">提交</el-button>
                    <el-button @click="register">注册</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="12">

        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "Login",
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
 .flex-inline {
     display: inline-flex;
     align-items: center;
 }
</style>
