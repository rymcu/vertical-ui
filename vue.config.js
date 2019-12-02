module.exports = {
    devServer: {
        port: 8081,
        proxy: {
            '/api/': {
                target: 'http://localhost:8099/vertical/',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/api/v1'
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
