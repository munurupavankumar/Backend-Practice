const express = require('express');
const app = express();
const userModel = require('./usermodel');

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/create', async(req, res) => {
    const newUser = await userModel.create({
        name: 'Karthik',
        email: 'Karthik@gmail.com',
        age: 21
    });
    res.send(newUser);
});

app.get('/read', async(req, res) => {
    const users = await userModel.find();
    res.send(users);
});

app.get('/update', async(req, res) => {
    const UpdatedUser = await userModel.findOneAndUpdate({name: 'Karthik'}, {age: 22}, {new: true});
    res.send(UpdatedUser);
});

app.get('/delete', async(req, res) => {
    const DeletedUser = await userModel.findOneAndDelete({name: 'Karthik'});
    res.send(DeletedUser);
});





app.listen(3000)