const mongoose = require('mongoose');
require('dotenv').config();

exports.dbConnect = async () => {
   await mongoose.connect('process.env.MONGODB_URL',{
    useNewUrlParser : true,
    useUnifiedTopology:true
   })
   .then(()=>{console.log("db connected")})
   .catch((err)=>{
    console.log("db connection faild");
    console.log(err);
    process.exit(1);
   })
}