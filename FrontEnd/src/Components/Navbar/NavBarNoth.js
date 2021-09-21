import React, { Component } from 'react'
import { Navbar } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.css';
import Logo from './Logo.png'
class NavBarNothing extends Component {
    render() {
        return (
            <Navbar bg="dark" variant="dark">

                <img
                    src={Logo}
                    width="110"
                    height="100"
                ></img>
                <Navbar.Brand href="/">GAMBLING PARLOUR</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
            </Navbar>

        )


    }

}

export default NavBarNothing