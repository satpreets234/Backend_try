const users = require("../models/user-model");
const jwt = require('jsonwebtoken');
const joi = require('joi');
const {userSchema,postSchema,reactionSchema} =require('../validations/validations');

async function verifyToken(req,res,next){
    
    try{const bearerToken=await req.header('Authorization')
    const jwtToken=bearerToken.split(' ')[1];
    if(jwtToken){
        try {
            const verifyToken=jwt.verify(jwtToken,'secretkeysatpreetsingh');
            if(verifyToken){
                const userDetails=await users.findOne({where:{id:verifyToken.id}});
                req.loggedUser=userDetails;
                next();
            }
        } catch (error) {
                res.send('Unauthorized Access');
        }    }
    }
    catch(error){
        res.send('Please make sure you are logged in');
    }
}

async function userValidate(req,res,next){
    const {error,value}=userSchema.validate(req.body);
    if(error){
        res.json({'error':error});
    }else{
        next();
    }
}

async function postValidate(req,res,next){
    const {error,value}=postSchema.validate(req.body);
    if(error){
        res.json({'error':error});
    }else{
        next();
    }
}

async function reactionValidate(req,res,next){
    req.body.userId=req.loggedUser.id;
    req.body.postId=req.params.postId;
    const {error,value}=reactionSchema.validate(req.body);
    if(error){
        res.json({'error':error});
    }else{
        next();
    }
}



const responseSender=(res,{success,msg,statusCode})=>{
    res.status(statusCode).json({
        success:success,msg:msg    
    })
}

module.exports= {responseSender:responseSender,
    verifyToken,userValidate,
    postValidate,reactionValidate
 }