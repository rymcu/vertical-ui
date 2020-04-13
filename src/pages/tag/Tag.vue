<template>
    <el-row class="wrapper">
        <el-col>
            <el-menu type="border-card" :default-active="getActiveTag" style="margin-top: -2px;border: 0;" mode="horizontal" @select="handleSelectTag">
                <el-menu-item index="51mcu">51 单片机</el-menu-item>
                <el-menu-item index="stm8">STM8</el-menu-item>
                <el-menu-item index="stm32-f1">STM32 F1</el-menu-item>
                <el-menu-item index="stm32-f4">STM32 F4</el-menu-item>
                <el-menu-item index="rt-thread">RT-thread 实时系统</el-menu-item>
                <el-menu-item index="tutorial">教程</el-menu-item>
            </el-menu>
        </el-col>
        <el-col style="margin: 0 auto;">
            <el-col v-for="article in articles" :key="article.idArticle" style="padding-bottom: 1rem;">
                <el-card>
                    <div class="card-body d-flex flex-column">
                        <el-link @click="onRouter('article',article.idArticle)" :underline="false" style="margin-bottom: .5rem;">
                            <h4 v-html="article.articleTitle"></h4>
                        </el-link>
                        <div class="text-muted article-summary-md">{{ article.articlePreviewContent }}</div>
                        <el-row class="pt-5">
                            <el-col :xs="3" :sm="1" :xl="1" class="mr-3">
                                <el-avatar v-if="article.articleAuthorAvatarUrl" size="medium" :src="article.articleAuthorAvatarUrl"></el-avatar>
                                <el-avatar v-else size="medium" src="https://rymcu.com/vertical/article/1578475481946.png"></el-avatar>
                            </el-col>
                            <el-col :xs="9" :sm="11" :xl="11">
                                <div>
                                    <el-link @click="onRouter('user', article.articleAuthorName)" :underline="false" class="text-default">{{ article.articleAuthorName }}</el-link>
                                    <small class="d-block text-muted">{{ article.timeAgo }}</small>
                                </div>
                                <div class="ml-auto text-muted">
                                    <a href="javascript:void(0)" class="icon d-none d-md-inline-block ml-3"><i
                                            class="fe fe-heart mr-1"></i></a>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
            </el-col>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "tag",
        props: ['tag'],
        computed: {
            getActiveTag () {
                return this.$store.state.activeTag;
            }
        },
        data() {
            return {
                articles: [],
                pagination: {
                    currentPage: 1,
                    pageSize: 20,
                    total: 0
                }
            }
        },
        methods: {
            currentChange(val){
                this.getData(val);
            },
            async getData(tag,p){
                const responseTopData = await this.axios.get('/console/articles?tag=' + tag + '&page='+p);
                if (responseTopData) {
                    responseTopData.pagination.currentPage = p;
                    this.$set(this, 'articles', responseTopData.articles);
                    this.$set(this, 'pagination', responseTopData.pagination);
                }
            },
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
            handleSelectTag(item) {
                this.$router.push(
                    {
                        name: 'tag',
                        params: {
                            tag: item
                        }
                    }
                )
            }
        },
        mounted () {
            this.$store.commit('setActiveMenu', 'tag');
            this.$store.commit('setActiveTag', this.tag);
            const tag = this.$store.state.activeTag;
            const p = this.pagination.currentPage;
            this.getData(tag,p);
        }
    }
</script>

<style scoped>

</style>
