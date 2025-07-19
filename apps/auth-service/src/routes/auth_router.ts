import express, { Request, Response, Router } from 'express'
import { getUser, loginUser, refershToken, registerSeller, resetUserPassword, UserforgotPassword, userRegistration, verifyForgotPassword, verifySellerOtp, VerifyUser } from '../controllers/auth_controller';
import isAuthenticated from '@packages/middleware/isAuthenticated';


const router:Router=express.Router();




router.post("/user-registration",userRegistration);
router.post("/verify-user", VerifyUser);
router.post("/login-user",loginUser);
router.post("/refresh-token-user",refershToken);
router.get("/logged-in-user",isAuthenticated,getUser);
router.post("/forgot-password-user", UserforgotPassword );
router.post("/verify-forgot-password-otp", verifyForgotPassword );
router.post("/reset-password", resetUserPassword );

// seller
router.post("/seller-registration",registerSeller);
router.post("/verify-seller",verifySellerOtp);


export default router;