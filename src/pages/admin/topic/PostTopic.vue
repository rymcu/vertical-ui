<template>
    <el-row>
        <el-col style="margin-bottom: 1rem;">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/admin/topics' }">专题管理</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/admin/topic/' + topic.topicUri }">{{ topic.topicTitle }}</el-breadcrumb-item>
                <el-breadcrumb-item>编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col>
            <el-form :model="topic" :rules="rules" ref="topic" label-width="100px" class="demo-ruleForm">
                <el-form-item label="主题名称" prop="topicTitle">
                    <el-input v-model="topic.topicTitle"></el-input>
                </el-form-item>
                <el-form-item label="URI" prop="topicUri">
                    <el-input v-model="topic.topicUri"></el-input>
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
                        <img v-if="topicIconPath" class="topic-brand-img" :src="topicIconPath">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="导航主题">
                    <el-switch
                            v-model="topic.topicNva"
                            active-text="启用"
                            inactive-text="禁用"
                            active-value="0"
                            inactive-value="1">
                    </el-switch>
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch
                            v-model="topic.topicStatus"
                            active-text="启用"
                            inactive-text="禁用"
                            active-value="0"
                            inactive-value="1">
                    </el-switch>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="topic.topicSort" :min="1"></el-input-number>
                </el-form-item>
                <el-form-item label="标签数">
                    <el-input v-model="topic.topicTagCount" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="topic.topicDescription" type="textarea" :rows="5" maxlength="200" show-word-limit></el-input>
                </el-form-item>
                <el-form-item class="text-right">
                    <el-button @click="updateTopic" :loading="loading">提交</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "PostTopic",
        computed: {
            uploadHeaders() {
                let token = this.$store.getters.uploadHeaders;
                return { 'X-Upload-Token': token }
            }
        },
        props: ["id"],
        data() {
            return {
                topic: {
                    idTopic: 1,
                    topicTitle: '',
                    topicIconPath: '',
                    topicDescription: '',
                    topicNva: '0',
                    topicStatus: '0',
                    topicTagCount: 0,
                    topicSort: 10
                },
                rules: {
                    topicTitle: [
                        {required: true, message: '请输入主题名称', trigger: 'blur'}
                    ],
                    topicUri: [
                        {required: true, message: '请输入主题uri', trigger: 'blur'}
                    ]
                },
                loading: false,
                tokenURL: {
                    URL: '',
                    token: ''
                },
                topicIconPath: ''
            }
        },
        methods: {
            handleAvatarSuccess(res) {
                let _ts = this;
                if (res && res.data && res.data.url) {
                    let topic = _ts.topic;
                    topic.topicIconPath = res.data.url;
                    _ts.$set(_ts, 'topic', topic);
                    _ts.$set(_ts, 'topicIconPath', res.data.url);
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
            updateTopic() {
                let _ts = this;
                _ts.$set(_ts,'loading', true);
                let id = _ts.topic.idTopic;
                let title = id?'更新':'添加';
                _ts.axios[id?'put':'post']('/admin/topic/post', _ts.topic).then(function (res) {
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
                const responseData = await _ts.axios.get('/admin/topic/detail/' + _ts.id);
                if (responseData) {
                    _ts.$set(_ts,'topic',responseData);
                    _ts.$set(_ts,'topicIconPath',responseData.topicIconPath);
                }
            }
        },
        mounted() {
            let _ts = this;
            _ts.$store.commit("setActiveMenu", "admin-topic-post");
            this.axios.get('/upload/simple/token').then(function (res) {
                if (res) {
                    _ts.$store.commit('setUploadHeaders', res.uploadToken);
                    _ts.$set(_ts, 'tokenURL', {
                        token: res.uploadToken || '',
                        URL: res.uploadURL || '',
                    })
                }
            });
            _ts.getData();
        }
    }
</script>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>