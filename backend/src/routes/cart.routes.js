import express from "express"
import {authenticateUser} from "../middlewares/auth.middleware.js"
import { validateAddToCart,validateIncrementCartItemQuantity } from "../validator/cart.validator.js"
import { addToCart,getCart,incrementCartItemQuantity,createOrderController } from "../controllers/cart.controller.js"


const router =express.Router()

router.post("/add/:productId/:variantId",validateAddToCart,authenticateUser,addToCart)

router.get('/', authenticateUser, getCart)

router.patch("/quantity/increment/:productId/:variantId", authenticateUser, validateIncrementCartItemQuantity, incrementCartItemQuantity)

router.post("/payment/create/order", authenticateUser, createOrderController)


export default router