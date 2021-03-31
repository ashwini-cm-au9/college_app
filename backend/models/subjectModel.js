var mongoose = require('mongoose');

var subjectSchema = mongoose.Schema({
    branch:String,
    sem:Number,
    subName:String,
    subCode:String,
    collegeCode:String,
})

mongoose.model('subject',subjectSchema)

module.exports = mongoose.model('subject');