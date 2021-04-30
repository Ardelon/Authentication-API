const mongoose = require('mongoose');

const TokenSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    isValid: {
        type: Boolean,
        required: true
    },
    expireAt: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Tokens', TokenSchema);