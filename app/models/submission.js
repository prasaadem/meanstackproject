var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Course = require('./course'); //Semester Model
var Assignment = require('./assignment'); //Semester Model
var User = require('./user'); //Semester Model



var SubmissionSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User' },
    assignment: { type: Schema.Types.ObjectId, ref: 'Assignment' },
    dueDate: { type: Date, default: Date.now, required: true },
    submissionDate: { type: Date, default: Date.now, required: true },
    version: { type: Number, required: true },
    path: { type: String, required: true },
    status: { type: String, required: true },
    fileName: { type: String, required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    size: { type: String, required: true },
    statusString: { type: String, required: true, default: "Most Recent" },
    graded: { type: Boolean, default: false },
    marksSecured: { type: Number },
    comments: { type: String }
});

module.exports = mongoose.model('Submission', SubmissionSchema);