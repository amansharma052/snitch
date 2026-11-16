import dotenv from "dotenv"
dotenv.config()

if(!process.env.MONGO_URI){
    throw new Error("Mongo uri is not found in environment variable")
}

export const config={
    MONGO_URI:process.env.MONGO_URI
}