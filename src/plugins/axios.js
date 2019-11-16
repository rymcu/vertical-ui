/* eslint-disable no-console */
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vue from 'vue'

// eslint-disable-next-line no-unused-vars
export default (ctx) => {
    const customAxios = axios.create({
        baseURL: '/api'
    })

    customAxios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
    customAxios.defaults.headers.common['x-requested-with'] = 'XMLHttpRequest'

    Vue.use(VueAxios, customAxios)

    customAxios.interceptors.request.use((config) => {
        if(!config.url){
            config.url = 'articles/latest/perfect?p=1'
        }
        // clear cache
        // if (config.method === 'get') {
        //   let char = '?'
        //   if (config.url.split('?').length > 1) {
        //     char = '&'
        //   }
        //   config.url += `${char}${(new Date()).getTime()}`
        // }
        return config
    })

    customAxios.interceptors.response.use((response) => {
        if (response.config.method === 'get' || response.config.method === 'delete') {
            // get and delete use snack tip
            if (response.data.code === 0 || response.data.sc === 0) {
                return response.data.data
            } else {
                // eslint-disable-next-line no-console
                console.log(response.data);
                /*ctx.store.commit('setSnackBar', {
                    snackBar: true,
                    snackMsg: response.data.msg
                })*/
            }
        } else {
            // other, deal with yourself
            return response.data
        }
    }, (error) => {
        /*console.log(ctx.app.store.state.locale)
        ctx.store.commit('setSnackBar', {
            snackBar: true,
            snackMsg: ctx.app.i18n.t('requestError', ctx.app.store.state.locale)
        })*/
        return Promise.reject(error)
    })

    return customAxios
}
