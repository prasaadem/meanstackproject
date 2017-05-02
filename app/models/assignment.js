var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./user'); //Semester Model
var Course = require('./course'); //Semester Model
var Submission = require('./submission'); //Semester Model

var AssignmentSchema = new Schema({
    name: { type: String, required: true },
    startDate: { type: Date, default: Date.now },
    dueDate: { type: Date, default: Date.now },
    faculty: { type: Schema.Types.ObjectId, ref: 'User' },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    submissions: [{ type: Schema.Types.ObjectId, ref: 'Submission' }],
    path: { type: String, required: true },

    marks: { type: Number, default: 0 },
    evaluation: { type: String, default: 'In progress' },
    comments: { type: String, default: '' }
});

module.exports = mongoose.model('Assignment', AssignmentSchema);