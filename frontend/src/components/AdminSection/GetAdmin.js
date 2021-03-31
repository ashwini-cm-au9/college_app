import AdminHeader from './AdminHeader';
import {Container,Row,Col,Button,Table} from 'react-bootstrap';
import {useEffect,useState} from 'react';
import axios from 'axios';

const GetAdmin = () => {
    const [admins,setadmins]=useState();
    const[errormessage,seterrormessage]=useState();

     useEffect(()=>{
        axios.get('http://localhost:5000/admin/adminslist',{
            headers:{
                'x-access-token':sessionStorage.getItem('admintoken')
            }
        })
        .then((res)=>{
            setadmins(res.data)
        })
        .catch((err)=>{
            seterrormessage(err.response.data.message)
        })
    },[]);


    // Delete Admin
    const deleteAdmin = async(regNo)=>{
        if (window.confirm('Are you sure you want to Delete this Admin')) {

            // axios delete should follow below order
            await axios.delete('http://localhost:5000/admin/deleteadmin',{
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
                window.location.reload();
            })
            .catch((err)=>{
                seterrormessage(err.response.data.message)
            })
        }
    }

    const displayAdmins=(admins)=>{
        if(admins){
            return admins.map((item)=>{
                return(
                    <tr>
                        <td>{item.name}</td>
                        <td>{item.regNo}</td>
                        <td>{item.dob}</td>
                        <td>{item.branch}</td>
                        <td>{item.collegeCode}</td>
                        <td>
                            <Button onClick={()=>deleteAdmin(item.regNo)} variant="warning">Delete Admin</Button>
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
            <Row>
            <h3 style={{color:"red"}}>{errormessage}</h3>
                <Col sm={10}>
                    <h1>Admin Display</h1>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th>Name</th>
                            <th>Reg Number</th>
                            <th>DOB</th>
                            <th>Branch</th>
                            <th>College Code</th>
                            <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {displayAdmins(admins)}
                        </tbody>
                    </Table>
                </Col>
            </Row>
       </Container>  
        </>
    )
}
export default GetAdmin;