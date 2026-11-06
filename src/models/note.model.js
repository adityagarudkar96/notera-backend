const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    discription:{
        type: String
    },
    urgency:{
        type: String,
        enum: ['low', 'medium', 'high']
    },
    createdOn:{
        type: Date,
        default: Date.now,
        immutable: true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }

})

const noteModel = mongoose.model("note", noteSchema)

module.exports = noteModel