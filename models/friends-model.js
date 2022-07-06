const {Model,DataTypes}=require('sequelize');
const sequelize=require('../config/config');

class friendsinfo extends Model{};
friendsinfo.init({
    userId:{type: DataTypes.INTEGER,
        references:{model:'users',key:'id'}},
    friendId: {type: DataTypes.INTEGER,
        references:{model:'users',key:'id'}},
    status:{type: DataTypes.ENUM('0','1'),
  defaultValue:'0'}
  }, {
    sequelize,
    modelName: 'friendsinfo',timestamps:false
  }
)

// friendsinfo.sync({}).then((success)=>{
//     console.log('table created successfully');
// }).catch((error)=>{
//     console.log(error);
// });
module.exports=friendsinfo;