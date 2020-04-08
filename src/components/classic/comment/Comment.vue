<template>
    <el-row class="pt-5">
        <el-col v-for="comment in comments" :key="comment.idComment">
            <el-card style="margin-bottom: 0.1rem;">
                <el-col :xs="3" :sm="1" :xl="1">
                    <el-avatar v-if="comment.commenter.userAvatarURL" :src="comment.commenter.userAvatarURL"></el-avatar>
                    <el-avatar v-else src="https://rymcu.com/vertical/article/1578475481946.png"></el-avatar>
                </el-col>
                <el-col :xs="21" :sm="23" :xl="23">
                    <el-col style="margin-left: 1rem;">
                        <el-col v-if="comment.commentOriginalCommentId">
                            <el-link @click="onRouter('user', comment.commenter.userNickname)" :underline="false" class="text-default" >{{ comment.commenter.userNickname }}</el-link>
                            <small class="text-default" style="margin: 0 0.2rem">回复了</small><span style="font-weight: bold;"> {{comment.commentOriginalAuthorNickname}}</span>
                        </el-col>
                        <el-col v-else>
                            <el-link @click="onRouter('user', comment.commenter.userNickname)" :underline="false" class="text-default" >{{ comment.commenter.userNickname }}</el-link>
                        </el-col>

                    </el-col>
                    <el-col style="padding: 1rem;">
                        <el-col>
                            <span v-html="comment.commentContent"></span>
                        </el-col>
                    </el-col>
                    <el-col :span="22" style="padding-left: 1rem;">
                        <el-link :underline="false" class="text-default">{{ comment.timeAgo }}</el-link>
                    </el-col>
                    <el-col :span="2" class="text-right" style="margin-bottom: 0.5rem;">
                        <el-link :underline="false" title="回复" @click.native="reply(comment)"><i class="el-icon-s-comment"></i></el-link>
                    </el-col>
                </el-col>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "Comment",
        props: {
            comments: Array,
            reply: {
                type: Function,
                default: null
            }
        },
        methods: {
            onRouter (name, data) {
                this.$router.push(
                    {
                        name: name,
                        params: {
                            id: data
                        }
                    }
                )
            },
            gotoComment (commentId) {
                console.log(commentId);
            }
        }
    }
</script>

<style scoped>

</style>
