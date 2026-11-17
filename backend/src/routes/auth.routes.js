import { Router } from "express"
import { validateLoginUser, validateRegisterUser } from "../validator/auth.validator.js"
import { login, register } from "../controllers/auth.controller.js"
import passport from "passport";
import { config } from "../config/config.js";
const authRouter = Router()

authRouter.post("/register", validateRegisterUser, register)

authRouter.post("/login", validateLoginUser, login)

// /api/auth/google
authRouter.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"] }))

authRouter.get("/google/callback",
    passport.authenticate("google", {
        session: false,
        "http://localhost:5173/login": "/login"
    }),

)


export default authRouter