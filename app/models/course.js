var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var titlize = require('mongoose-title-case');

var User = require('../models/user'); //User Model
var Assignment = require('../models/assignment'); //Course Model
var Semester = require('../models/semester'); //Semester Model
var Submission = require('../models/submission');


var CourseSchema = new Schema({
  name: {type: String, required:true, uppercase: true},
  title: {type: String, uppercase:false, required:true},
  semester: {type: Schema.Types.ObjectId, required:true, ref: 'Semester'},
  available:{type:Boolean, default:false},
  assignments:[{type: Schema.Types.ObjectId, ref: 'Assignment'}],
  students:[{type: Schema.Types.ObjectId, ref: 'User'}],
  faculty:{type: Schema.Types.ObjectId, ref: 'User'}
});

CourseSchema.plugin(titlize, {
  paths: [ 'name']
});

CourseSchema.index({ title: 1, semester: 1}, { unique: true });

module.exports = mongoose.model('Course',CourseSchema);