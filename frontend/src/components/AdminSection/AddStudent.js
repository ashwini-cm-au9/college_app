import AdminHeader from './AdminHeader';
import {Form,Container,Row,Col,Button} from 'react-bootstrap';
import {useState} from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';

const AddStudent = () => {
    const [name,setname]=useState();
    const [dob,setdob]=useState();
    const [admissionYear,setadmissionYear]=useState();
    const [branch,setbranch]=useState();
    const [regNo,setregNo]=useState();
    const [sem,setsem]=useState();
    const [gender,setgender]=useState();
    const [collegeCode,setcollegeCode]=useState();
    const[errormessage,seterrormessage]=useState();

   let history = useHistory();

    const submitHandler = async(event)=>{
        event.preventDefault();
        const studentdetails = {
            name:name,
            dob:dob,
            admissionYear:admissionYear,
            branch:branch,
            regNo:regNo,
            sem:sem,
            gender:gender,
            collegeCode:collegeCode
        }
        console.log(studentdetails)
        await axios.post('http://localhost:5000/admin/addstudent',studentdetails,{
            headers:{
                'x-access-token':sessionStorage.getItem('admintoken')
            }
         })
        .then((res)=>{
            alert('New Student Added Succesfuly');
            history.goBack()
        })
        .catch((err)=>{
            seterrormessage(err.response.data.message)
        })
    }

    return(
        <>
        <AdminHeader/>
        <Container>
        
        <h1>Add Student</h1>
        <br/>
        <h2 style={{color:"red"}}>{errormessage}</h2>
        <br/>
        <Form onSubmit={submitHandler}>
            <Row>
                <Col>
                    <Form.Group>
                            <Form.Label>Student Name</Form.Label>
                            <Form.Control type="text" placeholder="Student Name" onChange={(e)=>setname(e.target.value)} />
                    </Form.Group> 
                    <Form.Group>
                            <Form.Label>Student DOB</Form.Label>
                            <Form.Control type="date" placeholder="Student DOB" onChange={(e)=>setdob(e.target.value)} />
                    </Form.Group> 
                    <Form.Group>
                        <Form.Label>Admission Year</Form.Label>
                            <select className="form-control" onChange={(e)=>setadmissionYear(parseInt(e.target.value))} >
                                <option>----SELECT ADMISSION YEAR-----</option>
                                <option value="2021">2021</option>
                                <option value="2020">2020</option>
                                <option value="2019">2019</option>
                                <option value="2018">2018</option>
                            </select>
                    </Form.Group> 
                    <Form.Group>
                        <Form.Label>Select Branch:</Form.Label>
                            <select className="form-control" onChange={(e)=>setbranch(e.target.value)} >
                                <option>----SELECT BRANCH-----</option>
                                <option value="CSE">CSE</option>
                                <option value="MECH">MECH</option>
                                <option value="CIVIL">CIVIL</option>
                                <option value="EC">ECE</option>
                            </select>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label>Registration Number</Form.Label>
                        <Form.Control type="text" placeholder="Registration Number" onChange={(e)=>setregNo(e.target.value)} />
                    </Form.Group> 
                    <Form.Group>
                        <Form.Label>Select Semester:</Form.Label>
                            {/* by default values from option will be string, we use parseInt to convert to Integer */}
                            <select className="form-control" id="sem" onChange={(e)=>setsem(parseInt(e.target.value))}>
                                <option>----SELECT SEM-----</option>
                                <option value="1">1</option>
                                <option value="3">3</option>
                                <option value="5">5</option>
                                <option value="7">7</option>
                            </select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Select Gender:</Form.Label>
                            {/* by default values from option will be string, we use parseInt to convert to Integer */}
                            <select className="form-control" id="sem" onChange={(e)=>setgender(e.target.value)}>
                                <option>----SELECT GENDER-----</option>
                                <option value="M">M</option>
                                <option value="F">F</option>
                            </select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>College Code:</Form.Label>
                            {/* by default values from option will be string, we use parseInt to convert to Integer */}
                            <select className="form-control" id="sem" onChange={(e)=>setcollegeCode(e.target.value)}>
                                <option>----SELECT COLLEGE CODE-----</option>
                                <option value="ATT">ATT</option>
                            </select>
                    </Form.Group>
                    <Button type="submit">Add Student</Button>
                </Col>
            </Row>
        </Form>
        </Container>
        </>
    )
}
export default AddStudent;
