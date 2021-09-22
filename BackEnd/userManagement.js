

import Passport from "passport";
import Encrypt from "bcrypt"
import initPassport from './passport-config.js'
import Flash from "express-flash"
import Session from "express-session"
import cookieParser from "cookie-parser";
import User from "./Database_Models/user.js";
import Express from "express";

// Setup Function for User management
function setup(app) {
    initPassport(Passport, User)
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
    app.use(cookieParser('Sexymofo123'));
    app.use(Express.json())
}

export default function(app) {
    setup(app)

    // Validates if user is authenticated or not
    // Send error: false if successful and true otherwise
    app.get("/validate", (req, res) => {
        if (req.isAuthenticated()) {
            res.send({ error: false, message: 'Success' })
        }
        else {
            res.send({ error: true, message: 'Failed' })
        }
    })

    //POST method for registering users. Checks if there is a similar username in database. If there is, send reject
    //otherwise create user
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
                    await newUser.save()
                    res.send({ error: false, message: 'Success' })
                }
                catch (e) {
                    console.log(e)
                    res.send(e)
                }
            }
        })
    })

    app.get('/logout', function(req, res){
        req.logout();
        res.send({ error: false, message: 'Success' })
    });



}
