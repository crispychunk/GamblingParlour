import Schedule from "node-schedule";
import CloseTickerList from "./Database_Models/closeTickerList.js";
import axios from "axios";
import User from "./Database_Models/user.js";
import TickerList from "./Database_Models/tickerList.js";


const holiday = [new Date('January 1, 2021'), new Date('January 18, 2021'), new Date('Febuary 15, 2021'), new Date('April 2, 2021'),
    new Date('May 31, 2021'), new Date('July 5, 2021'), new Date('September 6, 2021'), new Date('November 25, 2021'), new Date('December 24, 2021')]
const tickers = ['MSFT', 'AAPL', 'VXX', 'SPY'] // This can be edited to increase types of ticker. Requires string to be a valid symbol for IEXCloud
let tickerInfo;

export default function (app,checkAuthenticated) {
//Get Ticker data Endpoint

//------------------------------------------------------------------------
// Process that are run at certain time of day
    loadTickers()

    // End of trading day process all ticker and dispense the rewards/losses and log
    const rule = new Schedule.RecurrenceRule()
    rule.hour = 16
    rule.minute = 0
    rule.tz = 'America/New_York'
    rule.second = 0
    Schedule.scheduleJob(rule, function () {
        console.log("Ending of trading day tallying bets")
        processTicker()
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
//------------------------------------------------------------------------
    // New day generate new ticker base on next available trading day
    const openTickerRule = new Schedule.RecurrenceRule()
    openTickerRule.hour = 23
    openTickerRule.minute = 50
    openTickerRule.tz = 'America/New_York'
    openTickerRule.second = 0

/// This will run everyday at 23.50pm
    Schedule.scheduleJob(openTickerRule, function () {
        console.log("Updating Ticker")
        openTickers()
    })

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
//------------------------------------------------------------------------
    // Updating value in database is passed on into local server variable might be more efficient in the future, but this shoudl suffice.. for now
    TickerList.watch().on('change', async (data) => {
            if (data.operationType == 'update') {
                tickerInfo = await TickerList.find({});
            }
        }
    )

    //Gets ticker information and send it to client
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


//------------------------------------------------------------------------
    // Check if ticker needs to be closed every 20 seconds
    let interValID = setInterval(() => {
        closeTickers()
    }, 20000);

    // Helper function that moves users transaction into its own closed transactions. Users should no longer be able to cancel closed
    // bets
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

    // Check if there are tickers form the database and load it to local variable tickerInfo
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

    // Check if any ticker is supposed to be close. The condition is that the ticker day is the day tomorrow and moves
    // Moves it to the close ticker list awaiting for processing
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
    //Helper function that moves ticker from liveTicker to closeTicker in database
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
    // Helper function to check if date is valid. Return true if date is a trading and false if not
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
    // Function that generates a new set of tickers and stores it to the database. Used on initialization of new server
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
    // Helper function to generate tickers for the current day. Generate tickers and save it to database for that day
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

}
