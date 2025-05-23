import crypto from "crypto"
import { NextFunction } from "express";
import { __await } from "tslib";
import { sendEmail } from "./Email";
import { ValidationError } from "@packages/error-handler";
import redis from "@packages/libs/redis";



const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


export const validateRegistrationData=(data:any , userType:"user"| "seller")=>{
  const {name,email,password,phone,country}=data;

if(!name || !email || !password || ((userType === "seller") && (!phone || !country)))
{
    throw new ValidationError("Missing required field");
  }
  if(!emailRegex.test(email)){
    throw new ValidationError("Invalid Email Format!")
  }
}

export const checkOtpRestrictions=async(email:string,next:NextFunction)=>{
  if(await redis.get(`otp_lock:${email}`)){
    return next(
      new ValidationError("Account locked due to multiple failed attemps! Try again after 30 minutes")
    )
  }
  if(await redis.get(`otp_spam_lock:${email}`)){
    return next(
      new ValidationError("Too many OTP requests! Please wait 1 hour before requesting again.")
    )
  }

  if(await redis.get(`otp_cooldown:${email}`)){
    return next(
      new ValidationError("Please wait 1 minute before requesting new Otp!")
    )
  }

}

export const sendOtp=async(name:string,email:string,)=>{

  const otp=crypto.randomInt(10000,99999).toString();

  await redis.set(`otp:${email}`,otp,"EX",300);

  const message = generateEmailTemplate(otp,name);
  await sendEmail({ email, subject: "Verify Your Email", message });
  await redis.set(`otp_cooldown:${email}`,"true","EX",60);
  // await redis.set(`otp_cooldown:${email}`,"true","EX",60);

}

export const generateEmailTemplate = (otp: string, name: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your KhreedoIndia OTP</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 12px;
      padding: 40px 30px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
    }
    .header h1 {
      color: #e91e63;
      font-size: 28px;
      margin-bottom: 0;
    }
    .greeting {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .message {
      font-size: 15px;
      line-height: 1.6;
    }
    .otp-box {
      background: #e91e63;
      color: #ffffff;
      font-size: 26px;
      font-weight: bold;
      padding: 18px 0;
      text-align: center;
      border-radius: 10px;
      letter-spacing: 6px;
      margin: 30px 0;
      box-shadow: 0 4px 12px rgba(233, 30, 99, 0.4);
    }
    .footer {
      font-size: 12px;
      color: #999;
      text-align: center;
      margin-top: 40px;
      border-top: 1px solid #eee;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>KhreedoIndia</h1>
    </div>
    <p class="greeting">Dear ${name},</p>
    <p class="message">
      Thank you for choosing <strong>KhreedoIndia</strong>. To continue, please use the OTP below to verify your email address. This ensures your account's security.
    </p>
    <div class="otp-box">${otp}</div>
    <p class="message">
      This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone for security reasons.
    </p>
    <p class="message">
      If you did not request this OTP, you can safely ignore this email.
    </p>
    <div class="footer">
      &copy; ${new Date().getFullYear()} KhreedoIndia. All rights reserved.
    </div>
  </div>
</body>
</html>
`;



export const trackOtpRequests=async(email:string, next:NextFunction)=>{
  const otpRequestKey=`otp_request_count:${email}`
  let otpRequest=parseInt((await redis.get(otpRequestKey))|| "0");
  if(otpRequest>=2){
    await redis.set(`otp_spam_lock:${email}`,"locked","EX",3600); // for 1 hour
    return next(new ValidationError("To many otp request .Please wait 1 hour before requesting otp"))

  }

  await redis.set(otpRequestKey,otpRequest+1,"EX",3600);



}