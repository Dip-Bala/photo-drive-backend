import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
dotenv.config();

const app = express();
const {MONGODB_URL, JWT_SECRET, PORT} = process.env;

if(!MONGODB_URL || !JWT_SECRET || !PORT){
    console.log('Error loading .env variables');
}

async function main(){
    try{
        await mongoose.connect(MONGODB_URL as string);
        console.log("DB connected");
        await app.listen(PORT || 3000, () => {
            console.log(`App is listening on port ${PORT}`)
        });


    }
    catch(e){
        console.log("Error with DB connection")
    }
}

main()