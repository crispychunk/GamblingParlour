import React, { Component } from 'react'

export default class test extends Component {
    constructor() {
        super()
        this.state = {
            test : "Not yet gotten"
        };
    }

    componentDidMount = () => {
        
    };
    render() {
        return (
            <div>
                <button> Testing!!</button>
                <h1>Testing : {this.state.test} </h1>
            </div>
        )
    }
}
