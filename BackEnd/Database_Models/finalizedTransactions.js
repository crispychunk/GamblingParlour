import Mongoose from 'mongoose'

const Schema = Mongoose.Schema

const finalTransactionSchema = new Schema({
    transactionID: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        requred: true
    },
    type: {
        type: String,
        required: true
    },
    tickerName: {
        type: String,
        required: true
    },
    tickerID: {
        type: String,
        required: true
    },
    result: {
        type: String,
        required:true
    },
    winnings: {
        type: Number,
        required:true
    }
})

export default finalTransactionSchema