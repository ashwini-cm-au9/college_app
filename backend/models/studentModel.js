var mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');
//what kind of fields will be there in collections

var studentSchema = mongoose.Schema({
    name:String,
    dob:String,
    admissionYear:Number,
    branch:String,
    regNo:{
        type:String,
        unique:true
    },
    sem:Number,
    password:String,
    gender:String,
    collegeCode:String,
    avatar:String,
})

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.join(__dirname,'..',AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })

const fileFilter = (req,file,cb)=>{
    if(file.mimetype ==='image/jpeg' || file.mimetype ==='image/jpg'|| file.mimetype ==='image/png'){
        cb(null,true)
    }else{
        cb(null,false)
    }
}

studentSchema.statics.uploadedAvatar = multer({storage:storage,fileFilter:fileFilter}).single('studentpic')
studentSchema.statics.avatarPath = AVATAR_PATH

mongoose.model('student',studentSchema);
module.exports = mongoose.model('student');