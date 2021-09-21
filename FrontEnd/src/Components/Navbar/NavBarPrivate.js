import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem,} from 'react-bootstrap';
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.css';
import Logo from './Logo.png'
import axios from 'axios';
class NavBarPrivate extends Component {
    render() {
        return (
            <Navbar bg = "dark" variant = "dark">
            
                <img
                src = {Logo}
                width="110"
                height="100"
                ></img>
                <Navbar.Brand href="/dashboard">GAMBLING PARLOUR</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Nav className="me-auto">
                    <Nav.Link href = "/dashboard">HOME</Nav.Link>
                    <Nav.Link href="/ticker">DAILY TICKER BETS</Nav.Link>
                    <Nav.Link href="/about">ABOUT</Nav.Link>

                </Nav>
                <Nav className="ml-auto">
                <Nav.Link>{this.props.props.balance} tendies</Nav.Link>
                <Nav.Link href = "/dashboard">{this.props.props.username}</Nav.Link>
                <Nav.Link>Logout</Nav.Link>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                
                </Nav> 
            </Navbar>
      
        )


    }
 
}

export default NavBarPrivate
