import FacultyHeader from './FacultyHeader';
import {Form,Container,Row,Col,Button,Table} from 'react-bootstrap';
import {useState,useEffect} from 'react';
import axios from 'axios';

const UpdateMarks = () => {
    const facultyregNo = JSON.parse(sessionStorage.getItem('facultyregNo'))
    
    const [regNo]=useState(facultyregNo);

    const [sem,setsem]=useState();
    // faculty branch
    const [branch,setbranch]=useState();
    // all the subjects present in selected sem and branch
    const[subjects,setsubjects]=useState();
    // all students in the given sem and branch
    const [students,setstudents]=useState();
    
    const[errormessage,seterrormessage]=useState();
    
    // subject 
    const [selectedsubjectcode,setselectedsubjectcode]=useState();

    // selected test
    const [selectedtest,setselectedtest]=useState();

    // total Marks of the test as given by faculty
    const [totaltestscore,settotaltestscore]=useState(0);

    // individual marks obtained by student
    const [individualmarks,setindividualmarks]=useState();

    // marks obtained by student
    const[marksobtained,setmarksobtained]=useState([]);
    
    useEffect(()=>{
        axios.get(`http://localhost:5000/faculty/facultybyid/${regNo}`)
        .then((res)=>{
            setbranch(res.data.branch)
        })
    },[]);
    
    // Display Subjects
    const displaySubjects=(subjects)=>{
        if(subjects){
            return subjects.map((item)=>{
                return(
                    <option value={item.subCode}>
                        {item.subCode} || {item.subName}
                    </option>
                )
            })
        }
    }

    // Find Subjects
    const findSubjects = (value)=>{
        if(value==1 && branch!="GEN"){
            setsubjects(null)
        }
        if(value!==1 && branch!="GEN"){
            seterrormessage(null)
        }
        const details={
            branch:branch,
            sem:value
        }
        // set the value of sem here
        setsem(value)

         axios.post('http://localhost:5000/subject/subjectlist',details)
        .then((res)=>{
            setsubjects(res.data)
        })
        .catch((err)=>{
            seterrormessage(err.response.data.message)
        })
    }

    // Find Students
    const findStudents=async()=>{
        if(typeof(sem)=='undefined' || typeof(selectedsubjectcode)=='undefined' || typeof(selectedtest)=='undefined' || typeof(totaltestscore)==0){
            seterrormessage("Please fill all fields");
            return;
        }
        seterrormessage(null)
        const details={
            branch:branch,
            sem:sem
        }
        await axios.post('http://localhost:5000/faculty/facultystudentslist',details)
        .then((res)=>{
            setstudents(res.data)
        })
        .catch((err)=>{
            seterrormessage(err.response.data.message)
        })
    }

    // store individual marks into 'individual marks' state

    const storeIndividualMarks=(e)=>{
        setindividualmarks(parseInt(e.target.value))
    }

    // save individual marks of student into marks array present in states
    const saveIndividualMarks=(e,studentname)=>{
        e.preventDefault();
        if(individualmarks>totaltestscore){
            seterrormessage("Please add marks less than total Score")
            return;
        }else{
            seterrormessage('')
        }
        
        alert(`${studentname}s marks added`)
        setmarksobtained((marksobtained => [...marksobtained,individualmarks]))
    }

    // find present students
    // const updateStudentMarks = (e,item)=>{
        // if(e.target.checked){
        //     setpresentstudents(presentStudents => [...presentStudents,item])
        // }else{
        //     setpresentstudents(presentstudents.filter(student => student !== item));
        // }

        // console.log(e.target.value)
    // }

    // Display Students
    const displayStudents=(students)=>{
        if(students){
            return students.map((item)=>{
                return(
                    <tr value={item._id}>
                        <td>{item.regNo}</td>
                        <td>{item.name}</td>
                        <td>
                            <Form onSubmit={(e)=>saveIndividualMarks(e,item.name)}>
                                <Form.Group>
                                    <Form.Control type="number" onChange={storeIndividualMarks} />
                                </Form.Group> 
                                {/* we cant create form for all the students at once,since we arae using form for only this cell in table, so we create submit button for individual students  */}
                                <Button type="submit">Add</Button>
                            </Form>
                        </td>
                    </tr>
                )
            })
        }
    }

    // save All Students Marks
    const saveStudentsMarks=()=>{
        if(marksobtained.length==0){
            seterrormessage("Please add Marks First")
            return;
        }
        if(marksobtained.length < students.length){
            seterrormessage("add marks of all students, mark 0 if student was absent")
            return;
        }
        seterrormessage(null)
        let studentDetails={
            "totalStudents":students,
            "subjectCode":selectedsubjectcode,
            "testid":selectedtest,
            "totalmarks":totaltestscore,
            "obtainedmarks":marksobtained
        }
        console.log(studentDetails)
        axios.post('http://localhost:5000/faculty/uploadmarks',studentDetails)
        .then((res)=>{
            alert('Marks Uploaded Succesfully')
        })
        .catch((err)=>{
            seterrormessage(err.response.data.message)
        })
    }

    return(
        <>
       <FacultyHeader/>
       <br/>
       <Container>
            <h3 style={{color:"red"}}>{errormessage}</h3>
                    <Row>
                        <Col sm={5}>
                            <Form>
                                <Form.Group>
                                    <Form.Label>Select Semester:</Form.Label>
                                        {/* by default values from option will be string, we use parseInt to convert to Integer */}
                                        <select className="form-control" id="sem" onChange={(e)=>findSubjects(parseInt(e.target.value))}>
                                            <option>----SELECT SEM-----</option>
                                            <option value="1">1</option>
                                            <option value="3">3</option>
                                            <option value="5">5</option>
                                            <option value="7">7</option>
                                        </select>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Branch</Form.Label>
                                    <Form.Control type="text" value={branch} readOnly />
                                </Form.Group> 
                                <Form.Group>
                                        <Form.Label>Select Subject:</Form.Label>
                                            <select className="form-control" id="subject" onChange={(e)=>setselectedsubjectcode(e.target.value)}>
                                                <option>----SELECT SUBJECTS-----</option>
                                                {displaySubjects(subjects)}
                                            </select>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Select Test:</Form.Label>
                                        <select className="form-control" id="test" onChange={(e)=>setselectedtest(e.target.value)}>
                                            <option>----SELECT TEST-----</option>
                                            <option value="INT1">INTERNAL-1</option>
                                            <option value="INT2">INTERNAL-2</option>
                                            <option value="INT3">INTERNAL-3</option>
                                            <option value="LAB">LAB INTERNAL</option>
                                            <option value="MAINS">MAINS</option>
                                        </select>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Total Marks</Form.Label>
                                    <Form.Control type="number" onChange={(e)=>settotaltestscore(parseInt(e.target.value))} />
                                </Form.Group>
                                
                                <Button onClick={findStudents}>Find Students</Button>
                            </Form>
                        </Col>
                        <Col>
                        <Row>
                            <Col>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                    <th>Registration Number</th>
                                    <th>Student Name</th>
                                    <th>Marks Obtained</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayStudents(students)}
                                </tbody>
                            </Table> 
                            <Button onClick={saveStudentsMarks}>Update Marks</Button> 
                            </Col>
                        </Row>
                        </Col>
                    </Row>
            </Container>  
        </>
    )
}
export default UpdateMarks;