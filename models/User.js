mongoose = require('mongoose');

const Schema = mongoose.Schema;

var UserUtilsSchema = new Schema({
    emailVerificationCode: {
        type: Number,
        required: true,
        unique: true,
        validate: {
            validator : Number.isInteger,
            message   : '{VALUE} is not an integer value'
        }
    },
    mobileVerificationCode: {
        type: Number,
        required: true,
        unique: true,
        validate: {
            validator : Number.isInteger,
            message   : '{VALUE} is not an integer value'
        }
    }
})

const UserSchema = new Schema({
    email: {
        type: String,
        unique : true,
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    UserUtils: [UserUtilsSchema],
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date
    }
})

module.exports.User = mongoose.model('User', UserSchema)
module.exports.UserUtils = mongoose.model('UserUtils', UserUtilsSchema)
