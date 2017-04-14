var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var titlize = require('mongoose-title-case');

var CourseSchema = new Schema({
  name: {type: String, required:true, uppercase: true},
  title: {type: String, uppercase:false, required:true},
  semester: {type: Object, required:true}
});

CourseSchema.plugin(titlize, {
  paths: [ 'name']
});

module.exports = mongoose.model('Course',CourseSchema);