var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var titlize = require('mongoose-title-case');

var Course = require('../models/course'); //Course Model

var SemesterSchema = new Schema({
    title: { type: String, required: true, uppercase: true, unique: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }]
});

SemesterSchema.plugin(titlize, {
    paths: ['title']
});

module.exports = mongoose.model('Semester', SemesterSchema);