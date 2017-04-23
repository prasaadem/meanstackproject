var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubmissionSchema = new Schema({
    student: { type: String, required: true },
    assignment: { type: String, required: true },
    dueDate: { type: Date, default: Date.now, required: true },
    submissionDate: { type: Date, default: Date.now, required: true },
    version: { type: Number, required: true },
    path: { type: String, required: true },
    status: { type: String, required: true },
    fileName: { type: String, required: true },
    course: { type: String, required: true },
    courseName: { type: String, required: true },
    semesterName: { type: String, required: true },
    size: { type: String, required: true }
});

module.exports = mongoose.model('Submission', SubmissionSchema);