const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const exphbs = require('express-handlebars')

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, '../app/views/layouts')
}))

app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, '../app/views'))

app.use((err, request, response, next) => {
  console.log(err)
  response.status(500).send('Something broke!')
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
})

// Use routes from router.js
require('./router')(app)

module.exports = app
