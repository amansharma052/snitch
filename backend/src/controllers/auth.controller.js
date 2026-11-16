import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken"
import { config } from "../config/config.js";

export const register = async (req, res) => {
    const { email, contact, password, fullname } = req.body;

    try {
        const existingUser = await userModel.findOne({
            $or: [
                { email },
                { contact }
            ]
        })
        if (existingUser) {
            return res.status(400).json({
                message: "user is already exists with this email or contact no"
            })
        }
        const user = await userModel.create({
            email,
            contact,
            password,
            fullname

        })
        return res.status(201).json({
            message: "user created successfully",
            user: {
                email,
                contact,
                fullname
            }
        })

    } catch (error) {
        console.log(error)
    }
}