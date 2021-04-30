const express = require('express')
const router = express.Router()
const UserSchema = require('../models/User');
const mongoose = require('mongoose');
const TokenSchema = require('../models/Token');



router.post('/', async (req, res) => {
    let token = req.headers.token;
    const logoutUser = await TokenSchema.updateOne(
        { token: token },
        { $set: { isValid: false } }
    );
    return res.json({ message: "Logout complete" })
})

module.exports = router