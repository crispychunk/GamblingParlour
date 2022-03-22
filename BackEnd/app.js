/*
 Imports all required dependencies are imported here
 */
// SUP
//Framework
import Express from "express";
import Cors from "cors"
import MethodOverride from "method-override"

import info from "./info.js";

//Login
import Passport from "passport";
import Encrypt from "bcrypt"
//Database
import Mongoose from "mongoose"
import User from "./Database_Models/user.js"
import TickerList from "./Database_Models/tickerList.js"

import DotEnv from 'dotenv'
import userManagement from "./userManagement.js";
import tickerManagement from "./tickerManagement.js";

//---------------------------------------------------------------------------------
// Setup

// Read environmental configs
DotEnv.config()
// Instantiate server
const app = Express();
// Allow methods to be overwritten
app.use(MethodOverride('_method'))
//Make it so we can access 'req' variables
app.use(Express.urlencoded({ extended: false }))
const dbURL = process.env.API_KEY
Mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(console.log("connection successful"))
  .catch((err) => console.log(err))
// Declaring variables 
const PORT = 5000;
app.use(Cors({
  origin: "http://localhost:3000",
  credentials: true
}))

userManagement(app)
tickerManagement(app,checkAuthenticated)
//---------------------------------------------------------------------------------
//Old Endpoints (Deprecated)

app.set('view-engine', 'ejs');
app.use(Express.static("public")) //Directory folder to locate html + css files

// GET method route for test
app.get('/api/test', (req, res) => res.json(info))

// GET method route for landing page, load index.js
app.get("/", (req, res) => { // What does .get("/") mean? req = input, res = output
  res.render('index.ejs');
  //res.json(info);
})

// GET method route for login
app.get("/login", (req, res) => {
  console.log("Failed to authenticate user")
  res.send({ error: true, message: 'Authentication Failed' })
})

// POST method route for login lets frontend know if login is successful
app.post("/login", Passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}
), (req, res) => {
  res.send({ error: false, message: 'Success' })
}
)

// GET method route for home
// Displays userinfo
// This is used to test implementations
app.get("/home", checkAuthenticated, (req, res) => {
  res.render('home.ejs', {
    name: req.user.username,
    password: req.user.password,
    id: req.user._id
  })
  app.post("/")
})

// POST method route for register
// create user and add to local database, no persistance
// This is used to test implementations
app.post('/register', async (req, res) => {
  console.log(req.body.username)
  try {

    const hashedPassword = await Encrypt.hash(req.body.password, 10)
    console.log("Not blowing up")
    users.push({
      id: Date.now().toString(),
      username: req.body.username,
      password: hashedPassword
    })
    res.redirect('/login')
    console.log("User Created")
    console.log(users)
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
      balance: 5000
    })
    newUser.save()
  }
  catch (e) {
    console.log(e)
    res.redirect('/register')
  }
})


// Authentication methods for local
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {

    return next();
  }
  res.send({ error: false, message: 'Success' })
}

// Ticker tester
app.get("/test_tickers", (req, res) => {
  res.render('home.ejs')
  console.log(currDay)
})
//---------------------------------------------------------------------------------
//Frontend register APi endpoints

//Get method to get user information for frontend. Sends username, balance, and all types of transactions
app.get("/get_user_info", checkAuthenticated, async (req, res) => {
  await User.findOne({ password: req.user.password }).where('userInfo').then(async (user) => {
    res.send({
      username: req.user.username,
      balance: user.balance,
      id: user._id,
      liveTransactions: user.liveTransactions,
      oldTransactions: user.transactions
    })
  })
})

/// ORDER SUMISSION remove async later
app.post("/order_submit", checkAuthenticated, async (req, res) => {
  const data = req.body
  console.log(data)
  await User.findById(data.account).where('userinfos').then(async (user) => {
    user.balance = user.balance - data.amount;
    await TickerList.findById(data.ticker).where('opentickers').then((ticker) => {
      if (data.type == undefined) {
        console.log("failed")
        User.findById(data.account).where('userinfos').then((user) => {
          user.balance = user.balance + data.amount;
          user.save()
        })
        return
      }

      ticker.poolTotal = ticker.poolTotal + parseInt(data.amount)
      if (data.type == "UP") {
        ticker.totalLong = ticker.totalLong + parseInt(data.amount)
      }
      else {
        ticker.totalShort = ticker.totalShort + parseInt(data.amount)
      }

      const newTransaction = {
        transactionID: (Date.now().valueOf().toString() + data.account),
        userID: data.account,
        amount: data.amount,
        type: data.type,
        tickerName: data.ticker.name + " " + data.ticker.date,
        tickerID: data.ticker._id
      }


      ticker.transactions.push(newTransaction)
      user.liveTransactions.push(newTransaction)
      ticker.save((err) => {
        if (err) {
          console.log(err)
          console.error("Fail to save ticker")

        }
      })
    })
    user.save((err) => {
      if (err) {
        console.error("Fail to save user")
      }
      console.log("USER SAVED!!!")
    })

    res.send({ error: false, message: 'Success' })
  })
})

// Handle cancel request for open orders
app.post('/cancel_openOrder', checkAuthenticated, (req, res) => {
  const data = req.body
  TickerList.where('opentickers').updateOne(
    { _id: data.transac.tickerID },
    { $pull: { transactions: { transactionID: data.transac.transactionID } } },
    function (err, val) {
    }
  )
  TickerList.findById(data.transac.tickerID).where('opentickers')
    .then((ticker) => {
      ticker.poolTotal = ticker.poolTotal - parseInt(data.transac.amount)
      if (data.transac.type == "UP") {
        ticker.totalLong = ticker.totalLong - parseInt(data.transac.amount)
      }
      else {
        ticker.totalShort = ticker.totalLong - parseInt(data.transac.amount)
      }
      ticker.save()
        .then(
          User.where('userInfo').updateOne(
            { password: req.user.password },
            { $pull: { liveTransactions: { transactionID: data.transac.transactionID } } },
            function (err, val) {
            }
          )

        )
      User.findOne({ password: req.user.password }).where('userinfos').then((user) => {
        user.balance = user.balance + parseInt(data.transac.amount)
        user.save()
          .then(() => {
            res.send({ error: false, message: 'Success' })
          })
      })


    })
})


const server = app.listen(PORT, () => {
  console.log(`Server started running on port: ${PORT}`)
}
); //Logs what app the port is running on.


