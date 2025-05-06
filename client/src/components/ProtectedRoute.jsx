import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = () => {
    const { currentUser } = useSelector((state) => state.user)
  return (
    currentUser ? <Outlet /> : <Navigate to="/sign-in" replace={true} />
  )
}

export default ProtectedRoute
