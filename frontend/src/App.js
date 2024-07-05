import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/login/LoginPage";
import SignupPage from "./pages/auth/signup/SignupPage";
import HomePage from "./pages/home/HomePage";
import Sidebar from "./component/common/SideBar";
import RightPanel from "./component/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

function App() {
  return (
    <div className='flex max-w-6xl mx-auto'>

      <Sidebar/>
      <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/login'  element={ <LoginPage />} />
          <Route path='/notifications'  element={ <NotificationPage />} />
          <Route path='/profile/:userName'  element={ <ProfilePage />} />
			</Routes>
      <RightPanel/>
    </div>
  );
}

export default App;
