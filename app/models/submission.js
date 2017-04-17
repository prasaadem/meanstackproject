var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SubmissionSchema = new Schema({
    student:{type: String, required:true},
    submissionDate: {type: Date, default: Date.now, required:true},
    version:{type:Number, required:true},
    path:{type:String}
});

module.exports = mongoose.model('Submission',SubmissionSchema);