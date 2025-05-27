const session = require('express-session');
const fileStore = require('session-file-store')(session);

const sessionConfig = session({
    secret: "jgs8888",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 10, // 10분
        httpOnly: true,
    },
    store: new fileStore(),
});

module.exports = sessionConfig;
