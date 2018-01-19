const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const LibrarianSchema = mongoose.Schema({
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

const Librarian = module.exports = mongoose.model('Librarian', LibrarianSchema)

module.exports.createLibrarian = function (newLibrarian, cb) {
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      console.log('Something went wrong.')
    } else {
      bcrypt.hash(newLibrarian.password, salt, function (err, hash) {
        if (err) {
          console.log('Something went wrong')
        } else {
          newLibrarian.password = hash
          newLibrarian.save(cb)
        }
      })
    }
  })
}

module.exports.getLibrarianByUsername = function (username, cb) {
  const query = { username: username }
  Librarian.findOne(query, cb)
}

module.exports.getLibrarianById = function (id, cb) {
  Librarian.findById(id, cb)
}

module.exports.comparePassword = function (candidatePassword, hash, cb) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err
    cb(null, isMatch)
  })
}
