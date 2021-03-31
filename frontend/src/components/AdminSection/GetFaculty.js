import AdminHeader from './AdminHeader';
import {Form,Container,Row,Col,Button,Table} from 'react-bootstrap';
import {useState} from 'react';
import axios from 'axios';

const GetStudent = () => {
    const [branch,setbranch]=useState();
    const [faculty,setfaculty]=useState();
    const [errormessage,seterrormessage]=useState();

    const submitValues=async()=>{
        const details={
            branch:branch,
        }
        await axios.post('http://localhost:5000/admin/facultylist',details,{
            headers:{
                'x-access-token':sessionStorage.getItem('admintoken')
            }
        })
        .then((res)=>{
            setfaculty(res.data)
        })
        .catch((err)=>{
            seterrormessage(err.response.data.message)
        })
    }

    
    // Delete Student
    const deleteFaculty = async(regNo)=>{
        if (window.confirm('Are you sure you want to Delete this Faculty')) {

            // axios delete should follow below order
            await axios.delete('http://localhost:5000/admin/deletefaculty',{
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

    const displayFaculty=(faculty)=>{
        if(faculty){
            return faculty.map((item)=>{
                return(
                    <tr>
                        <td>{item.name}</td>
                        <td>{item.dob}</td>
                        <td>{item.gender}</td>
                        <td>{item.doj}</td>
                        <td>{item.regNo}</td>
                        <td>
                            <Button onClick={()=>deleteFaculty(item.regNo)} variant="warning">Delete Faculty</Button>
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
                                <Form.Label>Select Branch:</Form.Label>
                                    <select className="form-control" id="branch" onChange={(e)=>setbranch(e.target.value)}>
                                        <option>---SELECT BRANCH---</option>
                                        <option value="CSE">CSE</option>
                                        <option value="MECH">MECH</option>
                                        <option value="CIVIL">CIVIL</option>
                                        <option value="EC">ECE</option>
                                    </select>
                        </Form.Group>
                        <Button onClick={submitValues}>Find Faculties</Button>
                    </Form>
                </Col>
                <Col sm={9}>
                    <h1>Faculty Display</h1>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th>Name</th>
                            <th>DOB</th>
                            <th>Gender</th>
                            <th>Joined Date</th>
                            <th>Reg No</th>
                            <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {displayFaculty(faculty)}
                        </tbody>
                    </Table>
                </Col>
            </Row>
       </Container>  
        </>
    )
}
export default GetStudent;