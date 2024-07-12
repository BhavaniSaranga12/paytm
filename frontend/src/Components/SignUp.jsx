import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import { useSetRecoilState } from 'recoil';
import { authState } from '../atom';

const SignUp = () => {
    const navigate=useNavigate();
    const [firstName, setFirstName]=useState('');
    const [lastName, setLastName]=useState('');
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');
    const setauth=useSetRecoilState(authState)

async function onSubmit(){

 try {
    const response=await axios({
        url:'http://localhost:3000/api/v1/user/signup',
        method:'post',
        data:{
            firstName,
            lastName,
            email,
            password
        }
    })
    if(response.status==200){
        toast.success(response.data.message)
        localStorage.removeItem('token');
        localStorage.setItem('token',response.data.token)
        navigate('/dashboard')
        setauth(true)
    }
 
 } catch (e) {
    console.log(e)
    if (e.response && e.response.status === 411) {
        toast.error(e.response.data.message);
    } else {
        toast.error('An error occurred');
    }
 }

}


  return (
    <div className='h-[100vh] bg-slate-500 flex justify-center items-center'>
        <div className='bg-white p-7 rounded flex flex-col gap-2'>
        <div className='font-bold text-3xl text-center'>Sign Up</div>
        <p className='text-gray-400 p-3'>Enter your information to create an account</p>
        <label htmlFor="first-name" className='font-semibold'>First Name</label>
       
        <input type="text" 
        name="first-name"
         id="first-name" 
         placeholder='John' 
         className='p-2'
         value={firstName}
         onChange={(e)=>setFirstName(e.target.value)}
          />

        <label htmlFor="last-name" className='font-semibold'>Last Name</label>
       
        <input 
        type="text" 
        name="last-name" 
        id="last-name" 
        placeholder='Doe'  
        className='p-2' 
        value={lastName}
        onChange={(e)=>setLastName(e.target.value)}
        />

        <label htmlFor="email" className='font-semibold'>Email</label>
       
       
        <input 
        type="email"
         name="email"
          id="email" 
          placeholder='johndoe@example.com'  
          className='p-2'
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          />
       
       
        <label htmlFor="password" className='font-semibold'>Password</label>
        
        
        <input 
        type="password" 
        name="password"
         id="password" 
          className='p-2'
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          />

        <button className='bg-black text-white rounded py-2 cursor-pointer' onClick={onSubmit}>Sign Up</button>
        <p className='text-center'>Already have an account? <span className='underline cursor-pointer' onClick={()=>navigate('/signin')} >Login</span></p>
        </div>
    </div>
  )
}

export default SignUp