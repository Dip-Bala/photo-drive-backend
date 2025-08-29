import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRouter from './routes/auth';
import cookieParser from 'cookie-parser'
import folderRouter from './routes/folder';
import imageRouter from './routes/image';
dotenv.config();

const app = express();
const {MONGODB_URL, JWT_SECRET, PORT, FRONTEND_URL} = process.env;

if(!MONGODB_URL || !JWT_SECRET || !PORT){
    console.log('Error loading .env variables');
}
app.use(cors({
  origin: FRONTEND_URL, 
  credentials: true,               
}));

app.use(cookieParser());
app.use(express.json())
app.use('/api/auth', authRouter);
app.use('/api/images', imageRouter);
app.use('/api/folders', folderRouter);

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