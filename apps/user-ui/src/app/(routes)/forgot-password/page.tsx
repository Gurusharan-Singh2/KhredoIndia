"use client";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios ,{AxiosError} from 'axios'
import {toast} from "react-hot-toast"
import { Eye, EyeOff } from "lucide-react";

interface Formdata {
   
  email: string;
  password?: string;

}

const ForgotPassword = () => {
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(["", "", "", "",""]);
  const [step,setstep] = useState("forgot");
  const [userData, setUserData] = useState<Formdata | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [passwordVisible, setpasswordVisible] = useState(false);
  const router = useRouter();

  const resendOtp = () => null;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Formdata>();


  const startResendTimer=()=>{
    const interval=setInterval(()=>{
      setTimer((prev)=>{
        if(prev<=1){
          clearInterval(interval);
          setCanResend(true);
          return 0;;
        }
       return prev-1;
      })

    },1000)
  }

  const forgotMutation=useMutation({
    mutationFn:async(data:Formdata)=>{
      const response= await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/forgot-password-user`,data);

      return response.data;
    },
    onSuccess:(_,formData)=>{
      setUserData(formData);
      setstep("verify");
      setCanResend(false);
      setTimer(60);
      startResendTimer();
    },
      onError: (err) => {
    if (err instanceof AxiosError) {
      toast.error(err.response?.data?.message || err.message);
    }
  },
  })
  const resetPasswordMutation=useMutation({
    mutationFn:async(data:Formdata)=>{
      const response= await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/reset-password`,data);

      return response.data;
    },
    onSuccess:(_,formData)=>{
      toast.success("Password is reseted .")
      router.push('/login')
    },
      onError: (err) => {
    if (err instanceof AxiosError) {
      toast.error(err.response?.data?.message || err.message);
    }
  },
  })


  const verifyOtpMutation=useMutation({
    mutationFn:async()=>{
      if (!userData) return;
      const response=await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-forgot-password-otp`,{
       ...userData
        ,otp:otp.join("")
      })
      return response.data;
    },
    onSuccess:()=>{

    setstep("reset");
    toast.success("Otp verification is completed now set New Password")
    },
    onError: (err) => {
    if (err instanceof AxiosError) {
      toast.error(err.response?.data?.message || err.message);
    }
  },
  })

  const OnSubmit = (data: Formdata) => {
    forgotMutation.mutate(data);
    
  };
  const OnResestPasswordhandler = (data: Formdata) => {
    resetPasswordMutation.mutate(data);
    
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#f7f8fcb2] to-[#eef1f6] flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
          Forgot Password
        </h3>
        <p className="text-center text-gray-500 mb-5 text-sm sm:text-base">
          Go back to ?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:text-orange-600 transition-colors"
          >
            Login
          </Link>
        </p>

{ step=="forgot" && (
   <form
            onSubmit={handleSubmit(OnSubmit)}
            className="flex flex-col gap-4"
          >
        
            {/* Email Field */}
            <div>
              <label className="text-gray-700 text-sm font-medium block mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.email.message}
                </span>
              )}
            </div>

         

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-orange-600 transition-all text-base font-semibold mt-2 disabled:bg-orange-100 disabled:text-gray-500 "
              disabled={forgotMutation.isPending}
            >
             {forgotMutation.isPending?"Forgotting ...":"Forgot Password"}
            </button>
          </form>
)}
    

{step=="verify" && (
    <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold text-center mb-1">
              Enter OTP
            </h3>
            <p className="text-center text-gray-500 mb-4 text-sm">
              We’ve sent a 4-digit code to your email.
            </p>

            <div className="flex justify-center gap-4 sm:gap-6 mb-4">
              {otp.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={value}
                  ref={(el) => {
                    if (el) inputRefs.current[index] = el;
                  }}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!/^\d$/.test(val)) return;

                    const updatedOtp = [...otp];
                    updatedOtp[index] = val;
                    setOtp(updatedOtp);

                    if (index < 4) {
                      inputRefs.current[index + 1]?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace") {
                      const updatedOtp = [...otp];
                      if (otp[index]) {
                        // If current has value, clear it
                        updatedOtp[index] = "";
                        setOtp(updatedOtp);
                      } else if (index > 0) {
                        // If empty, move focus back and clear previous
                        updatedOtp[index - 1] = "";
                        setOtp(updatedOtp);
                        inputRefs.current[index - 1]?.focus();
                      }
                    }
                  }}
                  className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ))}
            </div>
            <button className="w-full mt-4 text-lg cursor-pointer bg-primary text-white py-2 rounded-lg " disabled={verifyOtpMutation.isPending} onClick={()=>verifyOtpMutation.mutate()}>
              {verifyOtpMutation.isPending?'OTP verifying....':'Verify OTP'}
            </button>
            <button
              className="text-sm text-primary font-medium hover:text-orange-600 transition disabled:text-gray-600"
              disabled={!canResend}
              onClick={() => {
                resendOtp();
                setCanResend(false);
                setTimer(60);
                // trigger resend logic here
              }}
            >
              {canResend ? "Resend OTP" : `Resend OTP in ${timer}s`}
            </button>
            {
              verifyOtpMutation?.isError && verifyOtpMutation.error instanceof AxiosError && (
                <p className="text-red-500 text-sm mt-2">
                  {
                    verifyOtpMutation.error.response?.data?.message || verifyOtpMutation.
                    error.message
                  }
                </p>
               )
            }
          </div>
)}
{step=="reset" && (
      <form
            onSubmit={handleSubmit(OnResestPasswordhandler)}
            className="flex flex-col gap-4"
          >
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

         

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-orange-600 transition-all text-base font-semibold mt-2 disabled:bg-orange-100 disabled:text-gray-500 "
              disabled={resetPasswordMutation.isPending}
            >
             {resetPasswordMutation.isPending?"Reseting ...":"Reset Password"}
            </button>
          </form>
)}
      </div>
    </div>
  );
};

export default ForgotPassword;
