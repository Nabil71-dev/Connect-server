const jwt=require('jsonwebtoken');

const checkLogin = (req, res, next) => {
    const { authorization } = req.headers;
    try {
        const token = authorization.split(' ')[1]
        const decoded=jwt.verify(token,process.env.JWT_Secret)
        const {user_mail}=decoded
        req.user_mail=user_mail
        next();
    } catch {
        next("Authorization error!");
    }
}

module.exports = checkLogin;