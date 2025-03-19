import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Add from './components/Pages/Add/Add'
import List from './components/Pages/List/List'
import Home from './components/Pages/Home/Home'
import Orders from './components/Pages/Orders/Orders'
import { ToastContainer, toast } from 'react-toastify';
import Dashboard from './components/Pages/Dashboard/Dashboard'
import LeadManagement from './components/Pages/Leads/Lead'

import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  const url = "http://localhost:3000"
  return (
    <div>
      <ToastContainer/>
      <Navbar/>
      <hr/>
      <div className='app-content'>
        <Sidebar/>
        <div className='main-content'> 
        <Routes>
          <Route path="/" element={<Home url={url}/>} />
          <Route path='/add' element={<Add url={url}/>}/>
          <Route path='/list' element={<List url={url}/>}/>
          <Route path='/orders' element={<Orders url={url}/>}/>
          <Route path ='lead' element={<LeadManagement url={url}/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
        </Routes>
        </div>
      </div>
    </div>
  )
}

export default App