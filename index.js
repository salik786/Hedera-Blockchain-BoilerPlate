


const express=require("express");
const https=require("https")
const port = process.env.PORT || 3000
const app=express();
const deploy=require("./controller/deployHedera")
const server = https.createServer(app)

app.listen((port),()=>{
    console.log("adasd")
})
app.use('/contract',deploy)




