const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const exphbs = require('express-handlebars')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const passport = require('passport')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')

// Set up handlebars
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, '../app/views/layouts')
}))

app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, '../app/views'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser())

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
  saveUninitialized: false,
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
app.use(require('../helpers/server_helpers'))

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
