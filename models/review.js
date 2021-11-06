const {Schema, model} = require('mongoose')

const review = new Schema({
    otzyv: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = model('Review', review)