//Imports
import Express from "express";
import info from "./info.js";
import Passport from "passport";
import Encrypt from "bcrypt"
import initPassport from './passport-config.js'
import Flash from "express-flash"
import Session from "express-session"
import MethodOveride from "method-override"
import Mongoose from "mongoose"
import User from "./Database_Models/user.js"
import Cors from "cors"
import cookieParser from "cookie-parser";
import Schedule from "node-schedule"
import TickerList from "./Database_Models/tickerList.js"
import Ticker from "./Database_Models/tickerList.js";
import CloseTickerList from "./Database_Models/closeTickerList.js"
import axios from "axios";
import DotEnv from 'dotenv'
import FinalTransaction from "./Database_Models/finalizedTransactions.js"
// import Transaction from "./Database_Models/transactions.js"
DotEnv.config()
const app = Express();
// Connecting to MongleDB database
// pass KZHQw6ZLHTAcBp9A gotta get rid of this later into a private file
const dbURL = process.env.API_KEY
Mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(console.log("connection successful"))
  .catch((err) => console.log(err))
// Declaring variables 
const PORT = 5000;
//Passport authentication initialization
initPassport(Passport, User)
const users = []
app.use(Flash())
app.use(Session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  rolling: true,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 3600000
  }

}))

app.use(Passport.initialize());
app.use(Passport.session());
app.use(Cors({
  origin: "http://localhost:3000",
  credentials: true
}))
app.use(cookieParser('Sexymofo123'));
app.use(Express.json())

// EJS init
app.use(MethodOveride('_method'))
app.set('view-engine', 'ejs');
app.use(Express.static("public")) //Directory folder to locate html + css files
//Make it so we can access req variables
app.use(Express.urlencoded({ extended: false }))

app.get('/api/test', (req, res) => res.json(info))


app.get("/", (req, res) => { // What does .get("/") mean? req = input, res = output
  res.render('index.ejs');
  //res.json(info);
})


//---------------------------------------------------------------------------------
//Login Endpoints
app.get("/login", (req, res) => { // What does .get("/") mean? req = input, res = output
  console.log("Failed to authenticate user")
  res.send({ error: true, message: 'Authentication Failed' })
})
app.post("/login", Passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}
), (req, res) => {
  res.send({ error: false, message: 'Success' })
}
)
app.get("/home", checkAuthenticated, (req, res) => {
  res.render('home.ejs', {
    name: req.user.username,
    password: req.user.password,
    id: req.user._id
  })

  app.post("/")

})


app.get("/validate", (req, res) => {
  if (req.isAuthenticated()) {
    res.send({ error: false, message: 'Success' })
  }
  else {
    res.send({ error: true, message: 'Failed' })
  }
})
//   //Login register
//    app.get('/register', (req, res) => { // What does .get("/") mean? req = input, res = output
//    res.render('register.ejs');
//  })
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

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {

    return next();
  }
  res.redirect('/')
}
//------------------------------------------------------------
//Frontend register APi endpoints
app.post("/registerTest", async (req, res) => {
  await User.findOne({ username: req.body.username }).where('userInfo').then(async (username ) => {
    //console.log(user)
    if (username != null) {
      res.send({ error: false, message: 'Username already in use' });
    }
    else {
      try {
        const hashedPassword = await Encrypt.hash(req.body.password, 10)
        console.log("Not blowing up")
        const newUser = new User({
          email: req.body.email,
          username: req.body.username,
          password: hashedPassword,
          balance: 5000,
          transactions: []
        })
        newUser.save()
        res.send({ error: false, message: 'Success' })
      }
      catch (e) {
        console.log(e)
        res.send(e)
      }
    }
  })
})

//Get User info Endpoints
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


//Background ticker list every 10 seconds update tickers
const holiday = [new Date('January 1, 2021'), new Date('January 18, 2021'), new Date('Febuary 15, 2021'), new Date('April 2, 2021'),
new Date('May 31, 2021'), new Date('July 5, 2021'), new Date('September 6, 2021'), new Date('November 25, 2021'), new Date('December 24, 2021')]
const tickers = ['MSFT', 'AAPL', 'VXX', 'SPY']
let tickerInfo;
setInterval(() => {

}, 10000)
//Get Ticker data Endpoint

