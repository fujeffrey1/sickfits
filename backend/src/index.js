require('dotenv').config();
const createServer = require('./createServer');
const db = require('./db');
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const server = createServer();
const app = express();

app.use(cookieParser());
app.use((req, res, next) => {
    const { token } = req.cookies;
    if (token) {
        const { userId } = jwt.verify(token, process.env.APP_SECRET);
        req.userId = userId;
    }
    next();
});
app.use(async (req, res, next) => {
    if (req.userId) {
        const user = await db.query.user({ where: { id: req.userId } }, '{ id, permissions, email, name }');
        req.user = user;
    }
    next();
});

server.applyMiddleware({
    app,
    path: '/',
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
});

app.listen({ port: process.env.PORT }, () =>
    console.log(`🚀  Server ready at http://localhost:4444${server.graphqlPath}`)
);
