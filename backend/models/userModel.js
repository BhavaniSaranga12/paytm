const mongoose= require('mongoose');

const userSchema= mongoose.Schema({
  email : {
    type: String,
    required: true,
    unique: true
  },
  firstName : {
    type: String,
    required: true
  },
  lastName : {
    type: String,
    required: true
  },
  password : {
    type: String,
    required: true
  }
})



const accountSchema=mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  balance:{
    type: Number,
    required:true
  }
})

const User= mongoose.model('User', userSchema);
const Account=mongoose.model('Account',accountSchema);



module.exports={User,Account};