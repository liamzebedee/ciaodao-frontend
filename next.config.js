const withLess = require('@zeit/next-less')

const withCSS = require('@zeit/next-css')

const { compose } = require('redux')
// import { compose } from 'redux'
module.exports = withCSS({
    ...withLess({
        cssModules: true,
        target: 'server',
        env: {
            API_URL: process.env.API_URL,
        },
    }),
    cssModules: false,
})