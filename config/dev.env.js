'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://192.168.3.239:9000"'
  BASE_API: '"http://localhost:9000"'
  // BASE_API: '"http://47.100.161.163/clbfs"'

  // BASE_API: '"http://111.229.238.12/clbfs"'
})
