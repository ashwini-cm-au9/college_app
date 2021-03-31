const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Subject = require('../models/subjectModel');


router.use(bodyParser.urlencoded({extended:true}))
router.use(bodyParser.json())

// get subject list
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