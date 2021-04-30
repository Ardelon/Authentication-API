const express = require('express')
const router = express.Router()
const UserSchema = require('../models/User');
const TokenSchema = require('../models/Token');
const mongoose = require('mongoose');
const hash = require('hash.js')

var jwt = require('jsonwebtoken');
require('dotenv/config')

router.post('/', async (req, res) => {
   if (!req.body.username || !req.body.username.length) {
      return res.status(400).json({ message: "username should not be empty" })
   }

   if (!req.body.password || !req.body.password.length) {
      return res.status(400).json({ message: "password should not be empty" })
   }

   const username = req.body.username;
   const password = hash.sha512().update(req.body.password + process.env.SALT).digest('hex')

   const user = await UserSchema.findOne({ username: username, password: password });
   if (!user) {
      return res.status(401).json({ message: 'username or password invalid' });
   }

   const token = new TokenSchema({
      username: req.body.username,
      token: jwt.sign({ username: username }, process.env.JWT_SECRET, { expiresIn: '1m' }),
      isValid: true,
   });
   const savedToken = await token.save();
   return res.status(200).json({ message: 'Login Successfull', token: savedToken })
})


module.exports = router