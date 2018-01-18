module.exports = function (app) {
  app.get('/users/register', (req, res) => {
    res.render('register')
  })

  app.get('/users/login', (req, res) => {
    res.render('login')
  })

  app.post('/users/register', (req, res) => {
    // get request parameters
    const name = req.body.name
    const email = req.body.email
    const username = req.body.username
    const password = req.body.password
    const password_confirm = req.body.password_confirm

    // Validate
    req.checkBody('name', 'Name is required').notEmpty()
    req.checkBody('email', 'Email is required').notEmpty()
    req.checkBody('email', 'Email is not valid').isEmail()
    req.checkBody('username', 'Username is required').notEmpty()
    req.checkBody('password', 'Password is required').notEmpty()
    req.checkBody('password_confirm', 'Passwords do not match').equals(req.body.password)

    const errors = req.validationErrors()
    if (errors) {
      console.log('there are errors')
    } else {
      console.log('no errors')
    }

    res.send(email)
  })
}
