import React,{ useContext, useState} from 'react'
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from "axios"

const LoginPopup = ({setShowLogin}) => {

    const {url,setToken} =useContext(StoreContext)

    const [currState,setCurrState]=useState('Login')
    const [data,setData]=useState({
      name:"",
      email:"",
      password:""
    })

    //using onChangeHandler ,,,,It take data from input field and save it in state variable
    //from event below ,we can extract name,value
    const onChangeHandler =(event)=>{
      const name=event.target.name;
      const value=event.target.value;

      setData(data=>({...data,[name]:value}))//it set values(name,value) in state variable
    }

    // useEffect(()=>{  //whenever data will be updated ,this is executed   ...by using this ,if we enter name,email,password we can see it in console.
    // console.log(data);
                    
    // },[data])

    const onLogin = async(event)=>{
      event.preventDefault();  //It is used when we are enter details in login form and clicks login,the form wont vanish.If this not used entered details will be gone.
      let newUrl=url;
      if(currState==="Login"){
        newUrl+="/api/user/login"  //login API
      }
      else{
        newUrl+="/api/user/register"  //register API
      }
      const response=await axios.post(newUrl,data);  //this API work in both login,register,if it state is login,it hit the login api

      if(response.data.success){  //that is we successfully login,register
          setToken(response.data.token);
          localStorage.setItem("token",response.data.token);
          setShowLogin(false)  //It used to hide login page
      }
      else{
        alert(response.data.message)
      }
    }

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
            <h2>{currState}</h2>
            <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt=''/>
        </div>
        <div className='login-popup-inputs'>
            {currState==="Login"?<></>:<input name='name' onChange={onChangeHandler} value={data.name} type='text' placeholder='Enter name' required />}
            
             <input name='email' onChange={onChangeHandler} value={data.email} type='email' placeholder='Enter email' required/>
             <input name='password' onChange={onChangeHandler} value={data.password} type='password' placeholder='Enter Password' required/>
        </div>
        <button type='submit'>{currState==="Sign Up"?"Create account":"Login"}</button>
        <div className='login-popup-condition'>
            <input type='checkbox' required/>
          <p>By continuing ,I agree to the terms of use & privacy policy.</p>
        </div>
        {currState==="Login"
        ?<p>Create a new account? <span onClick={()=>setCurrState("Sign Up")}>Click here</span></p>
        : <p>Already have an account? <span onClick={()=>setCurrState("Login")}>Login here</span></p>
        }
      </form>
    </div>
  )
}

export default LoginPopup
