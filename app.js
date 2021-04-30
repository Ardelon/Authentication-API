const express = require("express")
const app = express()
const mongoose = require('mongoose');
const router = express.Router()
require('dotenv/config')
const loginPage = require('./routes/login')
const registerPage = require('./routes/register')
const usersPage = require('./routes/users')
const logoutPage = require('./routes/logout')
const bodyParser = require("body-parser");
const { use } = require("./routes/login");
const TokenSchema = require('./models/Token');
const jwt = require("jsonwebtoken");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

const port = 3333;

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected to Database")
}).catch(err => {
    console.log(err)
});



app.use('/', router)
app.use('/register', registerPage)
app.use('/login', loginPage)

app.use("*", async (req, res, next) => {
    let token = req.headers.token;

    if (!token) {
        return res.status(401).json({ message: 'Token not found' });
    }
    let decoded = ""
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'token expired' });
        }
    }
    if (!decoded) {
        await TokenSchema.updateOne({ token: token }, { $set: { isValid: false } })
        return res.status(401).json({ message: 'token not valid' });
    }
    console.log(decoded)
    let username =decoded.username;

    let tokenRecord = await TokenSchema.find({ username: username, token: token, isValid: true })
    if (tokenRecord.length < 1) {
        return res.status(401).json({ message: 'token not valid' });
    }

    req.username = username;
    return next();
})

app.use('/users', usersPage)
app.use('/logout', logoutPage)



app.listen(port, "0.0.0.0", () => {
    console.log("I am listening", port)
})


























//#region 

// const express = require("express")
// const app = express()
// const router = express.Router()
// const port = 3000
// const loginPage = require('./routes/login')
// const mongoose = require('mongoose');


// mongoose.connect('mongodb+srv://Ardelon:4KR4yLqQziLHhJu@cluster0.mt9aa.mongodb.net/sample_geospatial', {useNewUrlParser: true, useUnifiedTopology: true});
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   // we're connected!
// });


// router.use((req,res,next) => {
//     console.log('Time:', Date.now())
// })

// var requestTime = function (req, res, next) {
//     req.requestTime = Date.now()
//     next()
//   }

// const myLogger = function (req, res, next) {
//     console.log('LOGGED')
//     next()
// }


// app.use(myLogger)
// app.use(requestTime)


// app.get('/', (req,res) => {
//     res.send('Hello World!')

// })

// app.use('/', router)
// app.use('/login', loginPage)
// app.listen(port, () => {
//     console.log('Example of Express')
// })

//#endregion