import { Router } from "express"
import { validateLoginUser,validateRegisterUser } from "../validator/auth.validator.js"
import { login, register } from "../controllers/auth.controller.js"
const authRouter =Router()

authRouter.post("/register",validateRegisterUser,register)

authRouter.post("/login",validateLoginUser,login)


export default authRouter