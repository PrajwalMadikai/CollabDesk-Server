import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { connectDB } from './database/connection'
import userRoute from './presentation/routes/userRoute'
dotenv.config() 

const app=express()
const PORT= process.env.PORT || 5713

connectDB();
app.use(cors({
  origin: 'http://localhost:3000',  
  methods: 'GET, POST,PUT,PATCH,DELETE',
  credentials: true,
}));
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');   
  next();
});
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/',userRoute)


app.listen(PORT,()=>console.log(`Running on http://localhost:${PORT}`))