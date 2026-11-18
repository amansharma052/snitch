import express from "express"
import { authenticateSeller } from "../middlewares/auth.middlewares.js"
import multer from "multer"
import { createProduct } from "../controllers/product.controller.js"


const upload =multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:5*1024*1024
    }
})
const router =express.Router()


router.post("/",authenticateSeller,upload.array("images",7),createProduct)


export default router