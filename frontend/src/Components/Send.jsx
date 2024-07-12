import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate,useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'


const Send = () => {
  const navigate=useNavigate()
  const [searchParams]=useSearchParams();

  const id=searchParams.get('id');
  const name=searchParams.get('name')
  const [amount,setAmount]=useState(0);



 async function transferMoney(){
    const token=localStorage.getItem('token')
    console.log(amount);
    try {
        const response=await axios({
            url:"http://localhost:3000/api/v1/account/transfer",
            method:'post',
            headers:{
                Authorization:`Bearer ${token}`
            },
            data: {
                to: id,
                amount:amount
            }
        }) 
if(response.status==200){
    toast.success(response.data.message);
  navigate('/dashboard')
}

    } catch (error) {
        console.log(error)
        if(error.response && error.response.status===403){
            toast.error(error.response.data.message)
        }
        else if(error.response && error.response.status===411){
            toast.error(error.response.data.message)
        }
        else
        toast.error('Error in transfering money')
    }
   


 }


  return (
    <div className='h-[100vh] flex  justify-center items-center bg-slate-200'>
        <div className='flex flex-col w-[30%] bg-white py-3 px-8 rounded'>
        <div className='font-bold text-2xl text-center py-5'>Send Money</div>
        <div className='flex flex-row gap-4  items-center mt-10 '>
            <p className='text-white bg-green-500 rounded-full h-[40px] w-[40px] flex flex-col justify-center items-center'>{name.charAt(0)}</p>
            <p className='font-bold text-xl'>{name}</p>
        </div>
        <label htmlFor="amt" className='py-2 font-semibold '>Amount (in Rs)</label>
        <input type="text" id='amt' placeholder='Enter amount' className='p-3' value={amount} onChange={(e)=>setAmount(e.target.value) }/>
         <button className='bg-green-500 text-white rounded py-3 my-4 ' onClick={transferMoney}>Initiate Transfer</button>
        </div>
    </div>
  )
}

export default Send