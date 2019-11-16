module.exports = {
    devServer: {
        proxy: {
            '/api/': {
                target: 'http://192.168.1.4:8087/vertical/',
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
