'use strict';

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {type: DataTypes.STRING,
            unique:true,
             allowNull: false},
    password_hash: DataTypes.STRING,
    password: DataTypes.VIRTUAL
  }, {});

 User.login = function(email,password){
   //Buscar al usuario
   return User.findOne({
     where: {
       email: email
     }
   }).then(user=>{
   if (!user) return null;
     return user.authenticatePassword(password).then(valid=> valid ? user : null);
   });
 };

  User.prototype.authenticatePassword = function (password) {
    return new Promise((res,rej)=>{
      bcrypt.compare(password,this.password_hash,function(err,valid){
        if(err) return rej(err);
        res(valid);
      })
    })

  };

  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Task,{
      as:'tasks'
    });

  };
  User.beforeCreate(function(user,option){

return new Promise(function(resolve, reject) {
  if (user.password) {
    bcrypt.hash(user.password,10, function(error,hash){
  user.password_hash=hash;
  resolve();
  })
};
});



  });
  return User;
};
