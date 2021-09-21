import Mongoose from 'mongoose'

const Schema = Mongoose.Schema

const transactionSchema = new Schema({
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
    }
})

export default transactionSchema