var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('../models/user'); //User Model
    var Course = require('../models/course'); //Course Model
    var Semester = require('../models/semester'); //Semester Model
    var Submission = require('../models/submission');


var AssignmentSchema = new Schema({
  name: {type: String, required:true},
  startDate: {type: Date, default: Date.now},
  dueDate: {type: Date, default: Date.now},
  faculty:{type: Schema.Types.ObjectId, required:true, ref: 'User'},
  course:{type: Schema.Types.ObjectId, required:true, ref: 'Course'},
  submissions:[{type: Schema.Types.ObjectId, required:true, ref: 'Submission'}]
});

module.exports = mongoose.model('Assignment',AssignmentSchema);