const express = require('express')
const app = express()
const PORT = 3000

let data = {
    name: 'John Doe',
    age: 25,
    location: 'USA'
}

let collection= [data];

//Middleware
app.use(express.json())

console.log('Hello lets help start the server');

//CRUD-method create-post, read-get, update-put, delete-delete

//Type 1- This is for websites
app.get('/', (req, res) => {
    res.send(`
        <body
            style="background-color: lightblue;
            padding: 20px;
            text-align: center;
            font-size: 20px;
            font-family: Arial;">

            <h1>Data</h1>
            <p>${JSON.stringify(collection)}</p>
            <a href="/dashboard">Dashboard</a>
        </body>`) 
})

app.get('/dashboard', (req, res) => {
    res.send(`<body>
            <h1>Welcome to the dashboard</h1>
            <a href="/">Home sweet</a>
            </body>`); 
})

//Type 2- This is for API
app.get('/api/data', (req, res) => {
    res.send(data)
})

app.post('/api/data', (req, res) => {
    const newEntry = req.body
    console.log(newEntry)
    collection.push(newEntry)
    res.sendStatus(201)
})

//for deleting

app.delete('/api/data', (req, res) => {
    collection.pop()
    res.sendStatus(200)
})

app.listen(PORT, ()=> {
    console.log(`Server has started on: ${PORT}`)
})