const User = require('../models/User');
const OTP = require('../models/OPT');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Profile =  require('Profile');
require("dotenv").config();


//send otp
exports.sendOtp = async (req,res)=>{

    try{
        //fetch email from req body

        const {email} = req.body;

        //check user already exist or not

        const isUser = await User.findOne({email});

        //if user already exit return response

        if(isUserPresent){
            return res.status(401).json({
                status:false,
                message:'user already exist',
            });
        }

        //generate otp

        let otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        })

        console.log("otp generated",otp);

        //check unique otp or not

        let result = OTP.findOne({otp:otp})
        while(result){
            var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });

        result = await OTP.findOne({otp:otp});
    
        }

        const otpPayload =  { email,otp};

        //create a entry for otp

        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        //return respone successfuly

        res.status(200).json({
            success:true,
            message:'otp sent successfully',
            otp,
        })


    }

    catch(error){

        console.log(error);
        return res.status.json({
            success:false,
            message:error.message,
        })

    }
};

//signup 

exports.signUp = async (req,res)=>{

    try{
        //data fetch from req body

    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp ,

    } = req.body;

    //validate data

    if(!firstName||!lastName ||!email || !password ||!confirmPassword ||!otp){

        return res.status(403).json({
            status:false,
            message:"fill all the details",

        })
    }
    //match password

    if(password != confirmPassword){
        return res.status(400).json({
            success:false,
            message:"password does not match"
        })
    }

    //find user exists or not 

    const existingUser = User.findOne({email});

    if(existingUser){
        return res.status(400).json({
            status:false,
            message:"user already registered",
        })
    }

    //find most recent otp stored for user

    const recentOtp = await OTP.findOne({email}).sort({createdAt:-1}).limit(1);
    console.log(recentOtp);

    //validate otp

    if(recentOtp.length==0){
        //otp not found

        return res.status(400).json({
            success:false,
            message:'OTP not found',
        })
    }
    else if(recentOtp.otp != otp){
        //Invalid otp

        return res.status(400).json({
            success:false,
            message:'Invalid Otp',
        });
    }

    //Hash password

    const hashedPassword = await bcrypt.hash(password,10);

    //entry create in db

    const profileDetails = await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null,

    })



    const user = await User.create({

        firstName,
        lastName,
        email,
        contactNumber,
        password:hashedPassword,
        accountType,
        additionalDetails:profileDetails._id,
        image:`https://api.dicebear.com/9.x/initials/svg?seed=${firstName} ${lastName}`,


    })

    //return response

    return res.status(200).json({
        success:true,
        message:'user registered successfully',
        user,
    })

    }

    catch(error){

        console.log(error);

        return res.status(500).json({
            status:false,
            message:'user can not be resistered please try again',
        })
    }



}

//login

exports.login = async (req,res)=>{
       
   try{
     //get data from request body

    const {email, password} = req.body;

    //validate data

    if(!email || !password){

        return res.status(403).json({
            success:false,
            message:"all fiels are required, try again"
        })
    }

    //user exist or not

    const user = await User.findOne({email}).populate("additional details");

    if(!user){
        return res.status(401).json({
            success:false,
            message:"user  is not registered , please signup first",
        });
    }

    //generate jwt token , after password matching

    if(await bcrypt.compare(password,user.password)){

        const payload = {

            email:user.email,
            id : user._id,
            role:user.accountType,

        }

        const token = jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"2h",
        });

        user.token = token;
        user.password = undefined;

        // crete cookies and send response

        const options = {

            expires: new Date(Date.now()+ 3*24*60*60*1000),
            httpOnly:true,

        }

        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:'logged in successfully',
        })
    }

    else{
        res.status(401).json({
            status:false,
            message:'Password is incorrect',
        });
    }

   }

   catch(error){

    console.log(error);

    return res.status(500).json({
        status:false,
        message:'Login failure , please try again',
    });

   }


}

//change password

exports.changePassword = (req, res)=>{
    
    
}




