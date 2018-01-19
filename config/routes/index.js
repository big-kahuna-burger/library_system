module.exports = function (app, passport) {
  app.get('/', require('../../helpers/route_helpers'), (req, res) => {
    console.log(req)
    res.render('index')
  })

  app.get('/users', (req, res) => {
    res.render('users')
  })
}
