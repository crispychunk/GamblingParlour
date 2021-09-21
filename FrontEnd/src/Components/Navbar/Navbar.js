import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem,} from 'react-bootstrap';
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.css';
import Logo from './Logo.png'
class NavBarPublic extends Component {
    render() {
        return (
            <Navbar bg = "dark" variant = "dark">

                <img
                src = {Logo}
                width="110"
                height="100"
                ></img>
                <Navbar.Brand href="/">GAMBLING PARLOUR</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Nav className="me-auto">
                    <Nav.Link href = "/dashboard">HOME</Nav.Link>
                    <Nav.Link href="/ticker">DAILY TICKER BETS</Nav.Link>


                </Nav>
                <Nav className="pull-right">
                <Nav.Link href="/login">LOGIN</Nav.Link>
                {"  "}
                <Nav.Link href="/register">REGISTER</Nav.Link>
                </Nav> 
            </Navbar>
      
        )


    }
 
}

export default NavBarPublic
