const bcrypt = require('bcrypt');
const reaction=require('../models/reactions-model');

async function bcryptPassword(plainPassword){
        const bcryptedPassword= bcrypt.hash(plainPassword,10);
        return bcryptedPassword;
}

async function encryptPassword(plainPassword,bcryptedPassword){
    const encrypt=await bcrypt.compare(plainPassword, bcryptedPassword)
    if(encrypt){
        console.log('matched');
        return true;
    }else{
        console.log('unmatched');
        return false;
    }
}

async function getAllComments(postId){
    const allComments=await reaction.findAll({where:{reactionType:'text',postId:postId}});
    return allComments;
}

async function getAllReactions(postId){
    const allReactions=await reaction.findAll({where:{reactionType:'bote',postId:postId}});
    return allReactions;
}
async function getAllEmojis(postId){
    const allComments=await reaction.findAll({where:{reactionType:'emoji',postId:postId}});
    return allComments;
}

module.exports={bcryptPassword:bcryptPassword,
encryptPassword:encryptPassword,
getAllComments,getAllComments,getAllReactions:getAllReactions,
getAllEmojis:getAllEmojis};