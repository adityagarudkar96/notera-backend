const express = require('express');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth.route');
const noteRoute = require('../src/routes/note.route')
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use('/api/auth', authRoute);
app.use('/api/note', noteRoute);

module.exports = app;