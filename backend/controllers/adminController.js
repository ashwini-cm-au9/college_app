const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('./config');
const Admin = require('../models/adminModel');
const Student = require('../models/studentModel');
const Faculty = require('../models/facultyModel');
const Subject = require('../models/subjectModel');
const path = require('path');
const fs = require('fs');

router.use(bodyParser.urlencoded({extended:true}))
router.use(bodyParser.json())

// status codes
// 401-unauthorized
// 404-Not Found
// 400-Bad Request
// 500-Internal Server Error

// -----------------------------------PRESENT LOGIN ADMIN SECTION-------------------------------------------------------
//Admin login
router.post('/adminlogin',(req,res)=>{
    Admin.findOne({regNo:req.body.regNo},(err,data)=>{
        if(err) return res.status(500).send({"message":"cannot login"});
        if(!data){
            return res.status(400).send({"message":'Invalid REGISTRATION NUMBER'});
        }else{
            var isValidPassword = bcrypt.compareSync(req.body.password,data.password)
            if(!isValidPassword) return res.status(400).send({"message":"Invalid Password"})
            // generating tokens using userid,secret,expiretime
            var token = jwt.sign({id:data._id},config.secret,{expiresIn:86400});
            return res.send({token:token,admindata:data})
        }
    })
})

//Admin update password
router.put('/adminupdatepassword',verifyToken,async(req,res)=>{
    try{
        let regNo=req.body.regNo;
        let oldpassword = req.body.oldpassword;
        let newpassword = bcrypt.hashSync(req.body.newpassword);
        let data = await Admin.findOne({regNo:regNo})
            if(!data) return res.status(401).send({'error':'Invalid registration number'})
            var isOldPasswordValid = bcrypt.compareSync(oldpassword,data.password)
            if(!isOldPasswordValid) return res.status(401).send({'error':'Invalid password,please enter correct password'})
            await Admin.updateOne(
                {'regNo':regNo},
                {
                    $set:{
                        password:newpassword
                    }
                }
            )
            return res.send({'update':"success",'message':'Password updated succesfully'})
        }catch(err){
            return res.status(500).send({'message':'cannot update password'})
        }
    })    


// Admin update profile
// important:dont use postman to update profile, it may make other fields null, if we dont pass values 
// from postman
router.put('/updateadmin',verifyToken,(req,res)=>{
    let regNo=req.body.regNo;
    Admin.updateMany(
        {regNo:regNo},
        {
            $set:{
                name:req.body.name,
                dob:req.body.dob,
                branch:req.body.branch,
                collegeCode:req.body.collegeCode,
            }
        },
        (err,data)=>{
            if(err) return res.status(500).send({'message':'cant update Admin'})
            return res.send({'message':'Admin profile updated'});
        })
})

// Update Admin profile picture
router.post('/updateadminpic',verifyToken,(req,res)=>{
    Admin.uploadedAvatar(req,res,function(err){
        if(err) throw err;
        let regNo = req.body.regNo;
        Admin.findOne({regNo:regNo},(err,data)=>{
            
            if(req.file){
                if(data.avatar){
                    // here checking if only image path exists then remove the image
                    fs.exists(path.join(__dirname,"..",data.avatar),(exists)=>{
                        if(exists){
                            fs.unlinkSync(path.join(__dirname,"..",data.avatar))
                        }
                    })
                }
                data.avatar=Admin.avatarPath +'/'+ req.file.filename;
                data.save()
                    .then(doc=>{
                        res.status(201).json({
                            message:'Profile image updated succesfully',
                            results:doc
                        });
                    })
                    .catch(err=>{
                        res.json(err)
                    })
                }
            })
        })
    })

// -----------------------------------STUDENT SECTION-------------------------------------------------------

// add students
router.post('/addstudent',verifyToken,async(req,res)=>{
    try{
        let Studentdata = await Student.findOne({regNo:req.body.regNo})
        if(Studentdata) return res.status(400).send({'message':'student with given ID is already present'})
        await Student.create({
            name:req.body.name,
            dob:req.body.dob,
            admissionYear:req.body.admissionYear,
            branch:req.body.branch,
            regNo:req.body.regNo,
            sem:req.body.sem,
            password:bcrypt.hashSync(req.body.dob),
            gender:req.body.gender,
            collegeCode:req.body.collegeCode
        })
        return res.send({'message':'New Student added'})
    }catch(err){
        return res.status(500).send({'message':'cannot add Student'})
    }
})

// get students
router.post('/studentslist',verifyToken,async(req,res)=>{
    try{
        let student={
            branch : req.body.branch,
            sem : req.body.sem
        }
        let data = await Student.find(student,{password:0})
        
        return res.send(data) 
    }catch(err){
        return res.status(500).send({'message':'cannot get Student list'})
    }
}) 

// delete Student
router.delete('/deletestudent',verifyToken,async(req,res)=>{
    await Student.deleteOne({regNo:req.body.regNo})
    return res.status(200).send({"message":"student deleted succesfully"})  
})

// -----------------------------------FACULTY SECTION-------------------------------------------------------

