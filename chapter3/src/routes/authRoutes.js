import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';


const router = express.Router();

// Register a new user endpoint /auth/register
router.post('/register', async (req, res) => {
    const {username,password} = req.body;
    //enctypt password
    const hashedPassword = bcrypt.hashSync(password, 8);
    //save the user to the database
    try{
       const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        });
        //default todo list
        const defaultTodo = `Hello ! Welcome to your todo list!`;
        await prisma.todo.create({
            data: {
                task: defaultTodo,
                userId: user.id
            }
        });
        //create a token
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET,{expiresIn: '24h'})
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
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        });

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