const {Model,DataTypes}=require('sequelize');
const sequelize=require('../config/config');
const reactions = require('./reactions-model');
const user=require('./user-model');

class post extends Model{};

post.init({
    userId:{type: DataTypes.INTEGER,
    references:{model:'users',key:'id'}},
    imagePath: {type:DataTypes.STRING,
    allowNull:true},
    description: {type:DataTypes.STRING,allowNull:true}
  }, {
    sequelize,
    modelName: 'post',timestamps:false
  }
);

post.hasMany(reactions,{foreignKey:'postId'});
reactions.belongsTo(post,{foreignKey:'postId'});

// post.sync({alter:true}).then((success)=>{
//     console.log('table created successfully');
// }).catch((error)=>{
//     console.log(error);
// });


module.exports=post;