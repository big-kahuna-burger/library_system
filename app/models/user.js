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

const User = module.exports = mongoose.model('User', UserSchema)

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

module.exports.getUserByUsername = function (username, cb) {
  const query = { username: username }
  User.findOne(query, cb)
}

module.exports.getUserById = function (id, cb) {
  User.findById(id, cb)
}

module.exports.comparePassword = function (candidatePassword, hash, cb) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err
    cb(null, isMatch)
  })
}
