import { useState } from 'react'
import Login from './pages/login'
import Register from './pages/register'
import Activate from './pages/activate';
import ForgotPassword, { ResetPassword } from './pages/forgotPassword';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from './components/navBar';
import { AdminDashboard } from './pages/adminDashboard';
import { StudentDashboard } from './pages/studentDashboard';
import { CompanyDashboard } from './pages/companyDashboard';
import { TrainerDashboard } from './pages/trainerDashboard';




function App() {

  return (
    <BrowserRouter>
      {/* <NavBar /> */}
      <Routes>
        <Route path='/' Component={Register} />
        <Route path='/login' Component={Login} />
        <Route path='/activate' Component={Activate} />
        <Route path='/forgotpassword' Component={ForgotPassword} />
        <Route path='/resetpassword/:token' Component={ResetPassword} />
        <Route path='/admin-dashboard' Component={AdminDashboard} />
        <Route path='/trainer-dashboard' Component={TrainerDashboard} />
        <Route path='/company-dashboard' Component={CompanyDashboard} />
        <Route path='/student-dashboard' Component={StudentDashboard} />
      </Routes>
    </BrowserRouter>

  );
}

export default App
