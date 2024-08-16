const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User  = require("./models/user");


passport.use(new LocalStrategy(async(USERNAME,password,done)=>{
    //aunthentication logic here
    try{
      //console.log('Received credentials :', USERNAME,password );
      const user = await User.findOne({username:USERNAME});
      if(!user)
        return done(null,false,{message:'Incorrect username'});
  
      const isPasswordMatch = await user.comparePassword(password);
      if(isPasswordMatch){
        return done(null,user);
      }else{
        return done(null,false,{message:' Incorrect password . '});
      }
  
    }catch(err){
     return done(err);
      }
  }));

  
  module.exports = passport;