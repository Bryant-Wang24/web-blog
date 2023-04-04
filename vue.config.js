module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'https://120.79.23.205:9000',
                changeOrigin: true,
                // pathRewrite: {
                //     '^/api': '/api/v1'
                // }
            }
        }
    }
}