"use client";
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface Formdata {
  email: string;
  password: string;
}

const Login = () => {
  const [passwordVisible, setpasswordVisible] = useState(false);
 
  const [rememberMe, setrememberMe] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<Formdata>();

  const LoginMutation=useMutation({
    mutationFn:async(data:Formdata)=>{
      const response=await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/login-user`,data,{withCredentials:true});
      return response.data;
    }
    ,
    onSuccess:(data)=>{
      toast.success("Login Successfull !!!")
      
      router.push("/")

    },
     onError: (err) => {
    if (err instanceof AxiosError) {
      toast.error(err.response?.data?.message || err.message);
    }
  },
  })
  const OnSubmit = (data: Formdata) => {
    LoginMutation.mutate(data);
  };

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-[#f7f8fc] to-[#eef1f6] flex justify-center items-center px-4 py-10'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8'>
        <h3 className='text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2'>
          Login to Khreedo India Seller Account
        </h3>
        <p className='text-center text-gray-500 mb-5 text-sm sm:text-base'>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className='text-primary font-medium hover:text-orange-600 transition-colors'>
            Sign up
          </Link>
        </p>


        <div className='flex items-center my-6 text-gray-400 text-sm'>
          <div className='flex-1 border-t border-gray-300' />
          <span className='px-3'>or Sign in with Email</span>
          <div className='flex-1 border-t border-gray-300' />
        </div>

        <form onSubmit={handleSubmit(OnSubmit)} className='flex flex-col gap-4'>
          {/* Email Field */}
          <div>
            <label className='text-gray-700 text-sm font-medium block mb-1'>Email</label>
            <input
              type='email'
              placeholder='Enter your email'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm'
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.email && (
              <span className='text-red-500 text-sm mt-1 block'>
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className='text-gray-700 text-sm font-medium block mb-1'>Password</label>
            <div className='relative'>
              <input
                type={passwordVisible ? 'text' : 'password'}
                placeholder='Enter your password'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 pr-10 text-sm'
                {...register("password", {
                  required: "password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  },
                  
                })}
              />
              <button
                type='button'
                onClick={() => setpasswordVisible(!passwordVisible)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500'
              >
                {passwordVisible ? <Eye /> : <EyeOff />}
              </button>
            </div>
            {errors.password && (
              <span className='text-red-500 text-sm mt-1 block'>
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Remember Me and Forgot Password */}
          <div className='flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-700 gap-2'>
            <label className='flex items-center gap-2'>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setrememberMe(!rememberMe)}
                className='accent-orange-500'
              />
              Remember me
            </label>
            <Link href="/forgot-password" className='text-primary hover:text-orange-600 font-medium'>
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className='w-full bg-primary text-white py-2 rounded-lg hover:bg-orange-600 transition-all text-base font-semibold mt-2 disabled:bg-orange-300 disabled:text-black'
            disabled={LoginMutation.isPending}
          >
         {LoginMutation.isPaused?'Login inn.....':'Login'}
          </button>

          
        </form>
       
      </div>
    </div>
  );
};

export default Login;
