/**
 * We used this https://github.com/eleith/emailjs
 * For sending emails
 */


const email     = require("emailjs");

// Server config
const server    = email.server.connect({
    user:       "mindfulness.beheerder@gmail.com",
    password:   process.env.EMAIL_PASSWORD,
    host:       "smtp.gmail.com",
    tls:        {ciphers: "SSLv3"}
});

module.exports = server;