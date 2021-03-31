var mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');
//what kind of fields will be there in collections
var adminSchema  = new mongoose.Schema({
    regNo:String,
    dob:String,
    name:String,
    branch:String,
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

adminSchema.statics.uploadedAvatar = multer({storage:storage,fileFilter:fileFilter}).single('adminpic')
adminSchema.statics.avatarPath = AVATAR_PATH

//mongoose.model('collection','schema)
mongoose.model('admin',adminSchema);
module.exports = mongoose.model('admin');