const express = require('express')
const app = express()
const port = 3000
const helpers = require('../helpers/server_helpers')
const path = require('path')
const exphbs = require('express-handlebars')
const session = require('express-session')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const passport = require('passport')

// Set up handlebars
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, '../app/views/layouts')
}))

app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, '../app/views'))

// If request is bad, return bad request
app.use((err, request, response, next) => {
  console.log(err)
  response.status(500).send('Something broke!')
})

// stylesheets, images
app.use('*/css', express.static('public/css'))
app.use('*/js', express.static('public/js'))
app.use('*/images', express.static('public/img'))

// session for users
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}))

// passport for auth
app.use(passport.initialize())
app.use(passport.session())

// Validate Forms
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    const namespace = param.split('.')
    const root = namespace.shift()
    var formParam = root

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']'
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    }
  }
}))

// Connect Flash middleware
app.use(flash())

// Global Flash Messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

// log when server starts
app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
})

// use routes
require('./routes/index')(app)
require('./routes/users')(app)

// export the app
module.exports = app
