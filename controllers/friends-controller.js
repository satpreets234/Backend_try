const Sequelize = require('../config/config');
const { sequelize, DataTypes, Op } = require('sequelize')
const freinds = require('../models/friends-model');
const users = require('../models/user-model');
const errorHandler=require('../utils/error-handler');

async function getFriendDetails(req, res) {
    const friendId = req.params.id;
    const friendDetails = await users.findOne({ where: { id: friendId },attributes:{exclude:['password','id']} });
    if(friendDetails){
        res.send(friendDetails);
    }
    else{
        res.json({'msg':'User Not Found'});
    }
}

async function addFriend(req, res,next) {
    try {
        const friendId = req.params.friendId;
        const userId = req.loggedUser.id;
        if (userId != friendId) {
            const comingRequest=await freinds.findOne({where:{friendId:userId,userId:friendId,status:'0'}});
            const sentRequest=await freinds.findOne({where:{userId:userId,friendId:friendId,status:'0'}});
            if (sentRequest) {
                res.json({ 'msg': 'Already requested' });  
            }else if(comingRequest){
                res.json({'msg':'Already in Your pending requests'})
            }
             else {
                const requestFriend = await freinds.create({ userId: userId, friendId: friendId });
                if (requestFriend) {
                    res.json({ 'msg': 'friend request sent successfully' })
                }
            }
        }
        else {
            res.json({ 'msg': 'Functionality Impossible' });
        }
    } catch (error) {
        next(error)
    }
}

async function cancelFriend(req, res,next) {
    try {
        const friendId = req.params.friendId;
        const userId = req.loggedUser.id;
        if (userId != friendId) {
            const friendStatus = await freinds.findOne({ where: { userId: userId, friendId: friendId } });
            const deleteFriend = await freinds.destroy({ where: { userId: userId, friendId: friendId } });
            if (friendStatus == '0' && deleteFriend) {
                res.json({ 'msg': 'friend request cancelled ' })
            }
            else if (friendStatus == '1' && deleteFriend) {
                res.json({ 'msg': 'unfriend successful' });
            }
        }
        else {
            res.json({ 'msg': 'functionality impossible' });
        }
    } catch (error) {
        next(error)
    }
}

async function acceptFriendRequest(req, res,next) {
    try {
        const userId = req.params.userId;
        const friendId = req.loggedUser.id;
        if (userId != friendId) {
            const friendRequest = await freinds.findOne({ where: { friendId: friendId, userId: userId } });
            if (friendRequest) {
                const acceptRequest = await freinds.update({ status: '1' }, { where: { friendId: friendId, userId: userId } });
                if (acceptRequest) {
                    res.json({ 'msg': 'friend Request Accepted' })
                }
            } else {
                res.json({ 'msg': 'No Pending Friend Requests' })
            }
        }
        else {
            res.json({ 'msg': 'Functionality Impossible' })
        }
    } catch (error) {
        next(error)
    }
}


async function viewSentRequests(req, res,next) {
    const userId = req.loggedUser.id;
    const allSentRequests = await freinds.findAll({ include: users, where: { userId: userId, status: '0' } });
    console.log(allSentRequests);
    if (allSentRequests.length != 0) {
        res.send(allSentRequests);
    }
    else {
        res.json({ 'msg': 'No Sent Requests' })
    }
}

async function viewComingRequests(req, res,next) {
    try {
        const friendId = req.loggedUser.id;
        const allComingRequests = await freinds.findAll({
            include: { model: users, attributes: { exclude: ['password', 'age', 'id'] } },
            where: { friendId: friendId, status: '0' }, attributes: { exclude: ['id'] }
        });
        // console.log(allComingRequests);
        if (allComingRequests.length != 0) {
            res.send(allComingRequests);
        }
        else {
            res.json({ 'msg': 'No Incoming Requests' })
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getFriendDetails: getFriendDetails,
    cancelFriend: cancelFriend,
    addFriend: addFriend,
    acceptFriendRequest: acceptFriendRequest,
    viewSentRequests: viewSentRequests,
    viewComingRequests: viewComingRequests
};