import {Navbar,Nav} from 'react-bootstrap';
import {Link,useHistory} from 'react-router-dom';

const StudentHeader=()=>{

    let history = useHistory();

    const logout=()=>{
        sessionStorage.removeItem('studenttoken')
        sessionStorage.removeItem('studentregNo')
        history.push('/studentlogin');
    }

    return(
        <>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand as={Link} to="/studentprofile">Student</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto" variant="info">
              <Link to="/getattendance" className="nav-link">My Attendance</Link>
              <Link to="/getresults" className="nav-link">My Test Results</Link>
              <Link to="/studentsubjects" className="nav-link">My Subjects</Link>
              </Nav>
            <Nav>
              <Link onClick={logout}>Log out</Link>
            </Nav>
        </Navbar.Collapse>
      </Navbar>
        </>
    )
}
export default StudentHeader;