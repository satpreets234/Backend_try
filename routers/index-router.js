const router=require('express').Router();
const Sequelize=require('../config/config');
const express = require('express');
router.use(express.json());
const errorHandler=require('../utils/error-handler');


const userRouter=require('./user-router');
const postRouter=require('./posts-router');
const friendRouter=require('./friends_router');
const reactionRouter=require('./reaction-router');
router.use('/user',userRouter);
router.use('/post',postRouter);
router.use('/friend',friendRouter);
router.use('/reaction',reactionRouter);
router.use(errorHandler);

module.exports=router;