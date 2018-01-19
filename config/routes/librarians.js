const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const Librarian = require('../../app/models/librarian')

module.exports = function (app) {
  app.get('/librarians/register', (req, res) => {
    res.render('librarian_register')
  })

  app.get('/librarians/login', (req, res) => {
    res.render('librarian_login')
  })

  app.post('/librarians/register', (req, res) => {
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
      const newLibrarian = new Librarian({
        name: name,
        email: email,
        username: username,
        password: password
      })

      Librarian.createLibrarian(newLibrarian, (err, libr) => {
        if (err) {
          throw err
        }
      })

      req.flash('success_msg', 'A new Librarian is now registered. Please login.')
      res.redirect('/librarians/login')
    }
  })

  passport.serializeUser(function (libr, done) {
    done(null, libr.id)
  })

  passport.deserializeUser(function (id, done) {
    Librarian.getLibrarianById(id, function (err, libr) {
      done(err, libr)
    })
  })

  // use passport for login
  passport.use('librarian', new LocalStrategy(function (username, password, done) {
    Librarian.getLibrarianByUsername(username, (err, libr) => {
      if (err) throw err
      if (!libr) {
        return done(null, false, { message: 'Unknown Librarian' })
      }

      Librarian.comparePassword(password, libr.password, (err, isMatch) => {
        if (err) throw err
        if (isMatch) {
          return done(null, libr)
        } else {
          return done(null, false, { message: 'Invalid password' })
        }
      })
    })
  }))

  app.post('/librarians/login',
    passport.authenticate('librarian', { successRedirect: '/users', failureRedirect: '/librarians/login', failureFlash: true }),
    (req, res) => {
      req.flash('success_msg', 'You are logged in.')
      res.redirect('/users')
    })

  app.get('/librarians/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'You are logged out.')
    res.redirect('/librarians/login')
  })
}
