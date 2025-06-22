const jwt = require('jsonwebtoken');
const User = require('../models/User');
require("dotenv").config();


//auth 

exports.auth = (req,res,next) => {

    try{

    //extract token

    const token = req.cookie.token|| req.body.token || req.header("Authorisation").replace("Bearer ","");

    //if token missing then return response

    if(!token){
        return res.status(401).json({
            success:false,
            message:"token is missing",
        })
    }

    //verify the token

    try{
        const decode =  jwt.verify(token,proccess.env.JWT_SECRET);
        console.log(decode);

        req.user = decode;
    }
    catch(error){
        // verification issue

        return res.status(401).json({
            sucess:false,
            message:"token is invalid",
        });
    }

    next();

}

catch(error){

    return res.status(401).json({
        success:false,
        message:"somthing went wrong while validating the token",
    });

}

}

//isStudent

exports.isStudent = async (req,res,next) => {

    try{
        if(req.user.accountType !=="Student"){

            return res.status(401).json({
                success:false,
                message:'This is a protected route for students only  ',
            });

        }

        next();

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'user role can not be verified',
        })
    }


}

//isInstructor

exports.isInstructor = async (req,res,next) => {

    try{
        if(req.user.accountType !=="Instructor"){

            return res.status(401).json({
                success:false,
                message:'This is a protected route for Instructor only  ',
            });

        }

        next();

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'user role can not be verified',
        })
    }


}

//isAdmin

exports.isAdmin = async (req,res,next) => {

    try{
        if(req.user.accountType !=="isAdmin"){

            return res.status(401).json({
                success:false,
                message:'This is a protected route for Admin only  ',
            });

        }

        next();

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'user role can not be verified',
        })
    }


}

