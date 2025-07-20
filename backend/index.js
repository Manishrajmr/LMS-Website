require('dotenv').config();
const express = require('express');
const app = express();


app.get("/",(req,res)=>{
    res.send("Hello!");
})

const PORT = process.env.PORT || 4000;

app.listen(PORT,(req,res)=>{
    console.log(`server running on http://localhost:${PORT}`)
})