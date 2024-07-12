const express=require('express');
const accountRoute=express.Router();
const {authMiddleware}=require("../middlewares/authMiddleware");
const { Account } = require('../models/userModel');
const { default: mongoose } = require('mongoose');


accountRoute.get('/balance',authMiddleware,async (req,res)=>{
       try {
        
       const account= await Account.findOne({
        userId: req.userId
       })
       if(account){
        console.log("user account found")
        return res.status(200).json({
            balance: account.balance
           })
       }
       else{
        console.log("user account not found")
        return res.status(400).json({
            message: "account not found"
           })
       }
       } catch (error) {
        console.log(error)
        res.status(400).json({
            message:"error"
        })
       }
})


accountRoute.post('/transfer',authMiddleware, async (req,res)=>{
 
     
    try {
        const exists= await Account.find({userId:req.userId})
     console.log(exists[0].balance);
     if(!exists){
      return res.status(411).json({message:"user doesnot exist"})
     }
     if(exists[0].balance < req.body.amount){
        console.log(exists.balance)
        return res.status(411).json({message:"Insufficient balance"})
     }
     const to= await Account.find({userId:req.body.to});
     if(!to){
        return res.status(411).json({message:"Invalid account"})
       }
          
          await Account.updateOne({userId:req.userId},{$inc :{ balance: -req.body.amount}})
         await Account.updateOne({userId:req.body.to},{$inc :{ balance: req.body.amount}})
         
         res.status(200).json({message:"Transfer successfull"})
    } catch (error) {
        console.log(error)
        res.status(411).json({message:"error"})
    }
})



module.exports=accountRoute;