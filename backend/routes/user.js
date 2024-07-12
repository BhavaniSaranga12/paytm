const express= require('express');
const zod=require("zod");
const {User,Account}=require('../models/userModel');
const userRoute= express.Router();
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken')
require('dotenv').config();
const {authMiddleware}=require('../middlewares/authMiddleware')



const signupBody = zod.object({
    email: zod.string().email(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
})

const signinBody = zod.object({
    email: zod.string().email(),
	password: zod.string()
})

userRoute.post('/signup', async (req,res)=>{
   const {success}=signupBody.safeParse(req.body);
   
   if(!success){
    return res.status(411).json({message: "Incorrect Inputs"})
   }

   const user=await User.findOne({email:req.body.email});
   if(user){
    return res.status(411).json({message: "User already exists"})
   }

   const hashedpassword= await bcrypt.hash(req.body.password,10)

   const newUser= await User.create({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName:req.body.lastName,
    password:hashedpassword
   })

   const userId= newUser._id;

   await Account.create({
    userId,
    balance:Math.floor(Math.random()*1000)+1
   })
  
   const token=jwt.sign({userId},process.env.JWT_SECRET)
   res.status(200).json({
    message:"User created successfully",
    token:token
   })

})

userRoute.post('/signin', async (req,res)=>{
  const {success}= signinBody.safeParse(req.body);
  if(!success){
    return res.status(411).json({message:"Incorrect Inputs"});

  }
  const user= await User.findOne({email:req.body.email});
  if(!user){
    return res.status(411).json({message:"user doesnot exists"})
  }

  try {
    const hashedpassword=bcrypt.compare(req.body.password,user.password);
    if(hashedpassword){
        const payload={
            userId:user._id
        }
      const token= jwt.sign(payload,process.env.JWT_SECRET);
      return res.status(200).json({
        message:"Signin successfull",
        token:token
      })
    }
    else {
        return res.status(411).json({message:"Incorrect password"})
    }
  
  } catch (error) {
    res.status(411).json({
        message: "Error while logging in"    })
  }
})

const updateBody = zod.object({
   
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
})

userRoute.post('/',authMiddleware, async(req,res)=>{
  const {success}= updateBody.safeParse(req.body);
  if(!success){
    res.status(411).json({
            message: "Error while updating information" })
  }
    await User.updateOne({_id:req.userId},req.body);
    res.json({
        message: "Updated successfully"
    })

})


userRoute.post('/validate',authMiddleware, async(req,res)=>{
  
   
    res.status(200).json({})

})


userRoute.get("/bulk", authMiddleware ,async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find(
    {
      $and: [
          {
              $or: [
                  { firstName: { "$regex": filter, "$options": 'i' } },
                  { lastName: { "$regex": filter, "$options": 'i' } }
              ]
          },
          {
              _id: { $ne: req.userId }
          }
      ]
  }
  )

  res.json({
      user: users.map(user => ({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          _id: user._id
      }))
  })
})

module.exports= userRoute;