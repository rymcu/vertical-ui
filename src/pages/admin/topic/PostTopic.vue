<template>
    <el-row>
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
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="topic.topicIconPath" class="topic-brand-img" :src="topic.topicIconPath">
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
                loading: false
            }
        },
        methods: {
            handleAvatarSuccess(res, file) {
                this.topic.topicIconPath = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
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
                }
            }
        },
        mounted() {
            this.$store.commit("setActiveMenu", "admin-topic-post");
            this.getData();
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