//------------------------------------------------------------------------






//------------------------------------------------------------------------
app.get("/test_tickers", (req, res) => {
  res.render('home.ejs')
  console.log(currDay)
})
const rule = new Schedule.RecurrenceRule()
rule.hour = 16
rule.minute = 0
rule.tz = 'America/New_York'
rule.second = 0


/// This will run everyday at 4pm 
const job = Schedule.scheduleJob(rule, function () {
  console.log("Ending of trading day tallying bets")
  processTicker()
})


const openTickerRule = new Schedule.RecurrenceRule()
openTickerRule.hour = 23
openTickerRule.minute = 50
openTickerRule.tz = 'America/New_York'
openTickerRule.second = 0

/// This will run everyday at 23.50pm 
const insertTicker = Schedule.scheduleJob(openTickerRule, function () {
  console.log("Updating Ticker")
  openTickers()
})

async function processTicker(){
  const tickers = await CloseTickerList.find({});
  //console.log(tickers)
  for(let x = 0; x < tickers.length; x++) {
    let ticker = tickers[x]
    let transactions = ticker.transactions
    axios.get("https://cloud.iexapis.com/stable/stock/"+ ticker.name+ "/quote?token=pk_9ac6348434ff447d9d749b689c9cb097").then((Response)=> {

    // Need refactoring
      if(Response.data.iexClose > Response.data.previousClose) {
        //Reward people who bet up
        let rewardPool = ticker.poolTotal - ticker.totalLong
        for (let y = 0; y < transactions.length; y++) {
          let transaction = transactions[y]
          if(transaction.type == "UP") {
            let transactionRatio = transaction.amount/ticker.totalLong
            let gain = Math.floor(transactionRatio * rewardPool)
            updateUser(transaction, gain)
          }
          else {
            updateUser(transaction, -parseInt(transaction.amount))
          }
        }
      }
      else {
        //Reward people who bet down
        let rewardPool = ticker.poolTotal - ticker.totalShort
        for (let y = 0; y < transactions.length; y++) {
          let transaction = transactions[y]
          if(transaction.type == "DOWN") {
            let transactionRatio = transaction.amount/ticker.totalShort
            let gain = Math.floor(transactionRatio * rewardPool)
            updateUser(transaction, gain)
          }
          else {
            updateUser(transaction, -parseInt(transaction.amount))
          }
        }
      }

      CloseTickerList.where('opentickers').find({_id: ticker._id}).remove().exec()
    })

  }
}
function updateUser(transaction, gain) { // transaction, int

  // Remove from livetransaction
  User.where('userInfo').updateOne(
    { _id: transaction.userID },
    { $pull: { liveTransactions: { transactionID: transaction.transactionID } } },
    function (err, val) {
      console.log(val)
    }
  )
  //Add to historical and update balance
  if (gain > 0) {
    //Won so add amount and gain
    const newTransaction = {
      transactionID: transaction.transactionID,
      userID: transaction.userID,
      amount: transaction.amount,
      type: transaction.type,
      tickerName: transaction.tickerName,
      tickerID: transaction.ticker._id,
      result: "WIN",
      winnings: gain
    }
    User.findById(transaction.userID).where('userinfos')
    .then((user) => {
      user.balance = parseInt(transaction.amount) + gain
      user.transactions.push(newTransaction)
      user.save()
    })
  }
  else {
    // Lost
    const newTransaction = {
      transactionID: transaction.transactionID,
      userID: transaction.userID,
      amount: transaction.amount,
      type: transaction.type,
      tickerName: transaction.name + " " + transaction.date,
      tickerID: transaction._id,
      result: "LOSS",
      winnings: gain
    }
    User.findById(transaction.userID).where('userinfos')
    .then((user) => {
      user.transactions.push(newTransaction)
      user.save()
    })
  }

}

// Updating value in database is passed on into local server variable might be more efficient in the future, but this shoudl suffice.. for now
const changeStream = TickerList.watch().on('change', async (data) => {
  if (data.operationType == 'update') {
    tickerInfo = await TickerList.find({});
  }
}


)

