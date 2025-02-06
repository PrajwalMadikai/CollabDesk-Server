import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './database/connection';
import { errorHandler } from './presentation/middleware/errorHandler';
import adminRoute from './presentation/routes/adminRoute';
import userRoute from './presentation/routes/userRoute';
import workspaceRoute from './presentation/routes/workspaceRoute';
dotenv.config() 

const app=express()
const PORT= process.env.PORT || 5713

connectDB();

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie']
}));

app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');   
  next();
});

app.use(errorHandler)

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use('/',userRoute)
app.use('/workspace',workspaceRoute)
app.use('/admin',adminRoute)


app.listen(PORT,()=>console.log(`Running on http://localhost:${PORT}`))