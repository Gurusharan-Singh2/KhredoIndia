'use client'
import Link from 'next/link'
import { HeartIcon, Search, ShoppingCart } from "lucide-react";
import { IoPersonOutline } from "react-icons/io5";
import React from 'react'
import Image from 'next/image';
import Logo from "../../../public/assets/Kg.png"
import userUser from '../../hooks/useUser';
import Spinner from '../Spinner';

const Top_Header = () => {
  const { user,isLoading } = userUser();
  console.log("user in header", user);

  

  return (
     <div className="w-[90%] max-w-[1400px] mx-auto -mt-5  flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" >
         <Image src={Logo} alt="Khreedo India Logo" width={180} height={70} />

        </Link>

        {/* Search Bar */}
        <div className="relative w-[50%] max-w-[600px]">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full h-12 px-5 pr-16 rounded-full border-2 border-primary outline-none focus:ring-2 focus:ring-primary font-medium text-sm text-gray-700 transition-all"
          />
          <button className="absolute top-0 right-0 h-12 w-14 bg-primary rounded-r-full flex items-center justify-center hover:bg-primary transition-colors">
            <Search color="#fff" size={20} />
          </button>
        </div>

        {/* Icons Section */}
        <div className="flex items-center gap-8">
          
          {/* Login */}
          {user ? (<>
   <Link href="/profile" className="flex items-center gap-2 group">
            <div className="p-2 border border-gray-300 rounded-full group-hover:border-primary transition-colors">
              <IoPersonOutline size={22} className="text-gray-700 group-hover:text-primary" />
            </div>
            <div className="text-sm font-medium text-gray-700 leading-tight">
              <p className="text-xs">Hello,</p>
              <p className="group-hover:text-primary transition-colors">{user.name.split(" ")[0]}</p>
            </div>
          </Link>
          
          </>):(<>
             <Link href="/login" className="flex items-center gap-2 group">
            <div className="p-2 border border-gray-300 rounded-full group-hover:border-primary transition-colors">
              <IoPersonOutline size={22} className="text-gray-700 group-hover:text-primary" />
            </div>
            <div className="text-sm font-medium text-gray-700 leading-tight">
             
             { isLoading?<Spinner/>:(<>
           
              <p className="text-xs">Hello,</p>
              <p className="group-hover:text-primary transition-colors">Sign In</p>
              </>) }</div>
          </Link>
          </>)}
       

          {/* Wishlist */}
          <Link href="/wishlist" className="relative group">
            <HeartIcon className="text-gray-700 group-hover:text-primary transition-colors" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
              0
            </span>
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative group">
            <ShoppingCart className="text-gray-700 group-hover:text-primary transition-colors" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
              0
            </span>
          </Link>
        </div>
      </div>
  )
}

export default Top_Header