const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const path = require('path');
const userModel = require('./models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/create',(req, res) => {
    let { username, email, age, password } = req.body;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let user = await userModel.create({
                username,
                email,
                age,
                password: hash
            });

            let token = jwt.sign({email: user.email}, "shikhar");
            res.cookie('token', token);

            res.send(user);
        });
    });
});

app.get('/login', async (req, res) => {
    res.render('login');
});

app.post('/login', async (req,res) => {
    let user = await userModel.findOne({email: req.body.email});
    if(!user) return res.send("email or password are incorrect");

    bcrypt.compare(req.body.password, user.password, function(err,result){
       if(result){
        let token = jwt.sign({email: user.email}, "shikhar");
        res.cookie('token', token);
        res.send("yes you can login");
       } 
        else res.send("email or password are incorrect");
    })
})

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

app.listen(3000);