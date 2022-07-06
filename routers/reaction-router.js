const router=require('express').Router();
const Sequelize=require('../config/config');
const {verifyToken,reactionValidate}=require('../middleware/middleware-function');
const reactionController=require('../controllers/reaction-controller');

const errorHandler=require('../utils/error-handler');
// router.get('/addreaction/:postid',middlewareFunction.verifyToken,)
router.use(verifyToken);
router.get('/:postid',reactionController.getAllReactions);
router.post('/:postId/',reactionValidate,reactionController.addReaction);
router.put('/:reactionId',reactionController.updateReaction);
router.delete('/:reactionId',reactionController.deleteReaction);
router.all('*',(req,res,next)=>{
    const err=new Error('Invalid Url');
    err.statusCode=404;
    next(err);
})
router.use(errorHandler);
module.exports=router;