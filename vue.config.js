module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:7001',
                changeOrigin: true,
                // pathRewrite: {
                //     '^/api': '/api/v1'
                // }
            }
        }
    }
}