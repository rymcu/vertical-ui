<template>
    <el-row>
        <el-col style="margin-bottom: 1rem;">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/admin/special-day' }">特殊日管理</el-breadcrumb-item>
                <el-breadcrumb-item v-if="id">编辑</el-breadcrumb-item>
                <el-breadcrumb-item v-else>创建</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col>
            <el-form :model="specialDay" :rules="rules" ref="topic" label-width="100px" class="demo-ruleForm">
                <el-form-item label="名称" prop="topicTitle">
                    <el-input v-model="specialDay.specialDayName"></el-input>
                </el-form-item>
                <el-form-item label="展示图">
                    <el-upload
                            class="avatar-uploader"
                            :action="tokenURL.URL"
                            :multiple="true"
                            :with-credentials="true"
                            :headers="uploadHeaders"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imgUrl" class="topic-brand-img" :src="imgUrl">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="重复">
                    <el-switch
                            v-model="specialDay.repeat"
                            active-text="是"
                            inactive-text="否"
                            :active-value="1"
                            :inactive-value="0">
                    </el-switch>
                </el-form-item>
                <el-form-item label="起止时间">
                    <el-date-picker
                            v-model="dateTime"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="权重">
                    <el-input-number v-model="specialDay.weights" :min="1"></el-input-number>
                </el-form-item>
                <el-form-item label="样式">
                    <el-input type="textarea" v-model="specialDay.cssStyle"></el-input>
                </el-form-item>
                <el-form-item class="text-right">
                    <el-button @click="updateSpecialDay" :loading="loading">提交</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "PostSpecialDay",
        computed: {
            uploadHeaders() {
                let token = this.$store.getters.uploadHeaders;
                return { 'X-Upload-Token': token }
            }
        },
        props: ["id"],
        data() {
            return {
                specialDay: {
                    specialDayName: '',
                    startTime: '',
                    expirationTime: '',
                    repeat: 0,
                    weights: 10,
                    cssStyle: ''
                },
                rules: {
                    specialDayName: [
                        {required: true, message: '请输入特殊日名称', trigger: 'blur'}
                    ]
                },
                loading: false,
                tokenURL: {
                    URL: '',
                    token: ''
                },
                imgUrl: '',
                dateTime: Array
            }
        },
        methods: {
            handleAvatarSuccess(res) {
                let _ts = this;
                if (res && res.data && res.data.url) {
                    let specialDay = _ts.specialDay;
                    specialDay.imgUrl = res.data.url;
                    _ts.$set(_ts, 'specialDay', specialDay);
                    _ts.$set(_ts, 'imgUrl', res.data.url);
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
            updateSpecialDay() {
                let _ts = this;
                _ts.$set(_ts,'loading', true);
                let id = _ts.specialDay.idSpecialDay;
                let title = id?'更新':'添加';
                _ts.axios[id?'put':'post']('/admin/special-day/post', _ts.specialDay).then(function (res) {
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
            },
            async getData() {
                let _ts = this;
                const responseData = await _ts.axios.get('/admin/special-day/detail/' + _ts.id);
                if (responseData) {
                    _ts.$set(_ts,'topic',responseData);
                    _ts.$set(_ts,'topicIconPath',responseData.topicIconPath);
                }
            }
        },
        mounted() {
            let _ts = this;
            _ts.$store.commit("setActiveMenu", "admin-special-day-post");
            this.axios.get('/upload/simple/token').then(function (res) {
                if (res) {
                    _ts.$store.commit('setUploadHeaders', res.uploadToken);
                    _ts.$set(_ts, 'tokenURL', {
                        token: res.uploadToken || '',
                        URL: res.uploadURL || '',
                    })
                }
            });
            if (_ts.id) {
                _ts.getData();
            }
        }
    }
</script>

<style scoped>

</style>
