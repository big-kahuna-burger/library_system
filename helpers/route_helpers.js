module.exports = function (req, res, next) {
  console.log(req)

  if (req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('/users/login')
  }
}
