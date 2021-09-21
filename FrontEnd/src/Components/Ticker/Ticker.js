import React, { Component, useState } from 'react'
import Button from 'react-bootstrap/Button'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Card, Row, Col, Modal, ButtonGroup, Form, ToggleButton } from 'react-bootstrap';
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.css';
import NavBarPrivate from '../Navbar/NavBarPrivate'
import SingleTicker from './SingleTicker';
import axios from 'axios';
import './Ticker.css'
import { W3CWebSocket } from "ws"

class Ticker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            username: "",
            balance: "",
            tickers: "",
            id: ""

        }
        this.eventSource = new EventSource("http://localhost:5000/get_ticker_info", { withCredentials: true });
        this.updateInfo = this.updateInfo.bind(this)
    }


    componentDidMount() {
        axios.get("http://localhost:5000/get_user_info", { withCredentials: true }).then(Response => {
            this.setState({
                loading: false,
                username: Response.data.username,
                balance: Response.data.balance,
                id: Response.data.id
            })


        })

        this.eventSource.onmessage = e => {
            this.setState({
                tickers: JSON.parse(e.data)
            })


        }


    };
    
    updateInfo() {
        axios.get("http://localhost:5000/get_user_info", { withCredentials: true }).then(Response => {
            this.setState({
                loading: false,
                username: Response.data.username,
                balance: Response.data.balance,
                id: Response.data.id
            })


        })
    }




    render() {
        var json = this.state.tickers
        var arr = []
        if (json != undefined) {
            Object.keys(json).forEach(function (key) {
                arr.push(json[key])
            });
            console.log("updated")
        }


        return (

            <div>
                <NavBarPrivate props = {this.state} />
                <Container>
                    <div className="middleText">
                        <h1>Tickers</h1>
                    </div>
                    <Row>

                        {arr.map((ticker) => {
                            const prop = {
                                ticker: ticker,
                                balance: this.state.balance,
                                account: this.state.id,
                                callback: this.orderSubmit
                            };

                             return <SingleTicker data = {prop} update = {this.updateInfo}/>
                        }

                        )}
                    </Row>



                </Container>

            </div>
        )
    }
}











export default Ticker