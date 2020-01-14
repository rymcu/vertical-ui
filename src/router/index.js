import Vue from 'vue'
import Router from 'vue-router'

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
            component: ()=>import('../pages/Index'),
            children: [
                {
                    path: '/',
                    name: 'home',
                    component: ()=>import('../pages/home/Home')
                },
                {
                    path: '/topic/:name',
                    name: 'topic',
                    component: ()=>import('../pages/topic/Topic'),
                    props: true
                },
                {
                    path: '/tag/:tag',
                    name: 'tag',
                    component: ()=>import('../pages/tag/Tag'),
                    props: true
                },
                {
                    path: '/article/:id',
                    name: 'article',
                    component: ()=>import('../pages/article/Article'),
                    props: true
                },
                {
                    path: '/post-article',
                    name: 'post-article',
                    component: ()=>import('../pages/article/PostArticle')
                },
                {
                    path: '/comment',
                    name: 'comment',
                    component: ()=>import('../pages/comment/Comment')
                },
                {
                    path: '/user/:id',
                    name: 'user',
                    component: ()=>import('../pages/user/User'),
                    props: true
                },
                {
                    path: '/user-info',
                    component: ()=>import('../pages/user/Index'),
                    children: [
                        {
                            path: '/',
                            name: 'user-info',
                            component: ()=>import('../pages/user/UserInfo'),
                            props: true
                        },
                        {
                            path: '*', redirect: '/'
                        }
                    ]
                },
                {
                    path: '/login',
                    name: 'login',
                    component: ()=>import('../pages/login/Login')
                },
                {
                    path: '/register',
                    name: 'register',
                    component: ()=>import('../pages/register/Register')
                },
                {
                    path: '/forget-password',
                    name: 'forget-password',
                    component: ()=>import('../pages/forget/ForgetPassword')
                },
                {
                    path: '/notification',
                    name: 'notification',
                    component: ()=>import('../pages/notification/Notification')
                },
                {
                    path: '/admin',
                    component: ()=>import('../pages/admin/Index'),
                    children: [
                        {
                            path: '/',
                            name: 'admin-dashboard',
                            component: ()=>import('../pages/admin/dashboard/Dashboard')
                        },
                        {
                            path: 'user',
                            name: 'admin-user',
                            component: ()=>import('../pages/admin/user/User')
                        },
                        {
                            path: 'role',
                            name: 'admin-role',
                            component: ()=>import('../pages/admin/role/Role')
                        },
                        {
                            path: 'topics',
                            name: 'admin-topic',
                            component: ()=>import('../pages/admin/topic/Topic')
                        },
                        {
                            path: 'post-topic/:id',
                            name: 'admin-post-topic',
                            component: ()=>import('../pages/admin/topic/PostTopic'),
                            props: true
                        },
                        {
                            path: 'bind-topic-tag/:id',
                            name: 'admin-bind-topic-tag',
                            component: ()=>import('../pages/admin/topic/BindTopicTag'),
                            props: true
                        },
                        {
                            path: 'topic/:topicUri',
                            name: 'admin-topic-tag',
                            component: ()=>import('../pages/admin/topic/TopicTag'),
                            props: true
                        },
                        {
                            path: 'tags',
                            name: 'admin-tag',
                            component: ()=>import('../pages/admin/tag/Tag')
                        },
                        {
                            path: 'post-tag/:id',
                            name: 'admin-post-tag',
                            component: ()=>import('../pages/admin/tag/PostTag'),
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
