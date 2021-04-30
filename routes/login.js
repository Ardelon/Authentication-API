const express = require('express')
const router = express.Router()
const UserSchema = require('../models/User');
const TokenSchema = require('../models/Token');
const mongoose = require('mongoose');
const hash = require('hash.js')

var jwt = require('jsonwebtoken');
require('dotenv/config')

router.post('/', async (req,res) => {
   const username = req.body.username;
   const password = hash.sha512().update(req.body.password + process.env.SALT).digest('hex')
   

   const user = await UserSchema.find({username:username , password:password});
   
   if (user.length == 0) {
      return res.status(404).json({ message: 'user not found' });
   }

   const token = new TokenSchema({
      username: req.body.username,
      token: jwt.sign({ foo: 'bar' }, 'shhhhh'),
      isValid: true,
      expireAt: Date.now() + 86400  
   });
   try {
      const savedToken = await token.save();
      return res.status(200).json({ message: 'Login Successfull', token: savedToken  })
   }catch (err) {
      return res.status(400)
   }



})


module.exports = router