<template>
    <el-row class="wrapper">
        <el-col  v-if="isAuthor">
            <el-col>
                <el-col :xs="3" :sm="3" :xl="3" class="mr-3">
                    <el-image :src="portfolio.headImgUrl"></el-image>
                </el-col>
                <el-col :xs="20" :sm="20" :xl="20">
                    <el-col>
                        <h1>{{ portfolio.portfolioTitle }}</h1>
                    </el-col>
                    <el-col style="margin-bottom: .5rem;">
                        <span class="text-default" style="padding-right: 1rem;">作者</span>
                        <el-link @click="onRouter('user', portfolio.portfolioAuthorName)" :underline="false" class="text-default">
                            <el-avatar :src="portfolio.portfolioAuthorAvatarUrl" :size="16"></el-avatar> {{ portfolio.portfolioAuthorName }}
                        </el-link>
                    </el-col>
                    <el-col style="margin-bottom: .5rem;">
                        <span class="text-default" style="padding-right: 1rem;">文章</span> {{portfolio.articleNumber}}篇
                    </el-col>
                    <el-col style="margin-bottom: .5rem;" v-html="portfolio.portfolioDescription">
                    </el-col>
                </el-col>
            </el-col>
            <el-col>
                <el-col style="text-align: right;">
                    <el-col>
                        <el-link @click="onRouter('post-portfolio',portfolio.idPortfolio)" :underline="false" class="text-default" style="margin-right: 1rem;">编辑</el-link>
                        <el-link @click="showBindArticleDialog(portfolio.idPortfolio)" :underline="false" class="text-default" style="margin-right: 1rem;">添加文章</el-link>
                    </el-col>
                </el-col>
                <el-divider><i class="el-icon-loading"></i></el-divider>
                <el-col>
                    <el-table :data="articles" style="width: 100%">
                        <el-table-column
                                label="#"
                                width="40"
                                prop="idArticle">
                        </el-table-column>
                        <el-table-column
                                label="文章标题">
                            <template slot-scope="scope">
                                <el-link type="primary" @click.native="onRouter('article', scope.row.idArticle)" :underline="false">{{ scope.row.articleTitle }}</el-link>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="排序(回车更新)"
                                width="200">
                            <template slot-scope="scope">
                                <el-input-number v-model="scope.row.sortNo" @keyup.enter.native="updateArticleSortNo(scope.row)" :min="1"></el-input-number>
                            </template>
                        </el-table-column>
                    </el-table>
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
            </el-col>
        </el-col>
        <el-col v-else class="text-center">
            <el-alert
                    title="用户无权限"
                    type="warning"
                    center
                    show-icon
                    :closable="false">
            </el-alert>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "PortfolioManager",
        props: ["id"],
        computed: {
            isAuthor() {
                let name = this.portfolio.portfolioAuthorName;
                return this.$store.getters.isAuthor(name);
            }
        },
        data() {
            return {
                portfolio: {},
                articles: [],
                pagination: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                }
            }
        },
        methods: {
            currentChange(val){
                this.getArticleData(val);
            },
            async getArticleData(p){
                let _ts = this;
                const responseTopData = await this.axios.get('/console/portfolio/' + _ts.id + '/articles?page='+p);
                if (responseTopData) {
                    responseTopData.pagination.currentPage = p;
                    _ts.$set(_ts, 'articles', responseTopData.articles);
                    _ts.$set(_ts, 'pagination', responseTopData.pagination);
                    window.scrollTo(0, 0);
                }
            },
            async getData() {
                let _ts = this;
                let responseData = await _ts.axios.get('/console/portfolio/' + _ts.id);
                if (responseData) {
                    _ts.$set(_ts, 'portfolio', responseData.portfolio);
                    await _ts.getArticleData(_ts.pagination.currentPage);
                }
            },
            onRouter (name, data) {
                if (name === 'article') {
                    this.$router.push({
                        path: data
                    })
                } else {
                    this.$router.push(
                        {
                            path: '/post-portfolio/' + data
                        }
                    )
                }
            },
            showBindArticleDialog(idPortfolio) {
                this.$router.push({
                    name: 'bind-article',
                    params: {
                        id: idPortfolio
                    }
                });
            },
            updateArticleSortNo(article) {
                let _ts = this;
                if (article.sortNo) {
                    _ts.axios.put('/portfolio/update-article-sort-no',{
                        idArticle: article.idArticle,
                        idPortfolio: _ts.portfolio.idPortfolio,
                        sortNo: article.sortNo
                    }).then(function (res) {
                        if (res) {
                            _ts.$message(res.message);
                        }
                    })
                } else {
                    _ts.$message("排序号不能为空");
                }
            }
        },
        mounted() {
            this.getData();
        }
    }
</script>

<style scoped>

</style>
