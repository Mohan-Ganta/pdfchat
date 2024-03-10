import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className='relative flex flex-col h-screen overflow-hidden w-full'>
    <Navbar/> 
    <div className='flex-1 h-[-webkit-fill-available]'>
    <Outlet />
    </div>
    
   <Footer/>
    </div>
    
    )
}
