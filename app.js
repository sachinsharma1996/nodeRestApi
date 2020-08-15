const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv/config');

// intaliaze app
const app = express();

// import router
const authRoute = require('./routes/auth')

// route middleware
app.use(bodyParser.json());
app.use('/api/user', authRoute);

// Connect to db
mongoose.connect(process.env.MONGODB_URI, {useUnifiedTopology: true}, (error) => {

    if(error)
    {
        console.error("unable to connect to srver");
    }
    else
    console.error("db connection successfssully");
    
});


// Listen app
app.listen('5000');
