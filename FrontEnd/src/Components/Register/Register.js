import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import NavBarNothing from '../Navbar/NavBarNoth.js'
import { Container,Card, Form,Button } from 'react-bootstrap';
import "./Register.css"
import { Redirect } from 'react-router-dom';
import Axios from 'axios'

class Register extends Component {

    constructor() {
        super();
        this.state = {
            email: "",
            username: "",
            password: ""

        }
        this.registerSubmit = this.registerSubmit.bind(this)
    }


    registerSubmit() {
        const info = {
            email: this.state.email,
            username: this.state.username,
            password: this.state.password
        }
        Axios.post('http://localhost:5000/registerTest',info, {withCredentials: true}).then(Response => {
            console.log(Response)
            if (Response.data.message == 'Success') {
                console.log("register Good");
                window.location.href = "http://localhost:3000/login"              

            }
            else {
                console.log("Reigster failed");
                console.log(Response.data.message)
                window.location.href = "http://localhost:3000/login" 
            }
        });

        
    }


    render() {
        console.log("Rendering")
        return (
            <div>
                <NavBarNothing/>

                    <div class = "Login container" bg = "grey">

                    <Card>
                    <Card.Body>
                        <Card.Title class = "login-header">Register</Card.Title>

                            <Form.Group size="lg" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                autoFocus
                                type="email"
                                value = {this.state.email}
                                onChange = { (e) => this.setState( {email:  e.target.value})}
                                
                            />
                            </Form.Group>


                            <Form.Group size="lg" controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                autoFocus
                                type="username"
                                value = {this.state.username}
                                onChange = { e => this.setState( {username:  e.target.value})}
                                

                            />
                            </Form.Group>


                            <Form.Group size="lg" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                autoFocus
                                type="password"
                                value = {this.state.password}
                                onChange = { (e) => this.setState( {password:  e.target.value})}
                                
                            />
                            </Form.Group>


                            <p></p>
                            <Button class = "login-button" block size="lg" type="submit" onClick = {this.registerSubmit} >
                                
                            Register
                            </Button >
                        <Card.Text>
                            <p>Already have an account? <Card.Link href="login">Login</Card.Link> </p>
                        </Card.Text>
                    </Card.Body>
                    </Card>
                </div>



            </div>
        );
    }
}

export default Register