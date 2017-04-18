var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var titlize = require('mongoose-title-case');

var User = require('../models/user'); //User Model
    var Course = require('../models/course'); //Course Model
    var Assignment = require('../models/assignment'); //Course Model
    var Submission = require('../models/submission');
    

var SemesterSchema = new Schema({
  title: {type: String, required:true, uppercase:true, unique: true},
  startDate: {type: Date, default: Date.now},
  endDate: {type: Date, default: Date.now}
});

SemesterSchema.plugin(titlize, {
  paths: [ 'title']
});

module.exports = mongoose.model('Semester',SemesterSchema);