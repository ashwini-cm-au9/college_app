import StudentHeader from './StudentHeader';
import {Row,Col,Container,Button,Form,Table} from 'react-bootstrap';
import {useState,useEffect} from 'react';
import axios from 'axios';

const GetTestResults = () =>{

     // while getting values from session storage parse it
     const studentregNo = JSON.parse(sessionStorage.getItem('studentregNo'))
    
     const [regNo]=useState(studentregNo);
     const [studentid,setstudentid]=useState();

    // test for which marks has to find
    const [testid,settestid]=useState();

    // marks details of the student'
    const [marksdetails,setmarksdetails]=useState();

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

    // find marks
    const findMarks = async() => {
        let studentdata={
            studentid:studentid,
            testid:testid
        }
        await axios.post('http://localhost:5000/student/gettestresults',studentdata)
            .then((res)=>{
                setmarksdetails(res.data.marksData);
                seterrormessage('')
            })
            .catch((err)=>{
                seterrormessage(err.response.data.message);
            })
        }
    
    // display Marks
    const displayMarks=(marksdetails)=>{
        if(marksdetails){
            return marksdetails.map((item,idx)=>{
                var percentage = ((item.obtainedmarks/item.totalmarks)*100).toFixed(2);
                return(
                    <tr>
                        <td>{idx}</td>
                        <td>{item.subject.subName}</td>
                        <td>{item.subject.subCode}</td>
                        <td>{item.totalmarks}</td>
                        <td>{item.obtainedmarks}</td>
                        <td>{percentage} %</td>
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
                        <h1>Test Results</h1>
                        <h3 style={{color:"red"}}>{errormessage}</h3>
                    </center>
                </div>

                <Row> 
                    <Col lg={3}>
                        <Form.Group>
                            <Form.Label>Select Test:</Form.Label>
                                <select className="form-control" id="test" onChange={(e)=>settestid(e.target.value)}>
                                    <option>----SELECT TEST-----</option>
                                    <option value="INT1">INTERNAL-1</option>
                                    <option value="INT2">INTERNAL-2</option>
                                    <option value="INT3">INTERNAL-3</option>
                                    <option value="LAB">LAB INTERNAL</option>
                                    <option value="MAINS">MAINS</option>
                                </select>
                        </Form.Group>
                        <Button onClick={findMarks}>Find Results</Button>
                    </Col>
                    <Col>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>SLNO</th>
                                    <th>Subject Name</th>
                                    <th>Subject Code</th>
                                    <th>Total Marks</th>
                                    <th>Obtained Marks</th>
                                    <th>Total Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                            {displayMarks(marksdetails)}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container> 
        </>
    )
}
export default GetTestResults;