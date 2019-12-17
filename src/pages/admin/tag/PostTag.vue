<template>
    <el-row>
        <el-col>
            <el-form ref="form" :model="tag" label-width="80px">
                <el-form-item label="标签名">
                    <el-input v-model="tag.tagTitle"></el-input>
                </el-form-item>
                <el-form-item label="URI">
                    <el-input v-model="tag.tagUri"></el-input>
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
                        <img v-if="tagIconPath" class="tag-brand-img" :src="tagIconPath">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch
                        v-model="tag.tagStatus"
                        active-text="正常"
                        inactive-text="禁用"
                        active-value="0"
                        inactive-value="1">
                    </el-switch>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="tag.tagDescription" type="textarea" :rows="5" maxlength="200" show-word-limit></el-input>
                </el-form-item>
                <el-form-item class="text-right">
                    <el-button @click="updateTag" :loading="loading">提交</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "PostTag",
        computed: {
            uploadHeaders() {
                let token = this.$store.getters.uploadHeaders;
                return { 'X-Upload-Token': token }
            }
        },
        props: ["id"],
        data() {
            return {
                tag: {
                    tagIconPath: ''
                },
                tokenURL: {
                    URL: '',
                    token: ''
                },
                tagIconPath: '',
                loading: false
            }
        },
        methods: {
            handleAvatarSuccess(res) {
                let _ts = this;
                if (res && res.data && res.data.url) {
                    let tag = _ts.tag;
                    tag.tagIconPath = res.data.url;
                    _ts.$set(_ts, 'tag', tag);
                    _ts.$set(_ts, 'tagIconPath', res.data.url);
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
            updateTag() {
                let _ts = this;
                _ts.$set(_ts,'loading', true);
                let id = _ts.tag.idTag;
                let title = id?'更新':'添加';
                _ts.axios[id?'put':'post']('/admin/tag/post', _ts.tag).then(function (res) {
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
                const responseData = await _ts.axios.get('/admin/tag/detail/' + _ts.id);
                if (responseData) {
                    _ts.$set(_ts,'tag',responseData);
                    if (responseData.tagIconPath) {
                        _ts.$set(_ts,'tagIconPath',responseData.tagIconPath);
                    }
                }
            }
        },
        mounted() {
            let _ts = this;
            this.$store.commit('setActiveMenu', 'postAdminTag');
            this.axios.get('/upload/simple/token').then(function (res) {
                if (res) {
                    _ts.$store.commit('setUploadHeaders', res.uploadToken);
                    _ts.$set(_ts, 'tokenURL', {
                        token: res.uploadToken || '',
                        URL: res.uploadURL || '',
                    })
                }
            });

            _ts.getData()
        }
    }
</script>

<style scoped>

</style>