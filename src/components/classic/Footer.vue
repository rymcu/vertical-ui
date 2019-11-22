<template>
    <el-row class="footer">
        <el-col style="text-align: center;">
            <el-col :xs="24" :xl="12">
                <span>{{ slogan }}</span>
            </el-col>
            <el-col :xs="24" :xl="12">
                <el-col class="row align-items-center">
                    <el-col class="col-auto">
                        Copyright © 2019 <a href="/">{{ systemName }}</a>.  <span style="margin-left: 1.5rem;">{{ beiAn }}</span>
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
                slogan: 'rymcu · 嵌入式知识共享平台 Embedded knowledge sharing platform',
                beiAn: '沪ICP备19042611号'
            }
        }
    }
</script>

<style scoped>
    .footer {
        font-size: 14px;
        align-items: center;
        display: flex;
    }
</style>
