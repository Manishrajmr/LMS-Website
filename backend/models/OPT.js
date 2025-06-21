const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

const OTPSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true, 
  },
  createdAt: {  
    type: Date,
    default: Date.now,
    expires: 300, // Document will automatically delete after 5 minutes (300 seconds)
  }
});

//a function to send emails

async function sendVerificationEmail(email,otp){
    try{
      const mailResponse = mailSender(email,"verification email from study notion",otp)  ;
      console.log("Email sent successfully:",mailResponse);
    }
    catch(error){
      console.log("error occured while  sending  mails:",error);
      throw error;
    }
}

// user ki new entry document men save hone se pehle mail jata h isaliye pre middleware ka use krenge

OTPSchema.pre('save',async function(next) {
  await sendVerificationEmail(this.email,this.otp);
  next();
})


module.exports = mongoose.model("OTP",OTPSchema);