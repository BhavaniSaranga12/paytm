
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
const Dashboard = () => {
    const [balance,setbalance]=useState(0)
    const [filter,setFilter]=useState('')
    const [users,setUsers]=useState([])

   const navigate=useNavigate();

  
   
    useEffect( ()=>{

        async function fetchUsers(){
            const token=localStorage.getItem('token')
            const res=await axios({
                url:`http://localhost:3000/api/v1/user/bulk?filter=${filter}`,
                method:'get',
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            console.log(res.data.user);
            setUsers(res.data.user);
        }

        async function fetchBalance(){
            const token=localStorage.getItem('token')
            
           try {
            const res=await axios({
                url:`http://localhost:3000/api/v1/account/balance`,
                method:'get',
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            if(res.status==200) {
                setbalance(res.data.balance)
            }
           } catch (error) {
            console.log(error)
            if(error.response && error.response.status===400){
                toast.error(error.response.data.message)
            }
            else {
                toast.error('An error occurred');
            }
           }
          
        }
        fetchBalance()
        fetchUsers()
    },[filter])
  return (
    
    <div className='overflow-hidden'>
        
        <div className='flex flex-row justify-between items-center px-5 py-4 shadow-md'>
            <div className='font-bold text-3xl'>Payments App</div>
            <div className='flex flex-row items-center pr-4'>
                <p className='px-3 text-xl'>Hello</p>
                <p className='flex flex-col justify-center items-center rounded-full bg-blue-100 w-[40px] h-[40px]'>U</p>
            </div>
        </div>
        <div className='px-5 font-bold py-5 text-2xl'>Your Balance  Rs.{balance}</div>
        <div className='px-5 font-bold py-3 text-2xl'>Users</div>
        <input type="text" placeholder='Search' className=' px-5 py-2 mx-4 border rounded w-[95vw] '  value={filter} onChange={(e)=>{setFilter(e.target.value)}} />
           {
            users.map((user,index)=>(
                <div className='mx-8 my-4  flex flex-row justify-between items-center' key={index}>
                <div className='flex flex-row gap-4 items-center'>
                 <p className='bg-blue-50 rounded-full w-10 h-10 flex flex-col justify-center items-center font-semibold'>{user.firstName[0].toUpperCase()}</p>
                 <p className='text-xl font-semibold '>{user.firstName+" "+user.lastName}</p>
                </div>
                <button className='bg-black text-white py-2 px-3 rounded' id={user._id} onClick={()=>navigate(`/send?id=${user._id}&name=${user.firstName}`)}>Send Money</button>
             </div>
            ))
           }
       
    </div>
  )
}

export default Dashboard