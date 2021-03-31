const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
var db = require('./db');
const cors = require('cors');
const fs = require('fs');
app.use(cors());

app.get('/',(req,res)=>{
    return res.send('health check ok')
})

const AdminController = require('./controllers/adminController');
app.use('/admin',AdminController);

const StudentController = require('./controllers/studentController');
app.use('/student',StudentController);

const facultyController = require('./controllers/facultyController');
app.use('/faculty',facultyController);

const subjectController = require('./controllers/subjectController');
app.use('/subject',subjectController);

app.use('/uploads',express.static(__dirname+'/uploads'));

app.listen(port,(err)=>{
    if(err) throw err;
    console.log(`Server is running at port:${port}`)
})
