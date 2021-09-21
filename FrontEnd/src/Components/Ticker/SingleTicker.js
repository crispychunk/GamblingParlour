import React, { Component, useState } from 'react'
import Button from 'react-bootstrap/Button'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Card, Row, Col, Modal, ButtonGroup, Form, ToggleButton } from 'react-bootstrap';
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.css';
import NavBarPrivate from '../Navbar/NavBarPrivate'
import axios from 'axios';
import './Ticker.css'
import { W3CWebSocket } from "ws"


//https://stackoverflow.com/questions/53973644/making-whole-card-clickable-in-reactstrap
class SingleTicker extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false,
            type: "",
            amount: 0,
        }

        this.handleClose = this.handleClose.bind()
        this.handleShow = this.handleShow.bind()
        this.orderSubmit = this.orderSubmit.bind(this)
    }


    
    handleShow = () => {
        this.setState({
            show: true

        });
        console.log("Setting show to true")
    };
    handleClose = () => {
        this.setState({
            show: false
        });
    };
    // const info = prop;

    orderSubmit() {

        const data = {
            account: this.props.data.account,
            type: this.state.type,
            amount: this.state.amount,
            ticker: this.props.data.ticker
        }
        console.log(data)
        axios.post('http://localhost:5000/order_submit', data, { withCredentials: true }).then(Response => {
            if (Response.data.error == false) {
                console.log("ORder successful");
                this.setState({
                    show: false
                });
                this.props.update();

            }
            else {
                console.log("Order Failed");


            }
        })

    }

    render(prop) {
        return(
        <>
            <Card variant="primary" onClick={this.handleShow} style={{ width: '18rem', height: '10rem', cursor: 'pointer', margin: '5px' }}>
                <Card.Title>{this.props.data.ticker.name} {this.props.data.ticker.date}</Card.Title>
                <Card.Body>
                    <h1>{this.props.data.ticker.poolTotal} tendies</h1>
                </Card.Body>
            </Card>

            <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.data.ticker.name} {this.props.data.ticker.date}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h1>
                        PoolSize : {this.props.data.ticker.poolTotal}
                    </h1>

                    <ButtonGroup className="mb-2">
                        <Button
                            onClick={e => {
                                this.setState({
                                    type: "UP"
                                });
                            }}
                        >Up</Button>
                        <Button
                            onClick={e => {
                                this.setState({
                                    type: "DOWN"
                                });
                            }}
                        >Down</Button>
                    </ButtonGroup>

                    <h2>Order Type: {this.state.type} </h2>
                    <Form.Group size="lg" controlId="text">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                            type="text"
                            value={this.state.amount}
                            onChange={e => {
                                this.setState({
                                    amount: e.target.value
                                });
                            }}


                        />
                    </Form.Group>
                    Balance: {this.props.data.balance}
                </Modal.Body>
                <Modal.Footer>
                    <Button class="login-button" block size="lg" type="submit" onClick={this.orderSubmit}>
                        Submit
                    </Button >
                </Modal.Footer>
            </Modal>
        </>
        )
    }
}
export default SingleTicker