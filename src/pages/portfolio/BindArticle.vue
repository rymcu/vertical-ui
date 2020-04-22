<template>
    <el-row class="wrapper">
        <el-col style="margin-bottom: 1rem;">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/portfolio-manager/' + id }">返回上一级</el-breadcrumb-item>
                <el-breadcrumb-item>关联文章</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col>
            <el-input v-model="searchText" @keyup.enter.native="searchUnbindArticle" placeholder="输入帖子标题,回车检索"></el-input>
        </el-col>
        <el-col v-for="article in articles" :key="article.idArticle" style="padding-top: 1rem;">
            <el-card>
                <div class="card-body d-flex flex-column">
                    <el-link :underline="false" style="margin-bottom: .5rem;">
                        <h4 v-html="article.articleTitle"></h4>
                    </el-link>
                    <div class="text-muted article-summary-md">{{ article.articlePreviewContent }}</div>
                    <el-col class="text-right" style="padding: 1rem;">
                        <el-button @click="bindArticle(article.idArticle)" :loading="loading">添加至作品集</el-button>
                    </el-col>
                </div>
            </el-card>
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
        name: "BindArticle",
        props: ["id"],
        data() {
            return {
                articles: [],
                pagination: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                searchText: '',
                loading: false
            }
        },
        methods: {
            bindArticle(idArticle) {
                let _ts = this;
                _ts.$set(_ts, 'loading', true);
                _ts.axios.post('/portfolio/bind-article', {
                    idArticle: idArticle,
                    idPortfolio: _ts.id
                }).then(function (res) {
                    _ts.$set(_ts, 'loading', false);
                    if (res) {
                        _ts.$message(res.message);
                        _ts.searchUnbindArticle();
                    }
                })
            },
            searchUnbindArticle() {
                this.getData(this.pagination.currentPage);
            },
            async getData(p) {
                let _ts = this;
                let responseData = await _ts.axios.get('/portfolio/' + _ts.id + '/unbind-articles', {
                    params: {
                        page: p,
                        searchText: _ts.searchText
                    }
                });
                if (responseData) {
                    _ts.$set(_ts, 'articles', responseData.articles)
                }
            },
            currentChange(p) {
                this.getData(p);
            }
        },
        mounted() {
            this.getData(this.pagination.currentPage);
        }
    }
</script>

<style scoped>

</style>
