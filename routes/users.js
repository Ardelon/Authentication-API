const express = require('express')
const router = express.Router()
const UserSchema = require('../models/User');
const mongoose = require('mongoose');
const TokenSchema = require('../models/Token');


router.get('/', async (req,res) => {
   try {
      const users = await UserSchema.find();
      return res.json(users);
   } catch (err) {
      return res.json({ message: err });
   }
})

router.get('/:username', async (req,res) => {
   let token = req.headers.token;
   let username = req.params.username;
   const tokenRecord = await TokenSchema.find({token:token, username:username, isValid:true})

   if (tokenRecord.length) {
      tokenRecord[0].username
      return res.json({message:tokenRecord[0].username});
      
   }
   
   return res.json({message:"There is no such user"}); 
})

module.exports = router