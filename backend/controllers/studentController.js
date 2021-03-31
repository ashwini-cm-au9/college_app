const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('./config');
const Subject = require('../models/subjectModel');
const Student = require('../models/studentModel');
const Atttendance = require('../models/attendanceModel');
const Marks = require('../models/marksModel');
const path = require('path');
const fs = require('fs');


router.use(bodyParser.urlencoded({extended:true}))
router.use(bodyParser.json())

// ---------------------------------STUDENT LOGIN SECTION------------------------------------
//student login
router.post('/studentlogin',(req,res)=>{
    Student.findOne({regNo:req.body.regNo},(err,data)=>{
        if(err) return res.status(500).send({"message":"cannot login"});
        if(!data){
            return res.status(400).send({"message":'Invalid REGISTRATION NUMBER'});
        }else{
            var isValidPassword = bcrypt.compareSync(req.body.password,data.password)
            if(!isValidPassword) return res.status(400).send({"message":"Invalid Password"})
            // generating tokens using userid,secret,expiretime
            var token = jwt.sign({id:data._id},config.secret,{expiresIn:86400});
            return res.send({token:token,studentdata:data})
        }
    })
})

//student update password
router.put('/studentupdatepassword',verifyToken,async(req,res)=>{

    try{
        let regNo=req.body.regNo;
        let oldpassword = req.body.oldpassword;
        let newpassword=bcrypt.hashSync(req.body.newpassword);
        let data = await Student.findOne({regNo:regNo})
            if(!data) return res.status(401).send({'error':'Invalid registration number'})
            var isOldPasswordValid = bcrypt.compareSync(oldpassword,data.password)
            if(!isOldPasswordValid) return res.status(401).send({'error':'Invalid password,please enter correct password'})
            await Student.updateOne(
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

// student update profile
// important:dont use postman to update profile, it may make other fields null, if we dont pass values 
// from postman
router.put('/updatestudent',verifyToken,(req,res)=>{
    let regNo=req.body.regNo;
    Student.updateMany(
        {regNo:regNo},
        {
            $set:{
                name:req.body.name,
                dob:req.body.dob,
                gender:req.body.gender
            }
        },
        (err,data)=>{
            if(err) return res.status(500).send({'message':'cant update student'})
            return res.send({'message':'Student profile updated'});
        })
    })

// Update Student profile picture
router.post('/updatestudentpic',verifyToken,(req,res)=>{
    Student.uploadedAvatar(req,res,function(err){
        if(err) throw err;
        let regNo = req.body.regNo;
        Student.findOne({regNo:regNo},(err,data)=>{
            
            if(req.file){
                if(data.avatar){
                    // here checking if only image path exists then remove the image
                    fs.exists(path.join(__dirname,"..",data.avatar),(exists)=>{
                        if(exists){
                            fs.unlinkSync(path.join(__dirname,"..",data.avatar))
                        }
                    })
                }
                data.avatar=Student.avatarPath +'/'+ req.file.filename;
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

// get Student by his registration number
router.get('/studentbyid/:id',async(req,res)=>{
    try{
        let data = await Student.findOne({regNo:req.params.id})
        return res.send(data)
    }catch(err){
        return res.status(500).send({'message':'cannot Get Student'})
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

// get the attendance perentage
router.post('/getattendance',async(req,res)=>{
    try{
        let studentid = req.body.studentid;
        // along with attendance we are populating subject details here
        let Attendancedata = await Atttendance.find({student:studentid}).populate('subject')
        if(Attendancedata.length==0){
            return res.status(400).send({ "message": "Attendence not found" })
        }
        return res.status(200).send({"attendanceData":Attendancedata})
    }catch(err){
        return res.status(500).send({"message":"Cannot get Attendance Data Now"})
    }
})

// get test results
router.post('/gettestresults',async(req,res)=>{
    try{
        let studentid = req.body.studentid;
        let testid = req.body.testid;
        // along with marks we are populating subject details here
        let Marksdata = await Marks.find({student:studentid,testid:testid}).populate('subject');
        // if Marksdata array is null, send response that marks is not uploaded for this test
        if(Marksdata.length==0){
            return res.status(400).send({"message":"Results not uploaded for this test or exam"})
        }
        return res.status(200).send({"marksData":Marksdata});
    }catch(err){
        return res.status(500).json({error:"cannot fetch marks now"})
    }
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
module.exports = router;