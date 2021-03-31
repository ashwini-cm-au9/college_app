import AdminHeader from './AdminHeader';
import {Form,Container,Row,Col,Button,Table} from 'react-bootstrap';
import {useState} from 'react';
import axios from 'axios';

const GetSubject = () => {
    const [sem,setsem]=useState();
    const [branch,setbranch]=useState();
    const [subjects,setsubjects]=useState();
    const [errormessage,seterrormessage]=useState();

    const submitValues=()=>{
        const details={
            branch:branch,
            sem:sem
        }
        axios.post('http://localhost:5000/admin/subjectlist', details,{
            headers:{
                'x-access-token':sessionStorage.getItem('admintoken')
            }
        })
        .then((res)=>{
            seterrormessage('');
            setsubjects(res.data)
        })
        .catch((err)=>{
            seterrormessage(err.response.data.message)
        })
    }

    // Delete Subject
    const deleteSubject = async(subCode)=>{
        if (window.confirm('Are you sure you want to Delete this Subject')) {

            // axios delete should follow below order
            await axios.delete('http://localhost:5000/admin/deletesubject',{
                headers:{
                    'x-access-token':sessionStorage.getItem('admintoken')
                },
                data:{
                    subCode
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


    const displaySubjects=(subjects)=>{
        if(subjects){
            return subjects.map((item)=>{
                return(
                    <tr>
                        <td>{item.subName}</td>
                        <td>{item.subCode}</td>
                        <td>
                            <Button onClick={()=>deleteSubject(item.subCode)} variant="warning">Delete Subject</Button>
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
                                        <option value="GEN">GEN</option>
                                        <option value="CSE">CSE</option>
                                        <option value="MECH">MECH</option>
                                        <option value="CIVIL">CIVIL</option>
                                        <option value="EC">ECE</option>
                                    </select>
                        </Form.Group>
                        <Button onClick={submitValues}>Find Subjects</Button>
                    </Form>
                </Col>
                <Col sm={8}>
                    <h1>Subject Display</h1>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th>Subject Name</th>
                            <th>Subject Code</th>
                            <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {displaySubjects(subjects)}
                        </tbody>
                    </Table>
                </Col>
            </Row>
       </Container>  
        </>
    )
}
export default GetSubject;