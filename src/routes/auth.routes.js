import { Router } from "express";
import { login,register,profile,verifyEmail, forgetPassword,verifyPassword,newPassword} from "../controllers/auth.controllers.js";
import { verifyToken } from "../middlewares/verifyToken.js";
const router = Router()

router.post('/login',login)
router.post('/register',register)
router.get('/verify/:token',verifyEmail)
router.post('/forget-password',forgetPassword)
router.get('/forget-password/:token',verifyPassword)
router.post('/forget-password/:token',newPassword)



router.get('/profile',verifyToken,profile)


export default router