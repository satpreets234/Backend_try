const user = require('../models/user-model');
const universalFunction = require('../lib/universal-function');
const middleware = require('../middleware/middleware-function');
const jwt = require('jsonwebtoken');
const {responseSender}=require('../middleware/middleware-function');

const login = async (req, res,next) => {
    try {
        const userExists = await user.findOne({ where: { email: req.body.email } });
        if (userExists) {
            const matchedPassword = await universalFunction.encryptPassword(req.body.password, userExists.password);
            if (matchedPassword) {
                const jsonWebToken = jwt.sign({ email: userExists.email, id: userExists.id }, 'secretkeysatpreetsingh', { expiresIn: '1d' });
                // res.send({ userDetails: userExists, jsonWebToken: jsonWebToken })
                responseSender(res,{success:1,msg:{jsonWebToken:jsonWebToken,userDetails:userExists},statusCode:200})
            } else {
                responseSender(res,{success:0,msg:'Invalid credentials',statusCode:400});
            }
        } else {
            responseSender(res,{success:0,msg:'User Not Found' ,statusCode:400});
        }
    } catch (error) {
        next(err)
    }

}
const createUser = async (req, res,next) => {
    try {
        const emailExist = await user.findOne({ where: { email:req.body.email } });
        if (!emailExist) {
                const { username, profession, age, password, email } = req.body;
                const newPassword = await universalFunction.bcryptPassword(password);
                const newUser = await user.create({ password: newPassword, username: username, age: age, profession: profession, email: email });
                if (newUser) {
                    res.send(newUser);
                } else {
                    res.json({'msg':'Server Error'})
                }
            }else {
                res.json({ 'error': 'Duplicate Details' })
            }
        } catch (err) {
        next(err);
    }

}

const updateUser = async (req, res,next) => {
    try {
        const userId=req.params.id;
        if(userId==req.loggedUser.id){
            if(req.body.password){
            req.body.password=await universalFunction.bcryptPassword(req.body.password)}
            console.log(req.body.password);
           const updatedUser = await user.update(req.body, { where: { id: req.params.id } });
            if (updatedUser) {
                const updatedDetails=await user.findOne({ where: { id: req.params.id } });
                responseSender(res,{success:1,msg:updatedDetails,statusCode:200});
            }
            else{
                responseSender(res,{success:0,msg:"Cannot Update",statusCode:404});
            }
        
        }else{
            responseSender(res,{success:0,msg:"Unauthorized Access",statusCode:400});} 
}  
     catch (error) {
        next(error);
    }
}

const deleteUser = async (req, res,next) => {
    try {
        const deletedUser = await user.destroy({ where: { id: req.params.id } });
        if (deletedUser) {
            responseSender(res,{success:1,msg:deletedUser+' deleted successfully',statusCode:200})
        } else {
            responseSender(res,{success:0,msg:"Invalid User",statusCode:400})

        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    login: login, createUser: createUser,
    updateUser: updateUser, deleteUser: deleteUser
};