module.exports = {
    publicPath: "./",
    chainWebpack: config => {
        const svgRule = config.module.rule('svg');
        // 清空默认svg规则
        svgRule.uses.clear();
        //针对svg文件添加svg-sprite-loader规则
        svgRule
            .test( /\.svg$/)
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            });
    },
    // devServer: {
    //     proxy: {
    //         '/api': {
    //             target: 'http://139.9.58.231:8085/',
    //             // target: 'http://localhost:8085/',
    //             // 允许跨域
    //             changeOrigin: true,
    //             ws: true,
    //             pathRewrite: {
    //                 '^/api': ''
    //             }
    //         }
    //     }
    // }
}
