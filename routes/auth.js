const router  = require('express').Router();
const UserModel = require('../models/User');
const bcrypt = require('bcryptjs');
const verifyJWT = require('./verifytoken')
var jwt = require('jsonwebtoken');


router.post('/signup', async (req, res)=>{
    
    const thisUser = await UserModel.User.findOne({email: req.body.email});
    if(thisUser) return res.status(409).json({
        msg: "Email Already Exist" 
    })

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new UserModel.User({
        email: req.body.email,
        password: hashPassword,
        mobile: req.body.mobile
    });
    try {
        const SaveUser = await user.save();
        const jwToken = jwt.sign({'id': SaveUser.id}, process.env.SIGNATURE_TOKEN)
        res.header(
            'jwt-token', jwToken
        ).status(200).json({
            msg: "successfully Signup"
        })
    } catch(error) {
        res.status(500).send(error);
    }
    
});

router.post('/login', async (req, res) =>{

    const thisUser = await UserModel.User.findOne({email: req.body.email});
    if(!thisUser) return res.status(409).json({
        msg: "Email Or Password Is Incorrect" 
    });
    
    const validHash = await bcrypt.compare(req.body.password, thisUser.password);
    if(!validHash) return res.status(409).json({
        msg: "Password Is Incorrect" 
    });
    
    const jwToken = jwt.sign({'id': thisUser.id}, process.env.SIGNATURE_TOKEN)
    res.header('jwt-token', jwToken).send(jwToken)
    res.status(201).json({
        msg: "successfully Login"
    })
    
});

router.get('/otp-verification', async (req, res) =>{

    try {
        const thisUser = await UserModel.User.findOne({_id: req.user.id});
        if(!thisUser) return res.status(409).json({
            msg: "User is Not Exist"
        });
        const UserUtils = new UserModel.UserUtils({
            emailVerificationCode: req.emailVerificationCode,
            mobileVerificationCode: req.mobileVerificationCode
        });
        thisUser.UserUtils.push(UserUtils)
        thisUser.save()

        res.status(200).json({
            msg: "successfully send"
        });
    } catch(error) {
        console.log(error)
        res.status(500).send(error);
    }

});




module.exports = router;