var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var titlize = require('mongoose-title-case');

var CourseSchema = new Schema({
    name: { type: String, required: true, uppercase: true },
    title: { type: String, uppercase: false, required: true },
    semester: { type: String, required: true },
    available: { type: Boolean, default: false },
    assignments: { type: Array },
    students: { type: Array },
    semesterName: { type: String, required: true },
    faculty: { type: String }
});

CourseSchema.plugin(titlize, {
    paths: ['name']
});

CourseSchema.index({ title: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('Course', CourseSchema);