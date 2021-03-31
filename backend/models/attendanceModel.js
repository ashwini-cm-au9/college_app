var mongoose = require('mongoose');

var attendanceSchema = mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'student'
    },
    subject:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'subject'
    },
    totalClassesByFaculty:{
        type:Number,
        default:0
    },
    classesAttendedByStudent:{
        type:Number,
        default:0
    }
})

mongoose.model('attendance',attendanceSchema);
module.exports = mongoose.model('attendance');