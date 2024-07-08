import { Navigate, Route, Routes } from "react-router-dom";

import toast, {Toaster} from 'react-hot-toast'

import LoginPage from "./pages/auth/login/LoginPage";
import SignupPage from "./pages/auth/signup/SignupPage";
import HomePage from "./pages/home/HomePage";
import Sidebar from "./component/common/SideBar";
import RightPanel from "./component/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./component/common/LoadingSpinner";

function App() {
  const {data:authUser, error, isError, isLoading} = useQuery({
    queryKey:["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json();
        if (data.error) {
          return null
        }
        if (data.error) {
          throw new Error(data.error)
        }
        // console.log("authUser is here",data)
        return data;
      } catch (error) {
        console.log(error);
        toast.error(error.message)
      }
    },
    retry:false
  })

  if (isLoading) {
    return(
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg"/>
      </div>
    )
  }

  return (
    <div className='flex max-w-6xl mx-auto'>

      {authUser && <Sidebar/>}
      <Routes>
          <Route path='/' element={authUser ? <HomePage /> : <Navigate to={'/login'}/>} />
          <Route path='/signup' element={!authUser ? <SignupPage /> : <Navigate to={'/'}/>} />
          <Route path='/login'  element={!authUser ? <LoginPage /> : <Navigate to={'/'}/>} />
          <Route path='/notifications'  element={authUser ?  <NotificationPage /> : <Navigate to={'/login'}/>} />
          <Route path='/profile/:userName'  element={authUser ?  <ProfilePage /> : <Navigate to={'/login'}/>} />
			</Routes>
      {authUser && <RightPanel/>}
      <Toaster/>
    </div>
  );
}

export default App;
