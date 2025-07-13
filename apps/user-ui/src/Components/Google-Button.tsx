import React from 'react'
import { FcGoogle } from "react-icons/fc";

const GoogleButton = () => {
  return (
    <div className='w-full flex justify-center  '>
      <div className='flex px-4 py-2 items-center gap-3 border border-gray-200 bg-gray-200 rounded-full hover:bg-primary hover:border-primary hover:text-white transition-all duration-200'>
        <FcGoogle className='text-3xl' />  <p className='text-base font-semibold '>Sign In with Google</p>
        </div>  </div>
  )
}

export default GoogleButton