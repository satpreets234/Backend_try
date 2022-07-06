const post = require('../models/post-model');
const universalFunction = require('../lib/universal-function');
const middleware = require('../middleware/middleware-function');
const reaction= require('../models/reactions-model');
const user = require('../models/user-model');


async function getPost(req,res){
    const postId=req.params.postId;
    const postDetails=await post.findOne({include:{model:user,attributes:{exclude:['password','email']}}
    ,attributes:{exclude:['id','userId']},where:{id:postId}});
    if(postDetails){
        const comments=await universalFunction.getAllComments(postId);
        const reactions=await universalFunction.getAllReactions(postId);
        res.send({postDetails:postDetails,comments:comments,reactions:reactions});
    }else{
        res.json({'msg':'Post Not Found'})
    }
}


async function addPost(req,res){
    const user=req.loggedUser.toJSON();
    const description=req.body.description||null;
    const imagePath=req.body.imagePath||null;
   const {error,value}=postValidator.validate({userId:user.id,description:description,imagePath:imagePath});
   if(error){
    res.send('Error occured'+error)
   }
   else{
    const newPost=await post.create({imagePath:imagePath,description:description,userId:user.id});
    res.send(newPost);
   }
}

async function deletePost(req,res){
    const postId=req.params.id;
    console.log(postId);
    const deleteAccess=await post.findOne({where:{id:postId}});
    if(deleteAccess.userId==req.loggedUser.id){
        const deletedPost=await post.destroy({where:{id:postId}});
        res.send('post deleted successfully')
    }
    else{
        res.status(404).json('Unauthorized Access');
    }
}

async function updatePost(req,res){
    const id=req.params.id;
    const updateAccess=await post.findOne({where:{id:id}});
    if(updateAccess.userId==req.loggedUser.id){
        const updatedPost=await post.update(req.body,{where:{id:id}});
        res.send({"msg":'post updated successfully',updatedPost:updatedPost})
    }
    else{
        res.status(404).json('Unauthorized Access');
    }
}

async function allPosts(req,res){
    const userId=req.loggedUser.id;
    const allPosts=await post.findAll({include:{model:user,attributes:{exclude:['password','email']}}
    ,attributes:{exclude:['id','userId']},where:{userId:userId}});
    if (allPosts) {
        res.send(allPosts);
    } else {
        res.json({'msg':'Add your first image now'});
    }   
}
module.exports={getPost:getPost,
addPost:addPost,deletePost:deletePost,updatePost:updatePost,allPosts:allPosts};