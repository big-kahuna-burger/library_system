module.exports = function (app) {
  app.get('/users/register', (req, res) => {
    res.render('register')
  })

  app.get('/users/login', (req, res) => {
    res.render('login')
  })
}
