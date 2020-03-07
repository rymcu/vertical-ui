<template>
    <el-row class="pt-5">
        <el-col v-for="comment in comments" :key="comment.idComment">
            <el-col :xs="3" :sm="1" :xl="1">
                <el-avatar v-if="comment.commenter.userAvatarURL" :src="comment.commenter.userAvatarURL"></el-avatar>
                <el-avatar v-else src="https://rymcu.com/vertical/article/1578475481946.png"></el-avatar>
            </el-col>
            <el-col :xs="21" :sm="23" :xl="23">
                <el-col style="margin-left: 1rem;">
                    <el-col>
                        <el-link @click="onRouter('user', comment.commenter.userNickname)" :underline="false" class="text-default" >{{ comment.commenter.userNickname }}</el-link>
                        <small v-if="comment.commentOriginalCommentId" class="text-default" style="padding: 0 0.2rem;">回复了</small>
                        <span v-if="comment.commentOriginalCommentId">{{comment.commentOriginalCommentId}}</span>
                    </el-col>
                    <el-col>
                        <el-link :underline="false" class="text-default">{{ comment.timeAgo }}</el-link>
                    </el-col>
                </el-col>
                <el-col style="margin-left: 1rem;margin-top: 0.5rem;">
                    <div v-html="comment.commentContent"></div>
                </el-col>
            </el-col>
            <el-col class="text-right" style="margin-bottom: 0.5rem;">
                <el-link :underline="false" title="回复" @click.native="reply(comment)"><i class="el-icon-s-comment"></i></el-link>
            </el-col>
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
            }
        }
    }
</script>

<style scoped>

</style>
