var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AssignmentSchema = new Schema({
  name: {type: String, required:true, uppercase: true},
  course: {type: Object, required:true},
  user: {type: Object, required:true},
  startDate: {type: Date, default: Date.now},
  endDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Assignment',AssignmentSchema);