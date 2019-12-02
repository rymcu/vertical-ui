<template>
    <el-row>
        <el-col>
            <el-form :model="topic" :rules="rules" ref="topic" label-width="100px" class="demo-ruleForm">
                <el-form-item label="主题名称" prop="name">
                    <el-input v-model="topic.topicTitle"></el-input>
                </el-form-item>
                <el-form-item label="URI" prop="uri">
                    <el-input v-model="topic.topicURI"></el-input>
                </el-form-item>
                <el-form-item label="图标">
                    <el-upload
                            class="avatar-uploader"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="topic.topicIconPath" :src="topic.topicIconPath">
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
                    <el-input v-model="topic.topicDescription" maxlength="100" show-word-limit></el-input>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "PostTopic",
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
                    name: [
                        {required: true, message: '请输入主题名称', trigger: 'blur'}
                    ],
                    uri: [
                        {required: true, message: '请输入主题uri', trigger: 'blur'}
                    ]
                }
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
            }
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