const express = require('express');
const app = express();

const userModel = require("./models/user");
const postModel = require("./models/post")

app.get("/",(req,res)=>{

    res.send("hey");

})

app.get("/create", async (req,res)=>{
    let user = await userModel.create({
        username: "pavan",
        age: 21,
        email: "pavan@gmail.com"
    });

    res.send(user);
})

app.get("/post/create",async(req,res)=>{
    let post = await postModel.create({
        postdata: "hello how are you",
        user: "67aed243cbd2e1181735e0e1"
    })

    let user = await userModel.findOne({_id: "67aed243cbd2e1181735e0e1"})
    user.posts.push(post._id)
    await user.save();

    res.send({post,user});
})

app.listen(3000);