import {useState} from 'react';
import axios from 'axios';
import { useHistory,Link } from 'react-router-dom';

const FacultyLogin = () => {
    const [regNo,setregNo]=useState();
    const [password,setpassword]=useState();
    const [errormessage,seterrormessage]=useState();

    let history = useHistory()

    const handleSubmit= async (event)=>{
        event.preventDefault();
        const user={
            regNo:regNo,
            password:password
        }
        // console.log(user)
       await axios.post('http://localhost:5000/faculty/facultylogin',user) 
       .then((res)=>{
           sessionStorage.setItem('facultytoken',res.data.token);
		   const facultyRegNumber = res.data.facultydata.regNo
		   sessionStorage.setItem('facultyregNo',JSON.stringify(facultyRegNumber));
           history.push('/facultyprofile');
       })
	   .catch((err)=>{
		   if(err){
				seterrormessage(err.response.data.message)
		   }
		   return;
	   })
    }
    return(
        <div className="limiter">
		<div className="container-login100">
			<div className="wrap-login100">
				<form className="login100-form validate-form" onSubmit={handleSubmit}>
					<Link className="txt1 p-b-34">
							Admin?
						<Link to="/" className="txt2">
						Admin Dashboard
						</Link>
					</Link>
                    <Link className="txt1 p-l-45 p-b-34">
							Student?
						<Link to="/studentlogin" className="txt2">
						Student Dashboard
						</Link>
					</Link>
                    {/* if login fails, we can show message here */}
                    <h3 style={{color:'red'}}>{errormessage}</h3>
					<span className="login100-form-title p-b-34">
						Faculty Login Page
					</span>
					<div className="wrap-input100 rs1-wrap-input100 validate-input m-b-20" data-validate="Type user name">
						<input id="first-name" className="input100" type="text" name="username" placeholder="Register Number" onChange={(e)=>{setregNo(e.target.value)}}/>
						<span className="focus-input100"></span>
					</div>
					<div className="wrap-input100 rs2-wrap-input100 validate-input m-b-20" data-validate="Type password">
						<input className="input100" type="password" name="pass" placeholder="Password" 
                        onChange={(e)=>setpassword(e.target.value)}/>
						<span className="focus-input100"></span>
					</div>
					
					<div className="container-login100-form-btn">
						<button type="submit" className="login100-form-btn">
							Log in
						</button>
					</div>

					<div className="text-center p-t-27 p-l-75 p-b-10">
						<span className="txt1">
							Forgot
						</span>
                        &nbsp;
						<Link to="#" className="txt2">
							User name / password?
						</Link>
					</div>
				</form>
				
				<div className="login100-more" style={{backgroundImage: "url('assets/images/bg-01.jpg')"}}></div>
			</div>
		</div>
	</div>
    )
}
export default FacultyLogin;