import React, { Component } from 'react'
//import 'bootstrap/dist/css/bootstrap.css';
import NavBarPrivate from '../Navbar/NavBarPrivate'
import "../Dashboard/Dashboard.css";
import { Container, Nav, Col, Row, Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            username: "",
            balance: "",
            liveTransactions: "",
            oldTransactions: ""
        }

        this.handleCancel = this.handleCancel.bind(this) 
    }

    componentDidMount() {
        axios.get("http://localhost:5000/get_user_info", { withCredentials: true }).then(Response => {
            this.setState({
                loading: false,
                username: Response.data.username,
                balance: Response.data.balance,
                oldTransactions: Response.data.oldTransactions,
                liveTransactions: Response.data.liveTransactions
            })




        })
    }
    handleCancel(transaction) {
        console.log("Handling Cancel")
        console.log(transaction)
        const data = {
            transac: transaction
        }
        axios.post('http://localhost:5000/cancel_openOrder',data, {withCredentials: true}).then(Response => {
            console.log(Response.data)
            if (Response.data.error == false) {
                console.log("cancel good");
                this.componentDidMount()
                

        
            }
            else {
                console.log("cancel failed");
                console.log(Response.data.message)

            }
        });

    }

    render() {
        // Make arrays of transactions
        var json = this.state.liveTransactions
        const liveTransactions = []
        if (json != undefined) {
            Object.keys(json).forEach(function (key) {
                liveTransactions.push(json[key])
            });
        }
        var json = this.state.oldTransactions
        const oldTransactions = []
        if (json != undefined) {
            Object.keys(json).forEach(function (key) {
                oldTransactions.push(json[key])
            });
        }



        const data = [{ name: 'Day 1', uv: 200, pv: 2400, amt: 2400 }, { name: 'Day 2', uv: 400, pv: 2400, amt: 2400 }, { name: 'Day 3', uv: 400, pv: 2400, amt: 2400 },]
        return (
            <div >

                <NavBarPrivate props = {this.state} />
                <Container fluid="sm">
                    <h1>Welcome {this.state.username}</h1>
                    <Row>
                        <Col className="square border border-dark footer">
                            <h2>Balance: {this.state.balance}</h2>

                        </Col>
                        <Col className="square border border-dark">
                            <h2>NAV chart</h2>
                            <LineChart width={600} height={200} data={data} >
                                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                                <CartesianGrid stroke="#ccc" />
                                <XAxis dataKey="name" />
                                <YAxis />
                            </LineChart>
                        </Col>
                    </Row>
                    <h2>Open Positions</h2>
                    <Row className="square border border-dark customHeight">
                    
                        <Table striped bordered hover md size="sm">
                            <thead>
                                <tr>
                                    <th>Ticker</th>
                                    <th>Amount</th>
                                    <th>Result</th>
                                </tr>
                            </thead>
                            <tbody>
                            {liveTransactions.map( (transac) => {
                                console.log(transac._id)
                                    return(
                                    
                                    <tr>
                                    <td>{transac.tickerName}</td>
                                    <td>{transac.amount} - {transac.type}</td>
                                    <td> <Button onClick = {()=> this.handleCancel(transac)}>Cancel</Button> </td>
                                </tr>)
                                })}
                            </tbody>
                        </Table>

                    </Row>
                    <h2>History</h2>
                    <Row className="square border border-dark customHeight overFlow">
                        
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th>Ticker</th>
                                    <th>Amount</th>
                                    <th>Result</th>
                                    <th>Winnings</th>
                                </tr>
                            </thead>
                           <tbody>
                                {oldTransactions.map( (transac) => {
                                    return(
                                        <tr>
                                        <td>{transac.tickerName}</td>
                                        <td>{transac.amount} - {transac.type}</td>
                                        <td>{transac.result}</td>
                                        <td>{transac.winnings}</td>
                                    </tr>)
                                })}
                            </tbody>
                        </Table>
                    </Row>






                </Container>
                <hr/>
                <p className="footer">Gambit Parlor</p>
            </div>





        );

    }


}


export default Dashboard