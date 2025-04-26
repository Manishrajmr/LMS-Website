const mongoose = require('mongoose');


const courseSchema = new mongoose.Schema({

    courseName:{
        type:String,
        requred:true
    },
    

})

module.exports = mongoose.model("Course",courseSchema);