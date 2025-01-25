import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { connectDB } from './database/connection'
import userRoute from './presentation/routes/userRoute'
dotenv.config() 

const app=express()
const PORT= process.env.PORT || 5713

connectDB();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/',userRoute)


app.listen(PORT,()=>console.log(`Running on http://localhost:${PORT}`))