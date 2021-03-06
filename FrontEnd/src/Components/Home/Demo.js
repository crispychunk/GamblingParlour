import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, } from 'react-bootstrap';
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.css';
import './Home.css'
class DemoTicker extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <h1 class = "title">Welcome to Gambling Parlour</h1>
                <h1 class = "subTitle">What is it?</h1>
                <hr></hr>
                <p>Gambling Parlour is a website that allow users to gamble using a fake currency known as "tendies". Currently, only Daily Ticker Bets is operationals but there many many more games to be implemented in the future.
                    Some currently in development include Roulette, and a Gacha Simulator. This website was made as a personal project for me to develop my skills in Javascript, React and Databases. 
                </p>
                <h1 class = "subTitle">How to get Started</h1>
                <hr></hr>
                <p>To be able to make bets, new users need to make an account. On the NavBar, there is a register button to the right. As of right now, no two users can have the same username. After registering, you can access the dashboard which would
                display your current balance as well as your live and historical transactions.</p>
                <h1 class = "subTitle">How does Daily Ticker Bets work?</h1>
                <hr></hr>
                <p>Daily Ticker Bets is a game where users can bet if a stock is going to rise or decrease in price on the day stated by the ticker compared to the stocks previous regular hour trading close.
                    Ticker prices are calculated base on IEX Cloud's close. New tickers are to be open everyday at midnight EST and are closed approximately one day before the ticker's bet date. If a user wins, they are given the amount originally bet in addition to
                    their percentage of the pool of all the winners. The reward pool contains the total amount bet by the losers. If a user loses their bet, they lose all that are put in.
                </p>
                <h1 class = "subTitle">Technology used</h1>
                <hr></hr>
                <p>For backend development, this project uses ExpressJS as its framework to do a lot of the routing and management. For its user login and register implementation, this website uses PassPortJS. To store all the users information, as well as data
                on live and closed tickers, this project used MongoDB's database solution. For handling requests, I used Axios. Handling of session management was handled by express-session.</p>

                <p>For Frontend development, this project uses ReactJS as its framework. Quite Frankly, the reason for this was I really wanted to learn a popular framework that others were using. Then again, it was really great in making coding easier as React seperates
                my pages into many components which made it easily reusable and easier to code.</p>
                <h1 className="subTitle">About me</h1>
                <hr></hr>
                    My name is Crispin. I am currently a 3rd year Computer Science student from UBC. I am sole creator of this website and I plan to continuously work on this site so if you like it stay tune! Some of my hobbies including trading in the stock market (Only stocks, options are too scary) and coding in my free time.
                Some of my interests are in Cloud technology and Big Data. If you would like to see some of my other projects here is my github link: <a href="https://github.com/crispychunk">Github Link</a>

            </div>

        );
    }


}


export default DemoTicker
