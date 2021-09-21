import Mongoose from 'mongoose'
import Transac from './transactions.js'
import finalTransac from './finalizedTransactions.js'
const Schema = Mongoose.Schema


const userScheme = new Schema({
    email : {
        type : String,
        require : true
    },

    username: {
        type : String,
        require : true
        
    },

    password: {
        type : String,
        require : true
    },
    balance: {
        type: Number,
        require : true
    },
    liveTransactions: {
        type: [Transac],
        require : false
    },
    transactions: {
        type: [finalTransac],
        require : false
    }


}, {timestamps : true})

const Users = Mongoose.model('UserInfo', userScheme)

export default Users
