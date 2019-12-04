'use strict'

var express = require('express'),
    expresshdb = require('express-handlebars'),
    favicon = require('serve-favicon'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    restFul = require('express-method-override')('_method'),
    routes = require('./routes/RAM-router'),
    faviconURL = `${__dirname}/public/img/RAM.ico`,
    publicDir = express.static(`${__dirname}/public`),
    viewDir = `${__dirname}/views`,
    port = (process.env.PORT || 2000),
    app = express()
require('./database')
app
    .set('views', viewDir)
    .set('view engine', 'jade')
    .set('port', port)

.use(favicon(faviconURL))
    .use(bodyParser.json())
    // parse application/x-www-form-urlencoded
    .use(bodyParser.urlencoded({ extended: false }))
    .use(restFul)
    .use(morgan('dev'))
    .use(publicDir)
    .use(routes)
module.exports = app