'use strict';
// const express = require('express');

const app = require('express')(),
    config = require('./config/config');

// Express conf !
require('./config/express.config')(app);

// Mongoose Conf !
require('./config/mongoose.config')(config);





// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.listen(config.dev.port, () => {
    console.log("Listening ..");
});