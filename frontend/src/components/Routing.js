import {Route,Redirect} from 'react-router-dom';
// Admin Section
import AdminLogin from './AdminSection/AdminLogin';
import AdminProfile from './AdminSection/AdminProfile';
import AddFaculty from './AdminSection/AddFaculty';
import AddSubject from './AdminSection/AddSubject';
import AddStudent from './AdminSection/AddStudent';
import AddAdmin from './AdminSection/AddAdmin';
import GetFaculty from './AdminSection/GetFaculty';
import GetStudent from './AdminSection/GetStudent';
import GetSubject from './AdminSection/GetSubject';
import GetAdmin from './AdminSection/GetAdmin';
// Student Section
import StudentLogin from './StudentSection/StudentLogin';
import StudentProfile from './StudentSection/StudentProfile';
import GetAttendance from './StudentSection/GetAttendance';
import GetTestResults from './StudentSection/GetTestResults';
import StudentSubjects from './StudentSection/StudentSubjects';
// Faculty Section
import FacultyLogin from './FacultySection/FacultyLogin';
import FacultyProfile from './FacultySection/FacultyProfile';
import MarkAttendance from './FacultySection/MarkAttendance';
import UpdateMarks from './FacultySection/UpdateMarks';
import FacultySubjects from './FacultySection/FacultySubjects';

const Routing = ()=>{   

    const isAuth = () => {
        let user;
        user = sessionStorage.getItem('admintoken')||sessionStorage.getItem('studenttoken')||sessionStorage.getItem('facultytoken');
        if(user){
            return true;
        }
        else{
            return false;
        }
    }

    const PrivateRoute = ({ component:Component, ...rest })=>(
        <Route {...rest} render={(props) => (
            isAuth() === true
            ? <Component {...props} />
            : <Redirect to='/'/>
        )}/>
    )
    return(
        <>
        {/* Admin Section */}
        <Route exact path="/" component={AdminLogin}/>
        <PrivateRoute path="/adminprofile" component={AdminProfile}/>
        <PrivateRoute path="/addfaculty" component={AddFaculty}/>
        <PrivateRoute path="/getfaculty" component={GetFaculty}/>
        <PrivateRoute path="/getstudent" component={GetStudent}/>
        <PrivateRoute path="/addstudent" component={AddStudent}/>
        <PrivateRoute path="/addsubject" component={AddSubject}/>
        <PrivateRoute path="/getsubject" component={GetSubject}/>
        <PrivateRoute path="/addadmin" component={AddAdmin}/>
        <PrivateRoute path="/getadmin" component={GetAdmin}/>
        {/* Student Section */}
        <Route exact path="/studentlogin" component={StudentLogin}/>
        <PrivateRoute path="/studentprofile" component={StudentProfile}/>
        <PrivateRoute path="/getattendance" component={GetAttendance}/>
        <PrivateRoute path="/getresults" component={GetTestResults}/>
        <PrivateRoute path="/studentsubjects" component={StudentSubjects}/>

        {/* Faculty Section */}
        <Route exact path="/facultylogin" component={FacultyLogin}/>
        <PrivateRoute path="/facultyprofile" component={FacultyProfile}/>
        <PrivateRoute path="/markattendance" component={MarkAttendance}/>
        <PrivateRoute path="/updatemarks" component={UpdateMarks}/>
        <PrivateRoute path="/facultysubjects" component={FacultySubjects}/>
        </>
    )
}
export default Routing;