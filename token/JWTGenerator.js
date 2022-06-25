const jwt= require('jsonwebtoken');

const generateJWT=(mail)=>{
   const token=jwt.sign({
       user_mail:mail
   },process.env.JWT_Secret,{
       expiresIn:'1 day'
   })

   return token;
}
module.exports=generateJWT;