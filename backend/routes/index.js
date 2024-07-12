const express= require('express');
const userRoute=require("./user")
const router= express.Router();
const accountRoute=require('./account')


router.use('/user', userRoute);
router.use('/account',accountRoute);

module.exports= router;
