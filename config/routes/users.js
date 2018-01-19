const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('../../app/models/user')

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

    // Validate
    req.checkBody('name', 'Name is required').notEmpty()
    req.checkBody('email', 'Email is required').notEmpty()
    req.checkBody('email', 'Email is not valid').isEmail()
    req.checkBody('username', 'Username is required').notEmpty()
    req.checkBody('password', 'Password is required').notEmpty()
    req.checkBody('password_confirm', 'Passwords do not match').equals(req.body.password)

    const errors = req.validationErrors()
    if (errors) {
      res.render('register', {
        errors: errors
      })
    } else {
      const newUser = new User({
        name: name,
        email: email,
        username: username,
        password: password
      })

      User.createUser(newUser, (err, user) => {
        if (err) {
          throw err
        }
      })

      req.flash('success_msg', 'You are registered and can now login')
      res.redirect('/users/login')
    }
  })

    // use passport for login
  passport.use('user', new LocalStrategy(function (username, password, done) {
    User.getUserByUsername(username, (err, user) => {
      if (err) throw err
      if (!user) {
        return done(null, false, { message: 'Unknown User' })
      }

      User.comparePassword(password, user.password, (err, isMatch) => {
        if (err) throw err
        if (isMatch) {
          return done(null, user)
        } else {
          return done(null, false, { message: 'Invalid password' })
        }
      })
    })
  }))

  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
      done(err, user)
    })
  })

  app.post('/users/login',
    passport.authenticate('user', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
    (req, res) => {
      res.redirect('/')
    })

  app.get('/users/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'You are logged out.')
    res.redirect('/users/login')
  })
}
