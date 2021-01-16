var jwt = require('jsonwebtoken');

function verifyJWT(req, res, next){
    const token = req.header('jwt-token')
    if(!token) return res.status(401).json({
        msg: "Access Denied"
    }); 
    
    try {
        verifyToken = jwt.verify(token, process.env.SIGNATURE_TOKEN);
        req.user = verifyToken;
    }
    catch (error) {
        res.status(500).json({
            msg: "Invalid jwt token"
        });
    }
    next();
};

function randomCode(req, res, next){
    req.emailVerificationCode = Math.floor(100000 + Math.random() * 900000);
    req.mobileVerificationCode = Math.floor(100000 + Math.random() * 900000);
    next();
};
module.exports = {
    verifyJWT: verifyJWT,
    Code: randomCode
}
module.exports = verifyJWT