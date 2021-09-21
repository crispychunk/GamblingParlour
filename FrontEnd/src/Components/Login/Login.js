import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import NavBarNothing from '../Navbar/NavBarNoth.js'
import { Container,Card, Form,Button } from 'react-bootstrap';
import "./Login.css"
import Axios from 'axios';

class Login extends Component {

    constructor() {
        super();
        this.state = {
            username: null,
            password: null
        }
        this.loginSubmit = this.loginSubmit.bind(this)
    }
    loginSubmit() {
        const info = {
            username: this.state.username,
            password: this.state.password
        }
        Axios.post('http://localhost:5000/login',info, {withCredentials: true}).then(Response => {
            console.log(Response.data)
            if (Response.data.error == false) {
                console.log("Login Good");
                window.location.href = "http://localhost:3000/dashboard" 
           

            }
            else {
                console.log("Login failed");
                console.log(Response.data.message)
                window.location.href = "http://localhost:3000/login" 
            }
        });

        
    }

    
    render() {
        return (
            <div>
                <NavBarNothing/>

                    <div class = "Login container" bg = "grey">

                    <Card>
                    <Card.Body>
                        <Card.Title class = "login-header">Login in to Gambling Parlour</Card.Title>
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
                            <Button class = "login-button" block size="lg" type="submit" onClick ={this.loginSubmit}>
                                
                            Login
                            </Button >
                        <Card.Text>
                            <p> Unable to login?  <Card.Link href="accountHelp">Forgot Username/Password</Card.Link> </p>

                        </Card.Text>
                        <Card.Text>
                            <p>No account? <Card.Link href="register">Register</Card.Link> </p>
                        </Card.Text>
                    </Card.Body>
                    </Card>
                </div>



            </div>
        );
    }
}

export default Login