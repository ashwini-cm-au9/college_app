import StudentHeader from './StudentHeader';
import {Form,Container,Row,Col,Button,Table} from 'react-bootstrap';
import {useState,useEffect} from 'react';
import axios from 'axios';
const GetAttendance = () => {

    // while getting values from session storage parse it
    const studentregNo = JSON.parse(sessionStorage.getItem('studentregNo'))
    
    const [regNo]=useState(studentregNo);
    const [studentid,setstudentid]=useState();

    // attendace details of the student
    const [attendancedetails,setattendancedetails]=useState();

    const[errormessage,seterrormessage]=useState();

    // using student regNo, we are finding student ID
    useEffect(()=>{
        axios.get(`http://localhost:5000/student/studentbyid/${regNo}`)
        .then((res)=>{
            setstudentid(res.data._id)
        })
        .catch((err)=>{
            seterrormessage('cannot find student information');
        })
    },[]);

    // On clicking the button we are finding his attendance details
    const findmyattendance=async()=>{
        let studentdata={
            studentid:studentid
        }
        await axios.post('http://localhost:5000/student/getattendance',studentdata)
        .then((res)=>{
            // console.log(res.data.attendanceData)
            setattendancedetails(res.data.attendanceData);
            seterrormessage('')
        })
        .catch((err)=>{
            seterrormessage(err.response.data.message);
            // seterrormessage('cannot find student information');
        })
    }

    // display student attendance
    const displayAttendance=(attendancedetails)=>{
        
        if(attendancedetails){
            return attendancedetails.map((item,idx)=>{
                let attendancePercentage=((item.classesAttendedByStudent / item.totalClassesByFaculty)*100).toFixed(2)
                
                return(
                    <tr>
                        <td>{idx}</td>
                        <td>{item.subject.subName}</td>
                        <td>{item.subject.subCode}</td>
                        <td>{item.totalClassesByFaculty}</td>
                        <td>{item.classesAttendedByStudent}</td>
                        <td>{attendancePercentage} %</td>   
                    </tr>
                )
            })
        }
    }
    // console.log("regNo>>>>>>>",regNo)
    // console.log("studentid>>>>",studentid)
    // console.log("attendancedetails>>>>>",attendancedetails)

    return(
        <>
        <StudentHeader/>
        <Container>
            <div style={{margin:"1rem"}}>
                <center>
                    <h1>My Attendance</h1>
                    <h3 style={{color:"red"}}>{errormessage}</h3>
                </center>
            </div>
            
            <Row>
                <Col md={2} xs={5} style={{marginRight:"1rem"}}>
                    <Button onClick={findmyattendance}>check My Attendance</Button>
                </Col>
                <Col md={7} xs={12} style={{marginLeft:"3rem"}}>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>SLNO</th>
                                <th>Subject Name</th>
                                <th>Subject Code</th>
                                <th>Total Classes</th>
                                <th>Attended Classes</th>
                                <th>Attendence Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                        {displayAttendance(attendancedetails)}
                        </tbody>
                </Table>
                </Col>
            </Row>
        </Container>
        </>
    )
}
export default GetAttendance;