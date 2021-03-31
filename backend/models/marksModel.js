var mongoose = require('mongoose');

var marksSchema = mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'student'
    },
    subject:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'subject'
    },
    testid:String,
    totalmarks:Number,
    obtainedmarks:Number
})
mongoose.model('marks',marksSchema);

module.exports = mongoose.model('marks');