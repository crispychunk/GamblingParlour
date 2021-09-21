import Mongoose from 'mongoose'
import transaction from './transactions.js'
const Schema = Mongoose.Schema
const tickerSchema = new Schema({
    name : {
        type : String,
        require : true
    },
    date: {
        type : String,
        require : true
        
    },
    poolTotal: {
        type : Number,
        require : true
    },
    totalLong: {
        type: Number,
        require : true
    },
    totalShort: {
        type: Number,
        require : true
    },
    transactions: {
        type: [transaction],
        require: true
    }


}, {timestamps : true})

const Ticker = Mongoose.model('CloseTicker', tickerSchema)

export default Ticker
