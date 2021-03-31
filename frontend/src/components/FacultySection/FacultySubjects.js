import FacultyHeader from './FacultyHeader';
import {Form,Container,Row,Col,Button,Table} from 'react-bootstrap';
import {useState,useEffect} from 'react';
import axios from 'axios';

const FacultySubjects = () => {
    const facultyregNo = JSON.parse(sessionStorage.getItem('facultyregNo'))
    
    const [regNo]=useState(facultyregNo);

    const [sem,setsem]=useState();

    const [branch,setbranch]=useState();

    const [subjects,setsubjects]=useState();

    const[errormessage,seterrormessage]=useState();

    useEffect(()=>{
        axios.get(`http://localhost:5000/faculty/facultybyid/${regNo}`)
        .then((res)=>{
            setbranch(res.data.branch)
        })
    },[]);

    // find subjects
    const findSubjects=()=>{
        const details={
            branch:branch,
            sem:sem
        }
        axios.post('http://localhost:5000/faculty/subjectlist', details)
        .then((res)=>{
            seterrormessage('');
            setsubjects(res.data)
        })
        .catch((err)=>{
            seterrormessage(err.response.data.message)
        })
    }

     // Display Subjects
     const displaySubjects=(subjects)=>{
        if(subjects){
            return subjects.map((item,idx)=>{
                return(
                    <tr>
                        <td>{idx}</td>
                        <td>{item.subName}</td>
                        <td>{item.subCode}</td>
                    </tr>
                )
            })
        }
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
                                        <select className="form-control" id="sem" onChange={(e)=>setsem(parseInt(e.target.value))}>
                                            <option>----SELECT SEM-----</option>
                                            <option value="3">3</option>
                                            <option value="5">5</option>
                                            <option value="7">7</option>
                                        </select>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Branch</Form.Label>
                                    <Form.Control type="text" value={branch} readOnly />
                                </Form.Group>
                                <Button onClick={findSubjects}>Find Subjects</Button>
                            </Form>
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                            <th>SL NO</th>
                                            <th>Subject Name</th>
                                            <th>Subject Code</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displaySubjects(subjects)}
                                        </tbody>
                                    </Table> 
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }
export default FacultySubjects;