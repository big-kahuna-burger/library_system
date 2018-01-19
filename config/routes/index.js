module.exports = function (app) {
  app.get('/', require('../../helpers/route_helpers'), (req, res) => {
    res.render('index')
  })
}
