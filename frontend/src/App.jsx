import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom"
import SignIn from "./Components/SignIn"
import SignUp from "./Components/SignUp"
import Dashboard from "./Components/Dashboard"
import toast, { Toaster } from 'react-hot-toast';
import Send from "./Components/Send"
import { useRecoilState, useSetRecoilState } from "recoil";
import { authState } from "./atom";
import { useEffect } from "react";
import axios from "axios";
function App() {
  const [auth, setAuth] = useRecoilState(authState);

   useEffect(()=>{
      async function validate(){
       console.log(auth)
      try {
        const token=localStorage.getItem('token')
        const res=await axios({
          url:"http://localhost:3000/api/v1/user/validate",
          method:'get',
          headers:{
            Authorization:`Bearer ${token}`
          }
        })

        if(res.status==200){
          setAuth(true)
        }

      } catch (error) {
        console.log(error)
          setAuth(false)
      }
      }
      validate()
   },[])


  return (
    <div>
        <BrowserRouter>
        <Routes>
        <Route path="/" element={!auth ? <Navigate to="/signup" />:<Dashboard />} />
          <Route path="/signup" Component={SignUp}/> 
          <Route path="/signin" Component={SignIn}/>
          <Route path="/dashboard" element={auth ? <Dashboard /> : <Navigate to="/signup" />}/>
          <Route path="/send" element={auth ? <Send /> : <Navigate to="/signup" />}/>
        </Routes>
        </BrowserRouter>
        <Toaster />
    </div>
  )
}

export default App
