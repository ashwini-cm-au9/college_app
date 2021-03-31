import FacultyHeader from './FacultyHeader';
import {Container,Row,Col,Card,Button,Table,Form,Modal} from 'react-bootstrap';
import {useState,useEffect} from 'react';
import axios from 'axios';
import DefaultUserPic from "../uploads/avatar.png";

const FacultyProfile = () => {

    const facultyregNo = JSON.parse(sessionStorage.getItem('facultyregNo'))
    
    const [regNo]=useState(facultyregNo);
    const [name,setname]=useState();
    const[dob,setdob]=useState();
    const[branch,setbranch]=useState();
    const[collegeCode,setcollegeCode]=useState();
    const[profilepic,setprofilepic]=useState();
    const[uploadedPic,setuploadedPic]=useState();
    const[errormessage,seterrormessage]=useState();

    const[oldpassword,setoldpassword]=useState();
    const[newpassword,setnewpassword]=useState();

    // checking  and updating path
    const[verifiedpath,setverifiedpath]=useState(DefaultUserPic);
    
    useEffect(()=>{
        axios.get(`http://localhost:5000/faculty/facultybyid/${regNo}`)
        .then((res)=>{
            setname(res.data.name)
            setdob(res.data.dob)
            setbranch(res.data.branch)
            setcollegeCode(res.data.collegeCode)
            setprofilepic(res.data.avatar)
        })
    },[]);

    // if profile pic is not there, it will get default profile pic
    // making api call to check if image path exists in backend
    if(profilepic){
        var FacultyProfilPic = "http://localhost:5000" + profilepic;

        const user={
            imagepath:profilepic
        }
        axios.post('http://localhost:5000/faculty/checkpathexists',user) 
            .then((res)=>{
                setverifiedpath(FacultyProfilPic)
            })
            .catch((err)=>{
                setverifiedpath(DefaultUserPic);
            })
    }

    // handle profile update Modal
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        window.location.reload();
    }
    const handleShow = () =>{
        setShow(true);
    }

    // handle Password Update Modal
    const [showpasswordModal, setshowpasswordModal] = useState(false);
    const handlePasswordClose = () => {
        setshowpasswordModal(false);
    }
    const handlePasswordShow = (regNo) =>{
        setshowpasswordModal(true);
    }

    // Submitting Profile Update details
    const handleSubmit=async(event)=>{
        event.preventDefault();
        const facultyUpdatedDetails={
            regNo:regNo,
            name:name,
            dob:dob,
            branch:branch,
            collegeCode:collegeCode,
        }
        await axios.put('http://localhost:5000/faculty/updatefaculty',facultyUpdatedDetails,{
            headers:{
                'x-access-token':sessionStorage.getItem('facultytoken')
            }
        })
        .then((res)=>{
            window.location.reload();
        })
        .catch((err)=>{
            seterrormessage(err.response.data.message)
        })
    }

    // Submitting Profile Picture Update details
    const submitProfilePic =async (event) => {
        event.preventDefault();
        // console.log(profilepic)
        const data = new FormData();
        data.append('facultypic',uploadedPic)
        data.append('regNo',regNo)
        // console.log(data)
        await axios.post('http://localhost:5000/faculty/updatefacultypic',data,{
            headers:{
                'x-access-token':sessionStorage.getItem('facultytoken')
            }
        })
        .then((res)=>{
            setprofilepic(res.data.results.avatar)
        })
        .catch((err)=>{
            console.log(err)
            seterrormessage('cannot update Profile Picture')
            return;
        })
    }

    // Handle Password Update
    const handlePasswordUpdate = async(event) =>{
        event.preventDefault()
        const passwordDetails={
            regNo:regNo,
            oldpassword:oldpassword,
            newpassword:newpassword
        }
        axios.put('http://localhost:5000/faculty/facultyupdatepassword',passwordDetails,{
            headers:{
                'x-access-token':sessionStorage.getItem('facultytoken')
            }
        })
        .then((res)=>{
            alert('Password Updated Succesfully')
            handlePasswordClose()
        })
        .catch((err)=>{
            seterrormessage(err.response.data.message)
        })
    }
    return(
        <>
       <FacultyHeader/>
            <Container>
            <br/>
            <br/>
                <center>
                <h3>Hi {name}, Welcome to Faculty Dashboard!!</h3>
                <h3 style={{color:"red"}}>{errormessage}</h3>
                <br/>
                 <Row>
                     <Col sm={5} style={{marginLeft:'4rem'}} >
                         <center>
                             <Card border="primary" style={{ width: '18rem',backgroundColor:'skyblue' }}>
                                 <Card.Header>Profile Picture</Card.Header>
                                 <Card.Body>
                                     <img src={verifiedpath} width="100%" height="100%" alt="avatar" />
                                 </Card.Body>
                                 <Card.Footer>
                                     <Form onSubmit={submitProfilePic} enctype="multipart/form-data" >
                                        <input type="file" name="facultypic" style={{cursor:"pointer"}} onChange={(e)=>setuploadedPic(e.target.files[0])} />
                                        <br/><br/>
                                        <Button type="submit">Update Pic</Button>
                                     </Form>
                                 </Card.Footer>
                             </Card>
                         </center>
                     </Col>
                     <Col sm={6} style={{marginRight:'1.2rem'}} >
                         <Table striped  variant="dark">
                             <tbody>
                                 
                                    
                                <tr>
                                    <td colSpan="2">Reg Number</td>
                                    <td>{regNo}</td>
                                 </tr>
                                 <tr>
                                     <td colSpan="2">Name</td>
                                     <td>{name}</td>
                                 </tr>

                                 <tr>
                                     <td colSpan="2">DOB</td>
                                     <td>{dob}</td>
                                 </tr>
                                 <tr>
                                     <td colSpan="2">Branch</td>
                                     <td>{branch}</td>
                                 </tr>
                                 <tr>
                                     <td colSpan="2">College Code</td>
                                     <td>{collegeCode}</td>
                                 </tr>
                                 <center>
                                     <Button style={{margin:"1.5rem"}} variant="primary" onClick={handleShow}>Update Profile</Button>&nbsp;
                                     <Button style={{marginLeft:"1rem"}} variant="info" onClick={handlePasswordShow}>Update Password</Button>
                                 </center>
                             </tbody>
                         </Table>
                     </Col>
                 </Row>
                </center>
                <Modal show={show} onHide={handleClose}>
                 <Modal.Header closeButton>
                 <Modal.Title>Update Profile Info
                    <h3 style={{color:"red"}}>{errormessage}</h3>
                </Modal.Title>
                 </Modal.Header>

                 <Modal.Body>
                     <Form onSubmit={handleSubmit}>
                         <Form.Group>
                             <Form.Label>Admin Reg Number</Form.Label>
                             <Form.Control type="text" value={regNo} readOnly />
                         </Form.Group> 

                         <Form.Group>
                             <Form.Label>Name</Form.Label>
                             <Form.Control type="text" placeholder="Enter Name" value={name} onChange={(e)=>setname(e.target.value)}/>
                         </Form.Group>                    

                         <Form.Group>
                             <Form.Label>DOB</Form.Label>
                             <Form.Control type="date" value={dob} onChange={(e)=>setdob(e.target.value)}/>
                         </Form.Group>

                         <Form.Group>
                             <Form.Label>Branch</Form.Label>
                             <Form.Control type="text" value={branch} onChange={(e)=>setbranch(e.target.value)}/>
                         </Form.Group>

                         <Form.Group>
                             <Form.Label>College Code</Form.Label>
                             <Form.Control type="text" value={collegeCode} onChange={(e)=>setcollegeCode(e.target.value)}/>
                         </Form.Group>

                         <Button type="submit" variant="success">
                             Update
                         </Button>&nbsp;
                         <Button variant="danger" onClick={handleClose}>
                             Close
                         </Button>
                     </Form>  
                 </Modal.Body>
             </Modal>
             {/* Password Update Modal */}
             <Modal show={showpasswordModal} onHide={handlePasswordClose}>
                 <Modal.Header closeButton>
                 <Modal.Title>Update Password
                    <h3 style={{color:"red"}}>{errormessage}</h3>
                </Modal.Title>
                 </Modal.Header>

                 <Modal.Body>
                     <Form onSubmit={handlePasswordUpdate}>
                         <Form.Group>
                             <Form.Label>Enter Old Password</Form.Label>
                             <Form.Control type="text" placeholder="Old Password" onChange={(e)=>setoldpassword(e.target.value)}/>
                         </Form.Group>

                         <Form.Group>
                             <Form.Label>Enter New Password</Form.Label>
                             <Form.Control type="text" placeholder="New Password" onChange={(e)=>setnewpassword(e.target.value)}/>
                         </Form.Group>

                         <Button type="submit" variant="success">
                             Update Password
                         </Button>&nbsp;
                         <Button variant="danger" onClick={handlePasswordClose}>
                             Close
                         </Button>
                     </Form>  
                 </Modal.Body>
             </Modal>
            </Container>
         </>
    )
}
export default FacultyProfile;