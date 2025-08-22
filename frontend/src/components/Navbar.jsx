import React from 'react'
import { useAuthStore } from '../store/useAuthStore.js'

const Navbar = () => {
    const { authUser } = useAuthStore();
    console.log(authUser);
  return (
    <div>Navbar</div>
  )
}

export default Navbar