var mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');

var facultySchema = mongoose.Schema({
    name:String,
    dob:String,
    gender:String,
    doj:String,
    branch:String,
    regNo:String,
    password:String,
    collegeCode:String,
    avatar:String
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

facultySchema.statics.uploadedAvatar = multer({storage:storage,fileFilter:fileFilter}).single('facultypic')
facultySchema.statics.avatarPath = AVATAR_PATH

mongoose.model('faculty',facultySchema);

module.exports = mongoose.model('faculty');