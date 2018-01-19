const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  name: {
    type: String
  }
})

module.exports = mongoose.model('User', UserSchema)

module.exports.createUser = function (newUser, cb) {
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      console.log('Something went wrong.')
    } else {
      bcrypt.hash(newUser.password, salt, function (err, hash) {
        if (err) {
          console.log('Something went wrong')
        } else {
          newUser.password = hash
          newUser.save(cb)
        }
      })
    }
  })
}
