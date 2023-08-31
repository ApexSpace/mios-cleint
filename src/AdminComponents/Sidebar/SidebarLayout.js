import React from 'react'
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Sidebar.css';
const SidebarLayout = ({ setuser }) => {
  return (
    <>
      <Sidebar setUser={setuser} />
      <Outlet />
    </>
  )
}

export default SidebarLayout