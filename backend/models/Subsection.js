const mongoose = require('mongoose');


const SubSectionSchema = new mongoose.Schema({

   title:{
    type:String,
    required:true
   },

   timeDuration:{
    typr:String
   },

   description:{
    type:String
   },

   videoUrl:{
    type:String,
   },

}) 

module.exports = mongoose.model("SubSection",SubSectionSchema);