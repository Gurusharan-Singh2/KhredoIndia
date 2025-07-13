// Register a new user
import bcrypt from "bcryptjs"
import  { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError } from 'jsonwebtoken'

import { checkOtpRestrictions, handleForgotPassword, sendOtp, trackOtpRequests, validateRegistrationData, verifyForgotPasswordOtp, verifyOtp } from "../utils/auth_helper";
import { AuthenticationError, ValidationError } from "@packages/error-handler";
import prisma from "@packages/libs/prisma";
import { setCookie } from "../utils/setCookie";


//  Register a user
export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
 try {
  

  
   validateRegistrationData(req.body, "user");
  const { name, email } = req.body;

  const existingUser = await prisma.users.findUnique({ where:{ email}});
  if(existingUser){
    return next(new ValidationError("user already exist with email"))
  }
  await checkOtpRestrictions(email);
  await trackOtpRequests(email);

  await  sendOtp(name,email);

  res.status(200).json({
    message:"OTP send to email.Please verify your account"
  })
 } catch (error) {
   return next(error)
 }
};

//  verify a user with otp

export const VerifyUser=async(req:Request,res:Response,next:NextFunction)=>{
try {
  const {email,otp,password,name}=req.body;
  if(!email || !otp || !password || !name){
    return next(new ValidationError("Missing required field"))
  }

  const existingUser = await prisma.users.findUnique({ where:{ email}});

  if(existingUser){
    return next(new ValidationError("user already exist with email"))
  }
  const isOtpValid = await verifyOtp(email, otp); // No `next` passed
if (!isOtpValid) {
  return next(new ValidationError("Invalid OTP"));
}


  const hashedPassword= await bcrypt.hash(password,10);

  await prisma.users.create({
    data:{name,email,password:hashedPassword}
  })

  res.status(201).json({
  success:true,
  message:"User registration succesfully"
  })
} catch (error) {
  return next(error);
}
}

// login 

export const loginUser=async(req:Request,res:Response,next:NextFunction)=>{
   try {
    const {email,password}=req.body;
    if(!email || !password){
      return next(new ValidationError("Email and Password not Coming !!!"));
    }
    const user= await prisma.users.findUnique({where:{email}});
    if(!user){
      return next(new AuthenticationError("User does not exist!!"));
    }

    const isMatchedPaswword=await bcrypt.compare(password,user.password!);
    if(!isMatchedPaswword){
      return next(new AuthenticationError("Password Wrong"))
    }

    const AccessToken=await jwt.sign({
      id:user.id,
      role:"user"
    },process.env.ACCESS_SECRET as string);

    const RefreshToken=await jwt.sign({
      id:user.id,
      role:"user"
    },process.env.REFRESH_SECRET as string);

     setCookie(res,"refresh_token",RefreshToken);
    setCookie(res,"access_token",AccessToken);
   
    res.status(200).json({
      message:"Login Succesfull",
      user:{id:user.id,email:user.email,name:user.name}
    })
   } catch (error) {
    return next(error)
   }
}


// refresh token user
export const refershToken=async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const refershToken=req.cookies.refresh_token;
    if(!refershToken){
      throw new ValidationError("Unauthorized! No refresh token.");

    }
    const decoded=jwt.verify(
      refershToken,process.env.REFRESH_SECRET as string
    ) as {
      id:string,
      role:string
    }

    if(!decoded || !decoded.id || !decoded.role){
      throw new JsonWebTokenError("Forbidden ! Invalid Refresh Token.")
    }

    // let account;
    // if(decoded.role==='user'||'seller')
    const user =await prisma.users.findUnique({
      where:{
        id:decoded.id,
      }
    });
    if(!user){
      throw new AuthenticationError("Forbidden ! User/Seller not found");
    }

    const newAccessToken=jwt.sign({
      id:decoded.id,role:decoded.role},
    process.env.ACCESS_SECRET as string,{
      expiresIn:"30m"
    });
    setCookie(res,"access_token",newAccessToken);
    return res.status(201).json({
      success:true
    })
    
  } catch (error) {
    return next(error)
  }
}

export const getUser=async(req:any,res:Response,next:NextFunction)=>{
  try {
    const user=req.user;
  res.status(201).json({
    success:true,
    user
  })
  } catch (error) {
  return  next(error)
  }
}

// UserforgotPaswword

export const UserforgotPassword=async(req:Request,res:Response,next:NextFunction)=>{
  await handleForgotPassword(req,res,next,"user");
}

// verify ForgotPassword Otp

export const verifyForgotPassword=async(req:Request,res:Response,next:NextFunction)=>{
  await verifyForgotPasswordOtp(req,res,next);
}


// reset UserPassword

export const resetUserPassword=async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const {email,password}=req.body;
    if(!email || !password){
      return next(new ValidationError("Email and Password not Coming !!!"));
    }
    const user=await prisma.users.findUnique({where:{email}});
    if(!user){
      return next(new AuthenticationError("User does not exist!!"));
    }
    const isSamePassword=await bcrypt.compare(password,user.password!);
    if(isSamePassword){
      return next(new ValidationError("New password cannot be same as old password"));
    }
    const hashedPassword=await bcrypt.hash(password,10);
    await prisma.users.update({where:{email},
    data:{
      password:hashedPassword
    }});

    res.status(200).json({
      message:"Password Reset Successfully"
    })
  } catch (error) {
    return next(error);
  }
}



