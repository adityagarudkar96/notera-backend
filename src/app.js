const express = require('express');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth.route');
const noteRoute = require('../src/routes/note.route')
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use('/api/auth', authRoute);
app.use('/api/note', noteRoute);

module.exports = app;