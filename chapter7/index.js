const express = require('express');
const app = express(); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.get('/', (req, res) => {
   let token = jwt.sign({email: "hinu@gmail.com"},"secretkey")
   res.cookie('token', token);
   res.send('done');
});

app.get('/read', (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, 'secretkey');
    console.log(decoded);
    res.send('done');
});

app.listen(3000);