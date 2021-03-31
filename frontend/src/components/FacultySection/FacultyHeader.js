import {Navbar,Nav} from 'react-bootstrap';
import {Link,useHistory} from 'react-router-dom';

const FacultyHeader=()=>{

    let history = useHistory();

    const logout=()=>{
        sessionStorage.removeItem('facultytoken')
        sessionStorage.removeItem('facultyregNo')
        history.push('/facultylogin');
    }

    return(
        <>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand as={Link} to="/facultyprofile">Faculty</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Link to="/markattendance" className="nav-link">Mark Attendance</Link>
              <Link to="/updatemarks" className="nav-link">Update Marks</Link>
              <Link to="/facultysubjects" className="nav-link">My Subjects</Link>
              </Nav>
            <Nav>
              <Link onClick={logout}>Log out</Link>
            </Nav>
        </Navbar.Collapse>
      </Navbar>
        </>
    )
}
export default FacultyHeader;