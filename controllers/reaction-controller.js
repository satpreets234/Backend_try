const reaction = require('../models/reactions-model');
const universalFunction = require('../lib/universal-function');
const post = require('../models/post-model');
const { reactionSchema } = require('../validations/validations');
const { responseSender } = require('../middleware/middleware-function')
async function addReaction(req, res,next) {
    try {
    const parentId=req.body.parentId||null;
    const {reactionType,reactionData,postId,userId}=req.body;
    
        const newReaction = await reaction.create({postId:postId,userId:userId,reactionData:reactionData,reactionType:reactionType
            ,parentId:parentId});
        if(newReaction){
        responseSender(res, { success: 1, msg: newReaction, statusCode: 200 });}
        else{responseSender(res,{success:0,statusCode:404,msg:'Post not found'})
    }
    } catch (error) {
        next(error);
    }
    
}

async function getAllReactions(req, res) {
    const postId = req.params.postid;
    const postDetails = await post.findOne({ where: { id: postId } });
    if (postDetails) {
        const comments = await universalFunction.getAllComments(postId);
        const reaction = await universalFunction.getAllReactions(postId);
        const emoji=await universalFunction.getAllEmojis(postId);
      responseSender(res,{msg:{ 'comments': comments, 'reactions': reaction,'emojis':emoji },success:1,statusCode:200});
    }
    else {
        responseSender(res,{msg: "Post Not Found" ,statusCode:404,success:0})
    }
}


async function updateReaction(req,res,next){
    try {
        const userId=req.loggedUser.id;
        const reactionId=req.params.reactionId;
        const reactionType=await reaction.findOne({where:{id:reactionId}});
        if(reactionType){
            if (reactionType.userId===userId) {
                const updateReaction=await reaction.update({reactionData:req.body.reactionData},{where:{id:reactionId}});
                if(updateReaction){
                    responseSender(res,{success:1,msg:'Reaction Updated Successfully',statusCode:200});
                }
                else{
                    responseSender(res,{success:0,statusCode:404,msg:'Something Went Wrong'});
                }
            } else {
                responseSender(res,{success:0,msg:'Unauthorized Access',statusCode:403});
            }
        }else{
            responseSender(res,{success:0,msg:'Not Found',statusCode:404});
        }
    } catch (error) {
        next(err);
    }
}

async function deleteReaction(req,res,next){
    try {
        const reactionId=req.params.reactionId;
        const loggedUserId=req.loggedUser.id;
        const reactionType=await reaction.findOne({where:{id:reactionId}});
        if (reactionType) {
            const postUserId=await reaction.findOne({where:{id:reactionId},include:{model:post}});
            if(postUserId){
                if(postUserId.userId==loggedUserId || postUserId.post.userId==loggedUserId ){
                    const deleteReaction=await reaction.destroy({where:{id:reactionId}});
                    if (deleteReaction) {
                        responseSender(res,{success:1,msg:'Deleted Successfully',statusCode:200});
                    } else {
                        responseSender(res,{success:0,msg:'Cannot Be Deleted',statusCode:404});
                    }
                }else{
                    responseSender(res,{success:0,msg:'Unauthorized Access',statusCode:403});
                }
            }   
        } else {
           responseSender(res,{success:0,msg:'Not Found',statusCode:404}); 
        } 
    } catch (error) {
        next(error)
    }
    
}

module.exports = {
    addReaction: addReaction,
    getAllReactions: getAllReactions,
    updateReaction:updateReaction,
    deleteReaction:deleteReaction
};
