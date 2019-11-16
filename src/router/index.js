import Vue from 'vue'
import Router from 'vue-router'

import Index from '../pages/Index'
import Home from '../pages/home/Home'
import SpecialColumn from '../pages/SpecialColumn'
import Comment from '../pages/comment/Comment'
import User from '../pages/user/User'
import Login from '../pages/login/Login'
import Register from '../pages/register/Register'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'index',
            component: Index,
            children: [
                {
                    path: '/',
                    name: 'home',
                    component: Home
                },
                {
                    path: '/specialColumn',
                    name: 'specialColumn',
                    component: SpecialColumn
                },
                {
                    path: '/comment',
                    name: 'comment',
                    component: Comment
                },
                {
                    path: '/user',
                    name: 'user',
                    component: User
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
                    path: '*', redirect: '/'
                }
            ]
        },
        {
            path: '*', redirect: '/'
        }
    ]
})