// add faculty
router.post('/addfaculty',verifyToken,async(req,res)=>{
    try{
        let facultdata=await Faculty.findOne({regNo:req.body.regNo})
    if(facultdata) return res.status(400).send({'message':'Faculty with given ID is already present'})
      await Faculty.create({
            name:req.body.name,
            dob:req.body.dob,
            gender:req.body.gender,
            doj:req.body.doj,
            branch:req.body.branch,
            regNo:req.body.regNo,
            password:bcrypt.hashSync(req.body.dob),
            collegeCode:req.body.collegeCode
        })
        return res.send({'message':'New Faculty added'})
    }catch(err){
        return res.status(500).send({'message':'cannot add faculty'})
    } 
})

// get faculty
router.post('/facultylist',verifyToken,async(req,res)=>{
    try{
        let branch=req.body.branch
        let data = await Faculty.find({branch},{password:0})
            return res.send(data)
    }catch(err){
        return res.status(500).send({'message':'cannot get faculty list'})
    }
})

// delete Faculty
router.delete('/deletefaculty',verifyToken,async(req,res)=>{
    try{
        await Faculty.deleteOne({regNo:req.body.regNo})
        return res.status(200).send({"message":"faculty deleted succesfully"})
    }catch(err){
        return res.status(500).send({'message':'cannot delete faculty'})
    } 
})
// -----------------------------------SUBJECT SECTION-------------------------------------------------------

// add Subject
router.post('/addsubject',verifyToken,async(req,res)=>{
    try{
        let subjectdata = await Subject.findOne({subCode:req.body.subCode})
        if(subjectdata) return res.status(400).send({'message':'Subject with given Code is already present'})
        await Subject.create({
            branch:req.body.branch,
            sem:req.body.sem,
            subName:req.body.subName,
            subCode:req.body.subCode,
            collegeCode:req.body.collegeCode
        })
        return res.send({'message':'New Subject added'})
    }catch(err){
        return res.status(500).send({'message':'cannot add Subject'})
    }
})
    

// get subject
router.post('/subjectlist',verifyToken,async(req,res)=>{
    try{
        let subject={
            branch:req.body.branch,
            sem:req.body.sem
        }
        let data = await Subject.find(subject)
        if(data.length==0){
            return res.status(401).send({'message':'No Subjects present'})
        }
        return res.send(data)
    }catch(err){
        return res.status(500).send({'message':'cannot get subject list'})
    }    
})

// delete Subject
router.delete('/deletesubject',verifyToken,async(req,res)=>{
    try{
        await Subject.deleteOne({subCode:req.body.subCode})
        return res.status(200).send({"message":"Subject deleted succesfully"})  
    }catch(err){
        return res.status(500).send({'message':'cannot delete'})
    }
})
// -----------------------------------ADMIN SECTION-------------------------------------------------------

// add admin
router.post('/addadmin',verifyToken,async(req,res)=>{
    try{
        let AdminData = await Admin.findOne({regNo:req.body.regNo})
        if(AdminData) return res.status(400).send({'message':'Admin with given Code is already present'})
         await Admin.create({
                name:req.body.name,
                regNo:req.body.regNo,
                dob:req.body.dob,
                password:bcrypt.hashSync(req.body.dob),
                branch:req.body.branch,
                collegeCode:req.body.collegeCode
            })
            return res.status(200).send({'register':'success','message':'Admin Register successfully'}); 
        }catch(err){
            return res.status(500).send({'message':'cannot Add Admin'})
        }
    })

// get Admins list
router.get('/adminslist',verifyToken,async(req,res)=>{
    try{
        let data = await Admin.find({},{password:0})
        return res.send(data)
    }catch(err){
        return res.status(500).send({'message':'cannot Get Admin List'})
    }
})

// get admin by his registration number
router.get('/adminbyid/:id',async(req,res)=>{
    try{
        let data = await Admin.findOne({regNo:req.params.id})
        return res.send(data)
    }catch(err){
        return res.status(500).send({'message':'cannot Get Admin'})
    }
})
// delete Admin
router.delete('/deleteadmin',verifyToken,async(req,res)=>{
    try{
        await Admin.deleteOne({regNo:req.body.regNo})
        return res.status(200).send({"message":"Admin deleted succesfully"})
    }catch(err){
        return res.status(500).send({'message':'cannot Delete Admin'})
    } 
})
// -----------------------------------MIDDLEWARE SECTION-------------------------------------------------------
// middleware for jwt authentication
function verifyToken(req,res,next){
    var token = req.headers['x-access-token'];
    if(typeof token!=='undefined'){
        // req.token = token;
        jwt.verify(token,config.secret,(err,data)=>{
            if(err) {
                return res.status(401).send({'message':'Invalid token,Please Login'})
            }else{
                next();
            }
        })
    }else{
        return res.status(401).send({'message':'No token Provided,Please Login'})
    }
}

// check if Image path exists
router.post('/checkpathexists',(req,res)=>{
    imagepath = path.join(__dirname,'..',req.body.imagepath)
    fs.exists(imagepath,(exists)=>{
        if(exists){
            return res.send({"pathfound":true,"path":imagepath})
        }else{
            return res.status(404).send({"pathfound":false,"path":imagepath})
        }
    })
})
module.exports = router;