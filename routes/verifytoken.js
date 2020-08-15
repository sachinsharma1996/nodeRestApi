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

module.exports = verifyJWT