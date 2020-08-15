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
        password: hashPassword
    });
    try {
        const SaveUser = await user.save();
        res.status(200).json({
            _id: SaveUser.id,
            msg: "successfully added"
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
    
    const validhash = await bcrypt.compare(req.body.password, thisUser.password);
    if(!validhash) return res.status(409).json({
        msg: "Password Is Incorrect" 
    });
    
    const jwToken = jwt.sign({'id': thisUser.id}, process.env.SIGNATURE_TOKEN)
    res.header('jwt-token', jwToken).send(jwToken)
    
});

router.get('/profile', verifyJWT, async (req, res) =>{
    
    const thisUser = await UserModel.User.findOne({_id: req.user.id});
    if(!thisUser) return res.status(409).json({
        msg: "User is Not Exist" 
    });
    
    res.status(200).json({
        firstName: thisUser.firstName,
        lastName: thisUser.lastName,
        email: thisUser.email
    })
    
});

router.put('/profile', verifyJWT, async (req, res) =>{
    
    const thisUser = await UserModel.User.findOne({_id: req.user.id});
    try {
        thisUser.firstName = req.body.firstName;
        thisUser.lastName = req.body.lastName;
        thisUser.save()
        res.status(200).json({
            msg: "successfully Updated"
        });
    }
    catch (error) {
        res.status(200).json({
            error: error
        });
    }
    
});


module.exports = router;