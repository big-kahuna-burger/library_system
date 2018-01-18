const app = require('./config/server')
const bodyParser = require('body-parser')
const path = require('path')
const cookieParser = require('cookie-parser')
const exhbs = require('express-handlebars')
const LocalStrategy = require('passport-local').Strategy
const mongo = require('mongodb')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/library')
const db = mongoose.connections
