import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import NavBarPublic from '../Navbar/Navbar'
import Demo from './Demo'
import {  Container } from 'react-bootstrap';



class Home extends Component {
    render() {
        return (
            <div>
                <NavBarPublic />
                <Container>
                    <Demo/>
                </Container>
            </div>
        );
    }
}


export default Home