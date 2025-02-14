const express = require('express');
const app = express();
const path = require('path');
const userModel = require('./models/user');
const mongoose = require('mongoose');

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});


app.post('/create', async(req, res) => {
    let { name, email, image } = req.body;
    let createdUser = await userModel.create({
        name,
        email,
        image
    })

    res.redirect('/read');
});

app.get('/read', async(req, res) => {
    let users= await userModel.find();
    res.render('read', {users});
  });

app.get('/edit/:id', async (req, res) => {
    let user = await userModel.findOne({_id: req.params.id})
    res.render('edit', {user});
});

app.post('/update/:id', async (req, res) => {
    try {
        const { name, email, image } = req.body;
        await userModel.findByIdAndUpdate(
            req.params.id, 
            { name, email, image },
            { new: true }
        );
        res.redirect('/read');
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).send('Error updating user');
    }
});

app.get('/delete/:id', async (req, res) => {
        const users = await userModel.findOneAndDelete({_id: req.params.id});
        res.redirect('/read');
});

app.listen(3000)