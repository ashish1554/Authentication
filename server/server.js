// // import cookieParser from "cookie-parser";
// // import cors from "cors";
// // import 'dotenv/config';
// // import express from "express";
// // import connectDB from "./config/mongodb.js";
// // import authRouter from './routes/authRoutes.js';
// // import userRouter from "./routes/userRoute.js";

// // const app=express();
// // const port=process.env.PORT || 4000;
// // connectDB();

// // app.use(express.json());
// // app.use(cookieParser());
// // // app.use(cors({credentials:true}));
// // // app.use(cors({
// // //   origin: 'http://localhost:5173', // or wherever your frontend is hosted
// // //   credentials: true
// // // }));

// // const allowedOrigins = [
// //   'http://localhost:5173',
// //   'https://mern-authentication-frontend-da9s.onrender.com/' // Replace with your actual Render frontend URL
// // ];

// // app.use(cors({
// //   origin: allowedOrigins,
// //   credentials: true
// // }));



// // //api end points
// // app.get('/',(req,res)=>res.send("Hello! API IS RUNNING "))
// // app.use('/api/auth',authRouter) //auth vala ma route ni aagl aa lagase
// // app.use('/api/user',userRouter) 

// // app.listen(port,()=>console.log(`Server started on Port : ${port}`));


// import cookieParser from "cookie-parser";
// import cors from "cors";
// import 'dotenv/config';
// import express from "express";
// import connectDB from "./config/mongodb.js";
// import authRouter from './routes/authRoutes.js';
// import userRouter from "./routes/userRoute.js";

// const app = express();
// const port = process.env.PORT || 4000;
// connectDB();

// <<<<<<< HEAD
// // ✅ CORS config
// const allowedOrigins = [
//   'http://localhost:5173',
//   'https://mern-authentication-frontend-da9s.onrender.com'
// =======
// app.use(express.json());
// app.use(cookieParser());
// // app.use(cors({credentials:true}));
// // app.use(cors({
// //   origin: 'http://localhost:5173', // or wherever your frontend is hosted
// //   credentials: true
// // }));



// >>>>>>> 0dafeff784b78e12b8b482b527a4649746a2e951
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true
// }));

// app.use(express.json());
// app.use(cookieParser());

// // ✅ API routes
// app.get('/', (req, res) => res.send("Hello! API IS RUNNING"));
// app.use('/api/auth', authRouter);
// app.use('/api/user', userRouter);

// app.listen(port, () => console.log(`Server started on Port: ${port}`));

import cookieParser from "cookie-parser";
import cors from "cors";
import 'dotenv/config';
import express from "express";
import connectDB from "./config/mongodb.js";
import authRouter from './routes/authRoutes.js';
import userRouter from "./routes/userRoute.js";

const app = express();
const port = process.env.PORT || 4000;
connectDB();

// ✅ Correct CORS config
const allowedOrigins = [
  'http://localhost:5173',
  'https://mern-authentication-frontend-da9s.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.get('/', (req, res) => res.send("Hello! API IS RUNNING"));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(port, () => console.log(`Server started on Port: ${port}`));
