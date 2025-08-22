import React from 'react'
import { useAuthStore } from '../store/useAuthStore.js'

const Profile = () => {
    const { authUser } = useAuthStore();
    console.log(authUser);
  return (
    <div>Profile</div>
  )
}

export default Profile