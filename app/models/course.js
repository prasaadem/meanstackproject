var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var titlize = require('mongoose-title-case');
var Semester = require('./semester'); //Semester Model
var Assignment = require('./assignment'); //Semester Model
var User = require('./user'); //Semester Model

var CourseSchema = new Schema({
    name: { type: String, required: true, uppercase: true },
    title: { type: String, uppercase: false, required: true },
    semester: { type: Schema.Types.ObjectId, ref: 'Semester' },
    available: { type: Boolean, default: false },
    assignments: [{ type: Schema.Types.ObjectId, ref: 'Assignment' }],
    students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    faculty: { type: Schema.Types.ObjectId, ref: 'User' },
    grader: { type: Schema.Types.ObjectId, ref: 'User' },
    haveGrader: { type: Boolean, default: false }
});

CourseSchema.plugin(titlize, {
    paths: ['name']
});

CourseSchema.index({ title: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('Course', CourseSchema);