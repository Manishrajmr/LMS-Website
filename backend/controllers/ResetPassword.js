const User = require('../models/User');
const mailSender = require('..utils/mailSender');
const bcrypt = require('bcrypt');

//resetpassword token
exports.resetPasswordToken = async (req,res) => {

  try{
      //get email from req body
     const email = req.body.email;
     //check user for this email, email validation

     const user = await User.findOne({email:email});
     if(!user){
            return res.json({
                successs:false,
                message:"you email is not registered",
            })
     }
     //generate token

     const token = crypto.randomUUID();

     //add this token to user and the expiration time

     const updateDetails = await User.findOneAndUpdate(
        {email:email},
        {
            token:token,
            resetPasswordExpires:Date.now()+5*60*1000,
        },
        {new:true},
    );

    //create url
    const url = `http//localhost:3000/update-password/${token}`;

    //send mail containing the url

    await mailSender(email,"password reset link",`password reset link:${url}`);

    //return response

    return res.json({
        successs:true,
         message:'email sent .., please check email  and change password',
    });
  }

  catch(err){
    console.log(err);

    return res.status(500).json({
        succes:false,
        message:'something went wrong while reset password',
    })
  }

}

//reset password

exports.resetPassword = async(req, res)=>{
    try{
        //data fetch
    const {password,confirmPassword,token} =  req.body;
    //validation

    if(password!=confirmPassword){
        return res.json({
            success:false,
            message:'password not matched',
        });
    }
    //email toh aayega nhi isliye token se user ki entry nikalemnge

    const userDetails = await User.findOne({token:token});
    //if no entry - invalid token
    if(!userDetails){
        return res.json({
            success:false,
            message:'token is invalid',
        });
    }
    //token time check
    if(userDetails.resetPasswordExpires<Date.now()){

        return res.json({
            success:false,
            message:'token is expired, please regenerate your token',
        });

    }
    //hash password and update 
    const hashedPassword = await bcrypt.hash(password,10);
    // update password

    await User.findOneAndUpdate({token},{password:hashedPassword},{new:true}); 

    return res.status(200).json({
        success:true,
        message:'password reset successfull'
    });
    }

    catch(err){
        return res.status(500).json({
            status:false,
            message:'somthing went wrong',
        });
    }
}