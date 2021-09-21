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
                <p>To be able to make bets, new users need to make an account. On the NavBar, there is a register button to the right. As of right now, no emai</p>
                <h1 class = "subTitle">How does Daily Ticker Bets work?</h1>
                <hr></hr>
                <h1 class = "subTitle">Technology used</h1>
                <hr></hr>
            </div>

        );
    }


}


export default DemoTicker
