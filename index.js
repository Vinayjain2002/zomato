import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './database/connection.js';

dotenv.config();

const app= express();
const port= process.env.PORT || 4000;

app.use(express.json())
app.use(cors())

app.get('/', (req,res)=>{
    res.status(200).send('Zomato Clone by @Vinay jain')
})

connectDB();

app.listen(port,()=>{
    console.log(`Server started on http://localhost:${port}`)
});