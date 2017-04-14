var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var titlize = require('mongoose-title-case');

var CourseSchema = new Schema({
  name: {type: String, required:true, uppercase: true},
  title: {type: String, uppercase:false, required:true},
  semester: {type: Object, required:true},
  assignments:{type: Array},
  students:{type: Array}
});

CourseSchema.plugin(titlize, {
  paths: [ 'name']
});

CourseSchema.index({ title: 1, semester: 1}, { unique: true });

module.exports = mongoose.model('Course',CourseSchema);