app.get("/get_ticker_info", checkAuthenticated, (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // flush the headers to establish SSE with client

  let interValID = setInterval(() => {

    res.write(`data: ${JSON.stringify(tickerInfo)}\n\n`); // res.write() instead of res.send()
  }, 1000);

  // If client closes connection, stop sending events
  res.on('close', () => {
    console.log('client dropped me');
    clearInterval(interValID);
    res.end();
  });
});


async function loadTickers() {
  tickerInfo = await TickerList.find({});
  //console.log(tickerInfo)
  if (tickerInfo.length == 0) {
    newTickers()
  }
  // Will change juist testing
  //console.log(tickerInfo.length)
  //console.log("Making new tickers")

}

function closeTickers() {
  const dayNow = new Date()
  const dateString =  String(dayNow.getFullYear()) + '-' + String(dayNow.getMonth()) + '-' + String(dayNow.getDate()+1)
  const currDate = new Date(dateString)
  for(let x = 0 ; x < tickerInfo.length; x++) {
    const ticker = tickerInfo[x]
    const date = new Date(ticker.date)
    if(date.getTime() == currDate.getTime()) {
      tickerInfo.splice(x,1)
      moveTicker(ticker)
    }
  }
}

function openTickers() {
  console.log("Running open tickers")
  if(tickerInfo == undefined) {
    return
  }
  let lastDay = new Date(tickerInfo[tickerInfo.length-1].date)
  let i = 1
  let dayOffset = 1
  while (i > 0) {
    lastDay.setDate(lastDay.getDate() + dayOffset)
    if (checkHolidayAndWeekEnd(lastDay)) {
      //console.log(newDate)
      dayOffset++;
      i--;
      generateTickers(lastDay, tickers)
    }
    else {
      dayOffset++;
    }
  }
}


function moveTicker(ticker){
  TickerList.where('opentickers').find({_id: ticker._id}).remove().exec()
  const newTicker = new CloseTickerList({
    name: ticker.name,
    date: ticker.date,
    poolTotal: ticker.poolTotal,
    totalLong: ticker.totalLong,
    totalShort: ticker.totalShort,
    transactions: ticker.transactions
  })
  newTicker.save()
}
// Return false if holiday and true if not
function checkHolidayAndWeekEnd(date) {
  if (date.getDay() == 0 || date.getDay() == 6) {
    // weekends
    return false;
  }
  for (let i = 0; i < holiday.length; i++) {
    if (date.getDate() == holiday[i].getDate) {
      if (date.getMonth() == holiday[i].getMonth) {
        if (date.getFullYear() == holiday[i].getFullYear()) {
          // it is a holiday
          return false;
        }
      }
    }
  }
  return true;
}

function newTickers() {
  let i = 3;
  let dayOffset = 1;

  while (i > 0) {
    const newDate = new Date()
    newDate.setDate(newDate.getDate() + dayOffset)
    if (checkHolidayAndWeekEnd(newDate)) {
      //console.log(newDate)
      dayOffset++;
      i--;
      generateTickers(newDate, tickers)
    }
    else {
      dayOffset++;
    }
  }
}
// Helper function to generate tickers for the current day
async function generateTickers(newDate, tickers) {
  for (let i = 0; i < tickers.length; i++) {
    const newTicker = new TickerList({
      name: tickers[i],
      date: String(newDate.getFullYear()) + '-' + String(newDate.getMonth()+1) + '-' + String(newDate.getDate()),
      poolTotal: 0,
      totalLong: 0,
      totalShort: 0,
      transactions: []
    })
    console.log(newTicker)
    newTicker.save()
  }
  tickerInfo = await TickerList.find({});

}
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

app.get('/logout', function(req, res){

  req.logout();
  res.send({ error: false, message: 'Success' })

});

const server = app.listen(PORT, () => {
  console.log(`Server started running on port: ${PORT}`)
  loadTickers()
  let interValID = setInterval(() => {
    closeTickers()
    
  }, 10000);

}
); //Logs what app the port is running on.


 // Make it so that u can close the server after starting, Control+C in gitbash to terminate
//  process.on('SIGINT',() => {
//     console.info('SIGINT signal received.');
//     console.log('Closing http server.');
//     server.close(() => {
//         console.log('Http server closed.');
//     });
//  });
