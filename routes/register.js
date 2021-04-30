const express = require('express')
const router = express.Router()
const hash = require('hash.js')

require('dotenv/config')
const UserSchema = require('../models/User');

router.post("/", async (req, res) => {
    const userToCreate = new UserSchema({
        username: req.body.username,
        password: hash.sha512().update(req.body.password + process.env.SALT).digest('hex')
    });

    if (!userToCreate.username.length || userToCreate.username.length < 5) {
        return res.status(400).json({ message: 'username length should be greater than 5' })
    }

    const user = await UserSchema.find({username:userToCreate.username});
        if (user.length > 0) {
            return res.status(409).json({ message: 'user with same username already exists ' + userToCreate.username }).send();
        }
 
    try {
        await userToCreate.save();
       
        return res.status(200).json({ message: 'success' }).send();
  
    }catch (err) {
        return res.json({ message: err})
    }
    
});

module.exports = router