const express = require('express')
const router = express.Router()
const hash = require('hash.js')
require('dotenv/config')
const axios = require('axios');
const UserSchema = require('../models/User');

router.post("/", async (req, res, next) => {


    if (!req.body.username || req.body.username.length < 5) {
        return res.status(400).json({ message: 'username length should be greater than 5' })
    }

    if (!req.body.password || req.body.password.length < 5) {
        return res.status(400).json({ message: 'password length should be greater than 5' })
    }

    if (!req.body.mail) {
        return res.status(400).json({ message: 'mail address is required'});
    }

   let isDeliverable, isValid;
    axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.MAIL_VERIFICATION_API_KEY}&email=${req.body.mail}`)
        .then(response => {
           const {deliverability, is_valid_format: {value}} = response.data;
           deliverability === "DELIVERABLE" ? isDeliverable = true : isdeliverable = false;
           isValid = value
           
        })
        .catch(error => {
            console.log(error);
        });
  
        if (isDeliverable || isValid) {
            return res.status(400).json({message:"mail address is not valid"});
        }


    const userToCreate = new UserSchema({
        username: req.body.username,
        password: hash.sha512().update(req.body.password + process.env.SALT).digest('hex'),
        mail: req.body.mail
    });

    
    const dbUsername = await UserSchema.find({ username: userToCreate.username });
    if (dbUsername.length > 0) {
        return res.status(409).json({ message: 'user with same username already exists ' }).send();
    }

    const dbMail = await UserSchema.find({ mail: userToCreate.mail });
    if (dbMail.length > 0) {
        return res.status(409).json({ message: 'This mail address is already registered '}).send();
    }

    await userToCreate.save();

    return res.status(200).json({ message: 'success' }).send();

});

module.exports = router