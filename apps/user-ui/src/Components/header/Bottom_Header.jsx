"use client";
import { AlignLeft, ChevronDown, ChevronUp, HeartIcon, ShoppingCart } from "lucide-react";
import React, { useEffect, useState } from "react";
import { navItems } from "../../configs/constants";
import Link from "next/link";
import { IoPersonOutline } from "react-icons/io5";
import userUser from "../../hooks/useUser";
import Spinner from "../Spinner";

const Bottom_Header = () => {
  const [openCategory, setOpenCategory] = useState(false);
  const [isSticky,setisSticky]=useState(false);
  const { user,isLoading } = userUser();

  //  Track scroll position

  useEffect(()=>{
    const handleScroll=()=>{
      if(window.scrollY>100){
        setisSticky(true);
      }
      else{
        setisSticky(false);
      }
    };

    window.addEventListener("scroll",handleScroll);
    return ()=> window.removeEventListener("scroll",handleScroll);

  },[])

  return (
    <div className={`w-full transition-all duration-100 ${isSticky ? "fixed top-0 left-0 z-100 bg-white shadow-lg px-10" : "relative px-5"}    `}>
      <div className={`w-full relative  flex items-center justify-between px-5 ${isSticky ? "pt-3" :"py-0"}`}>
        {/* Category Dropdown */}
        <div className={`w-[260px]  cursor-pointer flex items-center justify-between px-5 h-[50px] bg-primary hover:bg-orange-500 transition-colors`} onClick={() => setOpenCategory((prev) => !prev)} >
          <div
            className="flex items-center gap-3 text-white text-sm   rounded-md cursor-pointer  "
            
          >
            <div className="flex items-center gap-2">
              <AlignLeft size={20} />
              <span>All Departments</span>
            </div>
            {openCategory ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>

          {/* Dropdown Menu */}
          {openCategory && (
            <div className={`absolute  left-0 ${isSticky ? "top-[70px]" : "top-[50px]"}  mt-2 w-60 bg-white shadow-lg border rounded-md z-10`}>
              <ul className="text-sm text-gray-700">
                <li className="px-4 py-3 hover:bg-gray-100 cursor-pointer">Electronics</li>
                <li className="px-4 py-3 hover:bg-gray-100 cursor-pointer">Clothing</li>
                <li className="px-4 py-3 hover:bg-gray-100 cursor-pointer">Home & Kitchen</li>
                <li className="px-4 py-3 hover:bg-gray-100 cursor-pointer">Beauty</li>
              </ul>
            </div>
          )}
        </div>

        {/* Navigation Menu Placeholder */}
        <div className="flex items-center">
        {navItems.map((item,index)=>(
          <Link className="px-5  text-base hover:text-primary text-gray-700 " href={item.href} key={index}>{item.title}</Link>
        ))}
        </div>
         {isSticky  && (
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
        )}
      </div>
      
      <div>
       
      </div>
    </div>
  );
};

export default Bottom_Header;
