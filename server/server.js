import cookieParser from "cookie-parser";
import cors from "cors";
import 'dotenv/config';
import express from "express";
import connectDB from "./config/mongodb.js";
import authRouter from './routes/authRoutes.js';
import userRouter from "./routes/userRoute.js";

const app=express();
const port=process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'https://authentication-seven-lake.vercel.app'],
  credentials: true
}));






//api end points
app.get('/',(req,res)=>res.send("Hello! API IS RUNNING "))
app.use('/api/auth',authRouter) //auth vala ma route ni aagl aa lagase
app.use('/api/user',userRouter) 

app.listen(port,()=>console.log(`Server started on Port : ${port}`));

