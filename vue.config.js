module.exports = {
    /*chainWebpack: (config)=>{
        /!* 添加分析工具*!/
        if (process.env.NODE_ENV === 'production') {
            if ( process.env.npm_config_report ) {
                config.plugin('webpack-bundle-analyzer')
                    .use( require( 'webpack-bundle-analyzer' ).BundleAnalyzerPlugin)
                    .end();
                config.plugins.delete( 'prefetch' )
            }
        }
    },*/
    devServer: {
        port: 8082,
        proxy: {
            '/api/': {
                target: 'http://localhost:8099/vertical/',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/api/v1'
                }
            },
            '/ws/': {
                target: 'http://localhost:8099/vertical/',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/ws': '/ws'
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
