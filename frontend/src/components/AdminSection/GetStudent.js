import AdminHeader from './AdminHeader';
import {Form,Container,Row,Col,Button,Table} from 'react-bootstrap';
import {useState} from 'react';
import axios from 'axios';

const GetStudent = () => {
    const [sem,setsem]=useState();
    const [branch,setbranch]=useState();
    const [students,setstudents]=useState();
    const[errormessage,seterrormessage]=useState();

    // Find Stundents
    const submitValues= async()=>{
        const details={
            branch:branch,
            sem:sem
        }
        await axios.post('http://localhost:5000/admin/studentslist',details,{
            headers:{
                'x-access-token':sessionStorage.getItem('admintoken')
            }
        })
        .then((res)=>{
            setstudents(res.data)
        })
        .catch((err)=>{
            seterrormessage(err.response.data.message)
        })
    }

    // Delete Student
    const deleteStudent = async(regNo)=>{
        if (window.confirm('Are you sure you want to Delete this Student')) {

            // axios delete should follow below order
            await axios.delete('http://localhost:5000/admin/deletestudent',{
                headers:{
                    'x-access-token':sessionStorage.getItem('admintoken')
                },
                data:{
                    regNo
                }
            })
            .then((res)=>{
            // when the delete is success, based on the values of branch, and sem which is already stored in useState()
            // we fetch students again using below function and setstudents here
                submitValues()
            })
            .catch((err)=>{
                seterrormessage(err.response.data.message)
            })
        }
    }

    // Display Students
    const displayStudents=(students)=>{
        if(students){
            return students.map((item)=>{
                return(
                    <tr>
                        <td>{item.name}</td>
                        <td>{item.dob}</td>
                        <td>{item.branch}</td>
                        <td>{item.gender}</td>
                        <td>{item.regNo}</td>
                        <td>{item.admissionYear}</td>
                        <td>{item.sem}</td>
                        <td>
                            <Button onClick={()=>deleteStudent(item.regNo)} variant="warning">Delete Student</Button>
                        </td>
                    </tr>
                )
            })
        }
    }
    return(
        <>
       <AdminHeader/>
       <br/>
       <Container>
            <h3 style={{color:"red"}}>{errormessage}</h3>
                    <Row>
                        <Col sm={3}>
                            <Form>
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
                                        <Form.Label>Select Branch:</Form.Label>
                                            <select className="form-control" id="branch" onChange={(e)=>setbranch(e.target.value)}>
                                                <option>----SELECT BRANCH-----</option>
                                                <option value="CSE">CSE</option>
                                                <option value="MECH">MECH</option>
                                                <option value="CIVIL">CIVIL</option>
                                                <option value="EC">ECE</option>
                                            </select>
                                </Form.Group>
                                <Button onClick={submitValues}>Find Students</Button>
                            </Form>
                        </Col>
                        <Col sm={8}>
                            <h1>Student Display</h1>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                    <th>Name</th>
                                    <th>DOB</th>
                                    <th>Branch</th>
                                    <th>Gender</th>
                                    <th>Reg Number</th>
                                    <th>Admission year</th>
                                    <th>Sem</th>
                                    <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {displayStudents(students)}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>  
            </>
        )
    }
export default GetStudent;