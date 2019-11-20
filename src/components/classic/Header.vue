<template>
    <el-row justify="space-between">
        <el-col>
            <el-col :xs="16" :sm="4" :xl="2" style="padding-top: 1rem;">
                <a class="navbar-brand" href="/">
                    <img src="../../assets/rymcu.png" alt="RY MCU" class="navbar-brand-img">
                    <span>RY MCU</span>
                </a>
            </el-col>
            <el-col :xs="0" :sm="12" :xl="16" style="text-align: center;">
                <el-row type="flex" justify="center">
                    <el-col :sm="18" :xl="8">
                        <el-menu :default-active="getActiveMenu" style="margin-top: -2px;border: 0;" mode="horizontal" @select="handleSelectMenu">
                            <el-menu-item index="home">首页</el-menu-item>
                            <el-menu-item index="tag">专栏</el-menu-item>
                            <!--<el-menu-item index="3">问答</el-menu-item>
                            <el-menu-item index="4">关注</el-menu-item>-->
                        </el-menu>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :xs="8" :sm="8" :xl="6" style="padding-top: 1rem;">
                <!--<el-col :xs="24" :sm="16" :xl="12">-->
                <el-col :xs="0" :sm="0" :xl="0">
                    <el-autocomplete
                            v-model="state"
                            size="small"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="搜索帖子、标签和用户"
                            :trigger-on-focus="false"
                            @select="handleSelect"
                    />
                </el-col>
                <!--<el-col v-if="isLogin" :xs="0" :sm="8" :xl="6">-->
                <el-col v-if="isLogin">
                    <el-link :underline="false" style="padding-left: 10px;padding-right: 10px;" href="/postArticle">发帖</el-link>
                    <el-link :underline="false" style="margin-left: 10px;">
                        <el-dropdown trigger="click"  @command="handleCommand">
                            <el-avatar v-if="avatarURL" size="small" :src="avatarURL"></el-avatar>
                            <el-avatar v-else size="small" src="https://b.yzcdn.cn/showcase/membercenter/2018/08/06/default_avatar@2x.png"></el-avatar>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item style="align-items: center;">
                                    <el-avatar class="mr-3" v-if="avatarURL" size="small" :src="avatarURL"></el-avatar>
                                    <el-avatar class="mr-3" v-else size="small" src="https://b.yzcdn.cn/showcase/membercenter/2018/08/06/default_avatar@2x.png"></el-avatar>
                                    <el-link>{{ nickname }}</el-link>
                                </el-dropdown-item>
                                <el-dropdown-item command="info" divided>积分</el-dropdown-item>
                                <el-dropdown-item command="logout">登出</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-link>
                </el-col>
                <el-col v-else>
                    <el-link :underline="false" style="margin-left: 10px;" href="/login">登录</el-link>
                    <el-link :underline="false" style="margin-left: 10px;" href="/register">注册</el-link>
                </el-col>
            </el-col>
        </el-col>
    </el-row>
</template>

<script>
    /* eslint-disable no-console */

    export default {
        name: "Header",
        computed: {
            getActiveMenu () {
                return this.$store.state.activeMenu;
            },
            isLogin () {
                return this.$store.getters.isLogin;
            },
            avatarURL () {
                return this.$store.state.avatarURL;
            },
            nickname() {
                return this.$store.state.nickname;
            }
        },
        data() {
            return {
                restaurants: [],
                state: '',
                timeout:  null,
                show: false
            };
        },
        methods: {
            loadAll() {
                return [
                    { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
                    { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
                    { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" }
                ]
            },
            querySearchAsync(queryString, cb) {
                let restaurants = this.restaurants;
                let results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results);
                }, 3000 * Math.random());
            },
            createStateFilter(queryString) {
                return (state) => {
                    return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleSelectMenu(item) {
                let _ts = this;
                let activeMenu = _ts.$store.state.activeMenu;
                if (activeMenu !== item) {
                    this.$store.commit('setActiveMenu', item);
                    _ts.$router.push(
                        {
                            name: item
                        }
                    )
                }
            },
            handleSelect(item) {
                console.log(item)
            },
            toggleLogin() {
                this.$store.commit('setLogin', true)
            },
            handleCommand(item) {
                let _ts = this;
                if (item === 'logout'){
                    _ts.$store.commit('logout');
                    item = 'login';
                }
                this.$router.push({
                    name: item
                })
            }
        },
        mounted() {
            this.restaurants = this.loadAll();
        }

    }
</script>

<style scoped>
    .navbar-brand {
        color: inherit;
        margin-right: 1rem;
        font-size: 1.25rem;
        white-space: nowrap;
        font-weight: 600;
        padding: 0;
        transition: .3s opacity;
        line-height: 2rem;
    }
    .navbar-brand-img {
        height: 2rem;
        line-height: 2rem;
        vertical-align: bottom;
        margin-right: .5rem;
        width: auto;
    }
</style>
