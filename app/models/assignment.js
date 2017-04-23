var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AssignmentSchema = new Schema({
    name: { type: String, required: true },
    startDate: { type: Date, default: Date.now },
    dueDate: { type: Date, default: Date.now },
    faculty: { type: String, required: true },
    course: { type: String, required: true },
    submissions: { type: Array },
    courseName: { type: String, required: true },
    semesterName: { type: String, required: true },

    marks: { type: Number, default: 0 },
    evaluation: { type: String, default: 'In progress' },
    comments: { type: String, default: '' }
});

module.exports = mongoose.model('Assignment', AssignmentSchema);