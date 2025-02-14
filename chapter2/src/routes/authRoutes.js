import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';


const router = express.Router();

// Register a new user endpoint /auth/register
router.post('/register', async (req, res) => {
    const {username,password} = req.body;
    //enctypt password
    const hashedPassword = bcrypt.hashSync(password, 8);
    //save the user to the database
    try{
        const insertUser = db.prepare(`INSERT INTO user (username, password) VALUES (?,?)`);
        const result = insertUser.run(username,hashedPassword);
        
        //default todo list
        const defaultTodo = `Hello ! Welcome to your todo list!`;
        const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?,?)`);
        insertTodo.run(result.lastInsertRowid,defaultTodo);

        //create a token
        const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET,{expiresIn: '24h'})
        res.json({token})
    }catch(err){
        console.log(err.message);
        return res.sendStatus(503);
    }
});

router.post('/login', async (req, res) => {
    const{username,password} = req.body;
    try{

        //getting user from database
        const getUser = db.prepare(`SELECT * FROM user Where username = ?`)
        const user = getUser.get(username)

        //user not registered
        if(!user){return res.status(404).send({message: "User not found!"})}
        
        //decrypting password
        const passwordIsValid = bcrypt.compareSync(password,user.password)
    
        //password is not correct
        if(!passwordIsValid){return res.status(401).send({message: "Invalid Password"})}

        console.log(user)
        //successful authentication
        const token = jwt.sign({id: user.id},process.env.JWT_SECRET,{expiresIn: '24h'})
        res.json({token})
    }catch(err){
        console.log(err.message);
        return res.sendStatus(503);
    }
});

export default router;