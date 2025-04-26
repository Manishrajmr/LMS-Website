const mongoose = require('mongoose');
const Subsection = require('./Subsection');


const sectionSchema = new mongoose.Schema({

    sectionName:{
        type:String
    },

    Subsection:[{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"SubSection",
    }],

})

module.exports = mongoose.model("Section",sectionSchema);