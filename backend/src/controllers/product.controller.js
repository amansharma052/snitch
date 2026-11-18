import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export async function createProduct(req, res) {
    const { title, description, price } = req.body;
    const seller = req.user;

    const images = await Promise.all(req.files.map(async (file) => {
        return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname
        })
    }))

    const product = await productModel.create({
        title,
        description,
        price,
        images,
        seller:seller._id

    })

    res.status(201).json({
        message:"product created successfully",
        success:true,
        product
    })

}

export async function getSellerProducts(req ,res){
    const seller =req.user

    const products =await productModel.find({
        seller:seller._id
    })
    res.status(200).json({
        message:"products fetched susscessfull",
        success:true,
        products
    })
}