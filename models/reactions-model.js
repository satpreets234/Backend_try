const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const post = require('./post-model');

class reactions extends Model { };
reactions.init({
    userId: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'id' }
    },
    postId: {
        type: DataTypes.INTEGER,
        references: { model: 'posts', key: 'id' }
    },
    reactionType: { type: DataTypes.ENUM('text', 'vote', 'emoji') },
    reactionData:{type:DataTypes.STRING},
    parentId:{
        type:DataTypes.INTEGER,
        references:{model:'reactions',key:'id'},
        allowNull:true,
        defaultValue:null
    }
}, {
    sequelize, timestamps: false
});


// reactions.sync({alter:true}).then((success)=>{
//     console.log('table synced successfully');
// }).catch((error)=>{
//     console.log(error);
// });
module.exports = reactions;
