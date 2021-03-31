import StudentHeader from './StudentHeader';
import {Container,Row,Col,Button,Table} from 'react-bootstrap';
import {useState,useEffect} from 'react';
import axios from 'axios';

const StudentSubjects = () => {

    const studentregNo = JSON.parse(sessionStorage.getItem('studentregNo'))
    
    const [regNo]=useState(studentregNo);

    const [sem,setsem]=useState();
    const [branch,setbranch]=useState();
    const[subjects,setsubjects]=useState();

    const[errormessage,seterrormessage]=useState();

    useEffect(()=>{
        axios.get(`http://localhost:5000/student/studentbyid/${regNo}`)
        .then((res)=>{
            setsem(res.data.sem);
            setbranch(res.data.branch)
        })
    },[]);

    // find my Subjects
    const findSubjects=()=>{
        const details={
            branch:branch,
            sem:parseInt(sem)
        }
        axios.post('http://localhost:5000/student/subjectlist', details)
        .then((res)=>{
            seterrormessage('');
            setsubjects(res.data)
        })
        .catch((err)=>{
            seterrormessage(err.response.data.message)
        })
    }

    // display subjects
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
        <StudentHeader/>
            <Container>
                <div style={{margin:"1rem"}}>
                    <center>
                        <h1>My Subjects</h1>
                        <h3 style={{color:"red"}}>{errormessage}</h3>
                    </center>
                </div>
                
                <Row>
                    <Col md={2} xs={5} style={{marginRight:"1rem"}}>
                        <Button onClick={findSubjects}>Find My Subjects</Button>
                    </Col>
                    <Col md={7} xs={12} style={{marginLeft:"3rem"}}>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>SLNO</th>
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
            </Container>
        </>
    )
}
export default StudentSubjects;