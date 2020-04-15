const express = require('express');
const app = express();
const mongoose = require('./db');
// Add the user route
const userRoute = require('./routes/user');
// Add todo route
const todoRoute = require('./routes/todo');

const port = 3012;

app.use('/', userRoute);
app.use('/', todoRoute);
app.get('/', (req, res) => {
    res.send('Welcome!')
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
});