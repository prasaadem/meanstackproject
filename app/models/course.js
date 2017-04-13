var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var titlize = require('mongoose-title-case');

var CourseSchema = new Schema({
  name: {type: String, required:true, uppercase: true, unique:true},
  title: {type: String, uppercase:false, required:true,unique:true},
  semester: {type: String, required:true},
  startDate: {type: Date, default: Date.now},
  endDate: {type: Date, default: Date.now}
});

CourseSchema.plugin(titlize, {
  paths: [ 'name']
});

module.exports = mongoose.model('Course',CourseSchema);