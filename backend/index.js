const express = require("express");
const mongoose= require("mongoose");
const app= express();
const User = require("./models/userModel")
const router= require("./routes/index")
const cors= require('cors');
const jwt= require("jsonwebtoken")
app.use(cors({
    origin:'http://localhost:5173',
    
}
));
app.use(express.json());
require('dotenv').config();


 mongoose.connect("mongodb://localhost:27017/paytm");
 const connection=mongoose.connection;
connection.on("connected", ()=> {
    console.log('Mongodb is connected');
})
connection.on("disconnected", ()=> {
    console.log('Mongodb is disconnected');
})

connection.on("error", ()=> {
    console.log('error');
})

app.get('/', (req,res)=> {
    console.log("hello world")
})
app.use('/api/v1',router);

app.listen(3000);


