import AdminHeader from './AdminHeader';
import {Form,Container,Row,Col,Button} from 'react-bootstrap';
import {useState} from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';

const AddFaculty = () => {
    const [name,setname]=useState();
    const [dob,setdob]=useState();
    const [gender,setgender]=useState();
    const [doj,setdoj]=useState();
    const [branch,setbranch]=useState();
    const [regNo,setregNo]=useState();
    const [collegeCode,setcollegeCode]=useState();
    const[errormessage,seterrormessage]=useState();

   let history = useHistory();

    const submitHandler = async (event)=>{
        event.preventDefault();
        const facultydetails={
            name:name,
            dob:dob,
            gender:gender,
            doj:doj,
            branch:branch,
            regNo:regNo,
            collegeCode:collegeCode
        }
        // console.log(studentdetails)
        await axios.post('http://localhost:5000/admin/addfaculty',facultydetails,{
            headers:{
                'x-access-token':sessionStorage.getItem('admintoken')
            }
         })
        .then((res)=>{
            alert('New Faculty Added Succesfuly');
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
        <h1>Add Faculty</h1>
        <br/>
        <h2 style={{color:"red"}}>{errormessage}</h2>
        <Form onSubmit={submitHandler}>
            <Row>
                <Col>
                    <Form.Group>
                            <Form.Label>Faculty Name</Form.Label>
                            <Form.Control type="text" placeholder="Faculty Name" onChange={(e)=>setname(e.target.value)} />
                    </Form.Group> 
                    <Form.Group>
                            <Form.Label>Faculty DOB</Form.Label>
                            <Form.Control type="date" placeholder="Faculty DOB" onChange={(e)=>setdob(e.target.value)} />
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
                            <Form.Label>Date Of Join</Form.Label>
                            <Form.Control type="date" placeholder="Date of Join" onChange={(e)=>setdoj(e.target.value)} />
                    </Form.Group> 
                    <Form.Group>
                            <Form.Label>Select Branch:</Form.Label>
                                <select className="form-control" onChange={(e)=>setbranch(e.target.value)}>
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
export default AddFaculty;