const express = require('express')
const router = express.Router()
const hash = require('hash.js')

require('dotenv/config')
const UserSchema = require('../models/User');

router.post("/", async (req, res) => {


    if (!req.body.username || req.body.username.length < 5) {
        return res.status(400).json({ message: 'username length should be greater than 5' })
    }

    if (!req.body.password || req.body.password.length < 5) {
        return res.status(400).json({ message: 'password length should be greater than 5' })
    }

    const userToCreate = new UserSchema({
        username: req.body.username,
        password: hash.sha512().update(req.body.password + process.env.SALT).digest('hex')
    });

    
    const user = await UserSchema.find({ username: userToCreate.username });
    if (user.length > 0) {
        return res.status(409).json({ message: 'user with same username already exists ' + userToCreate.username }).send();
    }

    await userToCreate.save();

    return res.status(200).json({ message: 'success' }).send();

});

module.exports = router