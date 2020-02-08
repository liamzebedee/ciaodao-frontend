const withLess = require('@zeit/next-less')
module.exports = withLess({
    cssModules: true,
    target: 'server',
    env: {
        API_URL: process.env.API_URL,
    },
})