// configure the server
require('./config/server')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/library')
