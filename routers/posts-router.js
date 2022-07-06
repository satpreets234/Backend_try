const router=require('express').Router();
const Sequelize=require('../config/config');
const postController=require('../controllers/post-controller');
const {verifyToken}=require('../middleware/middleware-function');
const errorHandler=require('../utils/error-handler');
router.use(verifyToken);

router.get('/:postId',postController.getPost);
router.post('/',postController.addPost);
router.delete('/:id',postController.deletePost);
router.put('/:id',postController.updatePost);
router.get('/',postController.allPosts);
router.all('*',(req,res,next)=>{
    const err=new Error('Invalid Url');
    err.statusCode=404;
    next(err);
})
router.use(errorHandler);
module.exports=router;