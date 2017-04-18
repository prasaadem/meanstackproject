var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('../models/user'); //User Model
    var Course = require('../models/course'); //Course Model
    var Assignment = require('../models/assignment'); //Course Model
    var Semester = require('../models/semester'); //Semester Model
    

var SubmissionSchema = new Schema({
    student:{type: Schema.Types.ObjectId, required:true, ref: 'User'},
    submissionDate: {type: Date, default: Date.now, required:true},
    version:{type:Number, required:true},
    path:{type:String}
});

module.exports = mongoose.model('Submission',SubmissionSchema);