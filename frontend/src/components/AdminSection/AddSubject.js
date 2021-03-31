import AdminHeader from './AdminHeader';
import {Form,Container,Row,Col,Button} from 'react-bootstrap';
import {useState} from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';

const AddSubject = () => {
    const [branch,setbranch]=useState();
    const [sem,setsem]=useState();
    const [subName,setsubName]=useState();
    const [subCode,setsubCode]=useState();
    const [collegeCode,setcollegeCode]=useState();
    const[errormessage,seterrormessage]=useState();

   let history = useHistory();

    const submitHandler=async(event)=>{
        event.preventDefault();
        const subjectdetails={
            branch:branch,
            sem:sem,
            subName:subName,
            subCode:subCode,
            collegeCode:collegeCode
        }
        // console.log(studentdetails)
        await axios.post('http://localhost:5000/admin/addsubject',subjectdetails,{
            headers:{
                'x-access-token':sessionStorage.getItem('admintoken')
            }
         })
        .then((res)=>{
            alert('New Subject Added Succesfuly');
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
        <h1>Add Subject</h1>
        <br/>
        <h2 style={{color:"red"}}>{errormessage}</h2>
        <Form onSubmit={submitHandler}>
            <Row>
                <Col>
                   
                    <Form.Group>
                            <Form.Label>Select Branch:</Form.Label>
                                <select className="form-control" onChange={(e)=>setbranch(e.target.value)}>
                                    <option>----SELECT BRANCH-----</option>
                                    <option value="GEN">GEN</option>
                                    <option value="CSE">CSE</option>
                                    <option value="MECH">MECH</option>
                                    <option value="CIVIL">CIVIL</option>
                                    <option value="EC">ECE</option>
                                </select>
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
                            <Form.Label>Subject Name</Form.Label>
                            <Form.Control type="text" placeholder="Subject Name" onChange={(e)=>setsubName(e.target.value)} />
                    </Form.Group> 
                </Col>
                <Col>
                    <Form.Group>
                            <Form.Label>Subject Code</Form.Label>
                            <Form.Control type="text" placeholder="Subject Code" onChange={(e)=>setsubCode(e.target.value)} />
                    </Form.Group> 
                    
                    <Form.Group>
                        <Form.Label>College Code:</Form.Label>
                            {/* by default values from option will be string, we use parseInt to convert to Integer */}
                            <select className="form-control" id="sem" onChange={(e)=>setcollegeCode(e.target.value)}>
                                <option>----SELECT COLLEGE CODE-----</option>
                                <option value="ATT">ATT</option>
                            </select>
                    </Form.Group>
                    <Button type="submit">Add Subject</Button>
                </Col>
            </Row>
        </Form>
        </Container>
        </>
    )
}
export default AddSubject;