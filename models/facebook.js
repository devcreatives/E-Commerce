const mongoose = require('mongoose');//Using Module mongoose for Database
const Schema = mongoose.Schema;//schema will map to mongoose collection and define the shape of documents within that collection
const bcrypt = require('bcrypt-nodejs');//Using Module bcrypt-nodejs for encrypt the password

//create the new schema of userModel for user
const userModel = new Schema({
  userId: String,
  role: String
})

//before saving the userModel in schema encrypt user password 
userModel.pre('save', function (next) {
  const user = this;//invoke userModel in const user  

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) return next(err)
      user.password = hash;//store hash in user password
      next();//invoke next function
    })
  })
})

//compare password
userModel.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
  //Return either True or False
}

module.exports = mongoose.model('Facebook', userModel);//exporting the userModel as a key User
