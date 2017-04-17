var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

var UserSchema = new Schema({
  username: {type: String, lowercase:true, required:true, unique: true},
  email: {type: String, lowercase:true, required:true, unique: true},
  uin: {type: String, required:false, unique: true},
  permission: {type: String, required:true, default: 'student'},
  accountExpires:{type:Date},
  name: {type: String, required:true},
  directoryName:{type: String, require:true},
  major:{type:String, require:true, default:'Computer Science'},
  classification:{type:String, require:true, default:'G7'},
  password: {type: String, required:true},
  courses: {type: Array}
});

UserSchema.plugin(titlize, {
  paths: [ 'name']
});

module.exports = mongoose.model('User',UserSchema);

// var nameValidator = [
//   validate({
//     validator: 'matches',
//     arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
//     message: 'Must be atlease 3 characters and max 30-A space between last and first name'
//   }),
//   validate({
//     validator: 'isLength',
//     arguments: [3, 20],
//     message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
//   })
// ];

// var usernameValidator = [
//   validate({
//     validator: 'isLength',
//     arguments: [3, 25],
//     message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
//   }),
//   validate({
//     validator: 'isAlphanumeric',
//     message: 'Name should contain alpha-numeric characters only'
//   })
// ];

// var passwordValidator = [
//   validate({
//     validator: 'matches',
//     arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}/,
//     message: 'Password Must be atlease 3 characters and max 30'
//   }),
//   validate({
//     validator: 'isLength',
//     arguments: [8, 35],
//     message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
//   })
// ];

// var emailValidator = [
//   validate({
//     validator: 'isEmail',
//     message: 'Is not a valid email'
//   }),
//   validate({
//     validator: 'isLength',
//     arguments: [3, 25],
//     message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
//   })
// ];

// UserSchema.pre('save',function(next){
//   var user = this;
//   bcrypt.hash(user.password,null,null,function(err,hash){
//     if (err) return next(err);
//     user.password = hash; 
//     next();
//   })
// });

// UserSchema.methods.comparePassword = function(password){
//     return bcrypt.compareSync(password,this.password);
// };