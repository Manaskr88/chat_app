import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'

import { signUp, login , resetPassword } from '../../config/firebase.js'

const Login = () => {

  const [state, setState] = useState('Sign Up')


  // for firebase 

  const [username, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submitHandler = (e) => {
    e.preventDefault();

    if (state === "Sign Up") {

      signUp(username, email, password)
      // console.log(signUp);
      

    }

    else{
      login(email  , password)
      // console.log(login);
      
    }






  }



  return (
    <div className='login'>

      <img src={assets.mychatt} className='logo' />

      <form onSubmit={submitHandler} className='login-form'>

        <h2>{state}</h2>

        {
          state === "Sign Up" ? <input onChange={(e) => setUserName(e.target.value)} value={username} type="text" placeholder='username' required className='form-input' /> : null
        }



        <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder='email' required className='form-input' />
        <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder='password' required className='form-input' />

        <button type='submit'>{state === "Sign Up" ? "Create Account" : "Login"}</button>

        <div className="term">

          <input type='checkbox' />
          <p>Agree to the terms of use & privacy policy </p>

        </div>

        <div className="forgot">

          {state === "Sign Up" ? <p className="login-toggle"> Already have an account ? <span onClick={() => { setState("Login") }}>Click Here</span> </p>
            :
            <p className="login-toggle"> New User ? <span onClick={() => { setState("Sign Up") }}>Sign Up</span></p>
          }

          {state === "Login" ? 
            <p className="login-toggle"> Forgot Password? <span onClick={() => resetPassword(email) }>Reset here</span></p>
           :
           null

        }



        </div>

      </form>


    </div>
  )
}

export default Login
