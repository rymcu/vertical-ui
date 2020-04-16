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
    scrollBehavior (to, from, savedPosition) {
        console.log(to,from,savedPosition);
        // 如果你的連結是帶 # 這種
        // to.hash 就會有值(值就是連結)
        // 例如 #3
        if (to.hash) {
            return {
                // 這個是透過 to.hash 的值來找到對應的元素
                // 照你的 html 來看是不用多加處理這樣就可以了
                // 例如你按下 #3 的連結，就會變成 querySelector('#3')，自然會找到 id = 3 的元素
                selector: to.hash
            }
        }
    },
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
                    path: '/draft/:id',
                    name: 'draft',
                    component: ()=>import('../pages/article/Draft'),
                    props: true
                },
                {
                    path: '/post-article',
                    name: 'post-article',
                    component: ()=>import('../pages/article/PostArticle')
                },
                {
                    path: '/drafts',
                    name: 'drafts',
                    component: ()=>import('../pages/article/DraftBox')
                },
                {
                    path: '/comment',
                    name: 'comment',
                    component: ()=>import('../components/classic/comment/Comment')
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
                    path: '/portfolio/:id',
                    name: 'portfolio',
                    component: ()=>import('../pages/portfolio/Portfolio'),
                    props: true
                },
                {
                    path: '/portfolio-manager/:id',
                    name: 'portfolio-manager',
                    component: ()=>import('../pages/portfolio/PortfolioManager'),
                    props: true
                },
                {
                    path: '/post-portfolio',
                    name: 'post-portfolio',
                    component: ()=>import('../pages/portfolio/PostPortfolio')
                },
                {
                    path: '/post-portfolio/:id',
                    name: 'put-portfolio',
                    component: ()=>import('../pages/portfolio/PostPortfolio'),
                    props: true
                },
                {
                    path: '/portfolio/:id/bind-article',
                    name: 'bind-article',
                    component: ()=>import('../pages/portfolio/BindArticle'),
                    props: true
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
                            path: '/special-day',
                            name: 'admin-special-day',
                            component: ()=>import('../pages/special/SpecialDay')
                        },
                        {
                            path: '/post-special-day',
                            name: 'admin-post-special-day',
                            component: ()=>import('../pages/special/PostSpecialDay')
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
