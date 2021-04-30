const express = require('express')
const router = express.Router()
const UserSchema = require('../models/User');
const mongoose = require('mongoose');
const TokenSchema = require('../models/Token');


router.get('/', async (req,res) => {
      const users = await UserSchema.find();
      return res.json(users);
})

router.get('/:username', async (req,res) => {
   let username = req.params.username;
   const user = await UserSchema.findOne({ username: username})

   if (!user) {
      return res.status(404).json({message:"user not found"});
   }
   
   return res.json({message:"ok",user:user}); 
})

module.exports = router