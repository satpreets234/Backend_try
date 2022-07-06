const router=require('express').Router();
const Sequelize=require('../config/config');
const {verifyToken}=require('../middleware/middleware-function');
const freindsController=require('../controllers/friends-controller');
const errorHandler=require('../utils/error-handler');

router.use(verifyToken);
router.get('/:id',freindsController.getFriendDetails);
router.post('/:friendId',freindsController.addFriend);
router.delete('/:friendId',freindsController.cancelFriend);
router.put('/:userId',freindsController.acceptFriendRequest);
router.get('/sentrequests',freindsController.viewSentRequests);
router.get('/comingRequests',freindsController.viewComingRequests);
router.all('*',(req,res,next)=>{
    const err=new Error('Invalid Url');
    err.statusCode=404;
    next(err);
})
router.use(errorHandler);
module.exports=router;