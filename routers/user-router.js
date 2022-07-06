const router=require('express').Router();
const Sequelize=require('../config/config');
const userController=require('../controllers/user-controller');
const {verifyToken,userValidate}=require('../middleware/middleware-function');
const errorHandler=require('../utils/error-handler');

router.get('/',userController.login);
router.post('/',userValidate,userController.createUser);

router.use(verifyToken);

router.put('/:id',userController.updateUser);
router.delete('/:id',userController.deleteUser);
router.all('*',(req,res,next)=>{
    const err=new Error('Invalid Url');
    err.statusCode=404;
    next(err);
})
router.use(errorHandler);
module.exports=router;