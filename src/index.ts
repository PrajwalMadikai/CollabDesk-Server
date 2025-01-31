import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { connectDB } from './database/connection'
import adminRoute from './presentation/routes/adminRoute'
import userRoute from './presentation/routes/userRoute'
import workspaceRoute from './presentation/routes/workspaceRoute'
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
app.use('/workspace',workspaceRoute)
app.use('/admin',adminRoute)


app.listen(PORT,()=>console.log(`Running on http://localhost:${PORT}`))