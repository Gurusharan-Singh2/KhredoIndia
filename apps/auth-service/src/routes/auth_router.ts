import express, { Request, Response, Router } from 'express'
import { getUser, loginUser, refershToken, resetUserPassword, UserforgotPassword, userRegistration, verifyForgotPassword, VerifyUser } from '../controllers/auth_controller';
import isAuthenticated from '@packages/middleware/isAuthenticated';


const router:Router=express.Router();



// registration a user
router.post("/user-registration",userRegistration);

// verify a user with otp
router.post("/verify-user", VerifyUser);
// login

router.post("/login-user",loginUser);
router.post("/refresh-token-user",refershToken);
router.get("/logged-in-user",isAuthenticated,getUser);

router.post("/forgot-password-user", UserforgotPassword );
router.post("/verify-forgot-password-otp", verifyForgotPassword );
router.post("/reset-password", resetUserPassword );


export default router;