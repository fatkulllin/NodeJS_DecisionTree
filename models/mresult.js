const {Schema, model} = require('mongoose')


const mresult = new Schema({
    treename:{
        type:String,
        default: 'noNameTree' 
    },
    cols:{
        type:Number,
        required:true
    },
    titles:{
        type:String,
        required:true
    },
    rows:{
        type:Number,
        required:true
    },
    main_tab:{
        type:String,
        required:true
    },
    key:{
        type:String,
        required:true
    },
    ign_key:{
        type:String,
        required:false
    },
    atr_tab:{
        type:String,
        required:false
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = model('Mresult', mresult)
