import Vue from 'vue'
import Router from 'vue-router'

import Index from '../pages/Index'
import Home from '../pages/home/Home'
import Topic from '../pages/topic/Topic'
import Tag from '../pages/tag/Tag'
import Comment from '../pages/comment/Comment'
import Article from '../pages/article/Article'
import User from '../pages/user/User'
import Login from '../pages/login/Login'
import Register from '../pages/register/Register'
import PostArticle from '../pages/article/PostArticle'
import ForgetPassword from '../pages/forget/ForgetPassword'
import Admin from '../pages/admin/Index'
import AdminDashboard from '../pages/admin/dashboard/Dashboard'
import AdminUser from '../pages/admin/user/User'
import AdminTopic from '../pages/admin/topic/Topic'

/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error=> error)
};
Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            component: Index,
            children: [
                {
                    path: '/',
                    name: 'home',
                    component: Home
                },
                {
                    path: '/topic/:name',
                    name: 'topic',
                    component: Topic,
                    props: true
                },
                {
                    path: '/tag/:tag',
                    name: 'tag',
                    component: Tag,
                    props: true
                },
                {
                    path: '/article/:id',
                    name: 'article',
                    component: Article,
                    props: true
                },
                {
                    path: '/postArticle',
                    name: 'postArticle',
                    component: PostArticle
                },
                {
                    path: '/comment',
                    name: 'comment',
                    component: Comment
                },
                {
                    path: '/user/:id',
                    name: 'user',
                    component: User,
                    props: true
                },
                {
                    path: '/login',
                    name: 'login',
                    component: Login
                },
                {
                    path: '/register',
                    name: 'register',
                    component: Register
                },
                {
                    path: '/forget-password',
                    name: 'forget-password',
                    component: ForgetPassword
                },
                {
                    path: '/admin',
                    component: Admin,
                    children: [
                        {
                            path: '/',
                            name: 'admin-dashboard',
                            component: AdminDashboard
                        },
                        {
                            path: 'user',
                            name: 'admin-user',
                            component: AdminUser
                        },
                        {
                            path: 'topic',
                            name: 'admin-topic',
                            component: AdminTopic
                        },
                        {
                            path: 'post-topic',
                            name: 'admin-post-topic',
                            component: ()=>import('../pages/admin/topic/PostTopic')
                        },
                        {
                            path: 'topic-tag/:topicUri',
                            name: 'admin-topic-tag',
                            component: ()=>import('../pages/admin/topic/TopicTag'),
                            props: true
                        },
                        {
                            path: '*', redirect: '/'
                        }
                    ]
                },
                {
                    path: '*', redirect: '/'
                }
            ]
        },
        {
            path: '*', redirect: '/'
        }
    ]
})
