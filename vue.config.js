module.exports = {
    devServer: {
        proxy: {
            '/api/': {
                target: 'https://hacpai.com',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/api/v2'
                }
            }
        },
        https: false
    },
    publicPath: process.env.NODE_ENV === 'production'
        ? '/vertical/'
        : '/',
    // 输出文件目录
    outputDir: 'vertical'
}
