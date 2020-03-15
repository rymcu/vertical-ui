<template>
    <el-row class="wrapper">
        <el-col style="margin-bottom: 1rem;">
            <h1>我的草稿</h1>
        </el-col>
        <el-col v-for="article in articles" :key="article.idArticle">
            <el-col>
                <el-link  @click="onRouter(article.articleLink)" :underline="false">
                    <h2 v-html="article.articleTitle"></h2>
                </el-link>
            </el-col>
            <el-col>
                <small class="d-block text-muted">{{ article.timeAgo }}</small>
            </el-col>
            <el-col>
                <el-divider></el-divider>
            </el-col>
        </el-col>
        <el-col v-if="articles.length == 0" class="text-center">
            <span class="text-default">这里什么也没有!</span>
        </el-col>
        <el-col>
            <div class="vertical-container text-center">
                <el-pagination v-show="pagination.total > 10" v-model="pagination"
                               layout="prev, pager, next"
                               :current-page="pagination.currentPage"
                               :total="pagination.total"
                               @current-change="currentChange">
                </el-pagination>
            </div>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "DraftBox",
        data() {
            return {
                articles: Array,
                pagination: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                }
            }
        },
        methods: {
            async getData(p) {
                let _ts = this;
                let responseTopData = await _ts.axios.get('/article/drafts?page=' + p);
                if (responseTopData) {
                    responseTopData.pagination.currentPage = p;
                    _ts.$set(_ts, 'articles', responseTopData.articles);
                    _ts.$set(_ts, 'pagination', responseTopData.pagination);
                    window.scrollTo(0, 0);
                }
            },
            currentChange(val){
                this.getData(val);
            },
            onRouter (data) {
                this.$router.push({
                    path: data
                })
            }
        },
        mounted() {
            let _ts = this;
            _ts.$store.commit('setActiveMenu', 'draft-box');
            const p = _ts.pagination.currentPage;
            _ts.getData(p);
        }
    }
</script>

<style scoped>

</style>
