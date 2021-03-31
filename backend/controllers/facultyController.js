const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('./config');
const Faculty = require('../models/facultyModel');
const Student = require('../models/studentModel');
const Attendance = require('../models/attendanceModel');
const Subject = require('../models/subjectModel');
const Marks = require('../models/marksModel');
const path = require('path');
const fs = require('fs');


router.use(bodyParser.urlencoded({extended:true}))
router.use(bodyParser.json())

// ------------------------------------------------FACULTY LOGIN SECTION----------------------------------
//faculty login
router.post('/facultylogin',(req,res)=>{
    Faculty.findOne({regNo:req.body.regNo},(err,data)=>{
        if(err) return res.status(500).send({"message":"cannot login"});
        if(!data){
            return res.status(400).send({"message":'Invalid REGISTRATION NUMBER'});
        }else{
            var isValidPassword = bcrypt.compareSync(req.body.password,data.password)
            if(!isValidPassword) return res.status(400).send({"message":"Invalid Password"})
            // generating tokens using userid,secret,expiretime
            var token = jwt.sign({id:data._id},config.secret,{expiresIn:86400});
            return res.send({token:token,facultydata:data})
        }
    })
})

//faculty update password
router.put('/facultyupdatepassword',verifyToken,async(req,res)=>{
    try{
        let regNo=req.body.regNo;
        let oldpassword = req.body.oldpassword;
        let newpassword=bcrypt.hashSync(req.body.newpassword);
        let data = Faculty.findOne({regNo:regNo})
            if(!data) return res.status(401).send({'error':'Invalid registration number'})
            var isOldPasswordValid = bcrypt.compareSync(oldpassword,data.password)
            if(!isOldPasswordValid) return res.status(401).send({'error':'Invalid password,please enter correct password'})
            await Faculty.updateOne(
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

// Faculty update profile
// important:dont use postman to update profile, it may make other fields null, if we dont pass values 
// from postman
router.put('/updatefaculty',verifyToken,(req,res)=>{
    let regNo=req.body.regNo;
    Faculty.updateMany(
        {regNo:regNo},
        {
            $set:{
                name:req.body.name,
                dob:req.body.dob,
                gender:req.body.gender,
                collegecode:req.body.collegeCode
            }
        },
        (err,data)=>{
            if(err) return res.status(500).send({'message':'cant update faculty'})
            return res.send({'message':'faculty profile updated'});
        })
    })

// Update Faculty profile picture
router.post('/updatefacultypic',verifyToken,(req,res)=>{
    Faculty.uploadedAvatar(req,res,function(err){
        if(err) throw err;
        let regNo = req.body.regNo;
        Faculty.findOne({regNo:regNo},(err,data)=>{
            
            if(req.file){
                if(data.avatar){
                    // here checking if only image path exists then remove the image
                    fs.exists(path.join(__dirname,"..",data.avatar),(exists)=>{
                        if(exists){
                            fs.unlinkSync(path.join(__dirname,"..",data.avatar))
                        }
                    })
                }
                data.avatar=Faculty.avatarPath +'/'+ req.file.filename;
                data.save()
                    .then(doc=>{
                        res.status(201).json({
                            message:'Profile image updated succesfully',
                            results:doc
                        });
                    })
                    .catch(err=>{
                        res.status(500).send({'message':'cant update profile pic'})
                    })
                }
            })
        })
    })

// get Faculty by his registration number
router.get('/facultybyid/:id',async(req,res)=>{
    try{
        let data = await Faculty.findOne({regNo:req.params.id})
        return res.send(data)
    }catch(err){
        return res.status(500).send({'message':'cannot Get Faculty'})
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

// get students list 
router.post('/facultystudentslist',async(req,res)=>{
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

// mark attendance
router.post('/markattendance',async(req,res)=>{
    try{
        // students present in the class
        let studentsAttended = req.body.studentsAttended;
        // console.log('students atternded>>>>',studentsAttended);
        let subjectCode = req.body.subjectCode;
        // just for a moment I am commenting above line 
        // find the subject
        
        const sub = await Subject.find({subCode:subjectCode});
        // just for a moment I am commenting above line 
        
        // find all students in given sem,branch
        let student={
            branch : req.body.branch,
            sem : req.body.sem
        }
        
        // all students present in the given sem
        let allStudents = await Student.find(student,{password:0})
        // console.log("all Students>>>>>>",allStudents);

        // all Students - present students will give absent students
        var filteredArr = allStudents.filter(function (item) {
            return studentsAttended.indexOf(item._id) === -1
        });

        // console.log("filtered students >>>>",filteredArr)

        //Students who didnt attended
         for (let i = 0; i < filteredArr.length; i++) {
             // to find students in attendance we are using ids of studentsAttended and subject
            const pre = await Attendance.findOne({ student: filteredArr[i]._id, subject: sub[0]._id })
            if (!pre) {
                const attendance = new Attendance({
                    student: filteredArr[i]._id,
                    subject: sub[0]._id
                })
                attendance.totalClassesByFaculty += 1
                await attendance.save()
            }
            else{
                pre.totalClassesByFaculty += 1
                await pre.save()
            }
        }
        for (var a = 0; a < studentsAttended.length; a++) {
            // to find students in attendance we are using ids of studentsAttended and subject
            const pre = await Attendance.findOne({ student: studentsAttended[a]._id, subject: sub[0]._id })
            if (!pre) {
                const attendance = new Attendance({
                    student: studentsAttended[a]._id,
                    subject: sub[0]._id
                })
                attendance.totalClassesByFaculty += 1
                attendance.classesAttendedByStudent += 1
                await attendance.save()
            }
            else {
                pre.totalClassesByFaculty += 1
                pre.classesAttendedByStudent += 1
                await pre.save()
            }
        }
        res.status(200).json({ message: "done" })
    }catch(err){
        return res.status(500).send({'message':'Error in marking attendance'})
    }
}) 

// upload marks
router.post('/uploadmarks',async(req,res)=>{
    try{
        // all the students in the given sem
        let totalStudents = req.body.totalStudents;
        let subjectCode = req.body.subjectCode;
        let testid = req.body.testid;
        let totalmarks = req.body.totalmarks;
        let obtainedmarks = req.body.obtainedmarks;
        
        const sub = await Subject.find({subCode:subjectCode});
        // const sub = req.body.subject;

        // check if marks is already given by faculty
        for(i=0;i<totalStudents.length;i++){
            const ismarksadded = await Marks.findOne({testid,student:totalStudents[i]._id,subject:sub[0]._id})
            if(ismarksadded){
                return res.status(400).send({message:"Marks is already given for this test"})
            }
            const marks = new Marks({
                student:totalStudents[i]._id,
                subject:sub[0]._id,
                testid:testid,
                totalmarks:totalmarks,
                obtainedmarks:obtainedmarks[i]
            })
            await marks.save();
        }
        res.status(200).json({ message: "done" })
    }catch(err){
        return res.status(500).send({'message':'Error in uploading marks'})
    }
})

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

// get subject
router.post('/subjectlist',async(req,res)=>{
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
module.exports = router;