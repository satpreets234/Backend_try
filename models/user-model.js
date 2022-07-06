const {Model,DataTypes}=require('sequelize');
const sequelize=require('../config/config');
const post = require('./post-model');
const friends=require('./friends-model');


class user extends Model{};

user.init({
    username: {type:DataTypes.STRING},
    profession: {type:DataTypes.STRING},
    age:{type: DataTypes.INTEGER},
    password:{type: DataTypes.STRING},
    email:{type:DataTypes.STRING}
},{
    timestamps:false,sequelize
})

// user.sync({alter:true}).then((success)=>{
//     console.log('table created successfully');
// }).catch((error)=>{
//     console.log(error);
// });

user.hasMany(post,{foreignKey:"userId"});
post.belongsTo(user,{foreignKey:'userId'})
user.hasMany(friends,{foreignKey:'userId'});
user.hasMany(friends,{foreignKey:'friendId'});
friends.belongsTo(user,{foreignKey:'userId'})
friends.belongsTo(user,{foreignKey:'friendId'});


module.exports=user;