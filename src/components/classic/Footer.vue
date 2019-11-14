<template>
    <el-row class="footer">
        <el-col style="text-align: center;">
            <el-col :xs="24" :xl="12">
                <span>{{ slogan }}</span>
            </el-col>
            <el-col :xs="24" :xl="12">
                <el-col class="row align-items-center">
                    <el-col class="col-auto">
                        Copyright © 2019 <a href="/">{{ systemName }}</a>.
                    </el-col>
                </el-col>
            </el-col>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "Footer",
        data() {
            return {
                systemTitle: '\u7f57\u5409\u7f51\u0020\u002d\u0020\u5185\u5bb9\u5206\u4eab\u751f\u6001\u5e73\u53f0',
                systemName: 'RY MCU',
                systemUrl: 'https://rymcu.com',
                slogan: '\u5929\u4e0b\u7199\u7199\uff0c\u7686\u4e3a\u5229\u6765\uff1b\u5929\u4e0b\u6518\u6518\uff0c\u7686\u4e3a\u5229\u5f80\u3002'
            }
        }
    }
</script>

<style scoped>
</style>
