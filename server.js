const express = require('express'); //this imports the express package
const shortid = require('shortid');

const server = express(); // creates the server
server.use(express.json());

let users = [];

server.post('/api/users', (req, res) => {
    console.log(req.body);
    const person = req.body;
    
    if(!person.name || !person.bio)
        res.status(400).json('{ errorMessage: "Please provide name and bio for the user."');
    else
    {
        person.id = shortid.generate();
        users.push(person);
        res.status(201).json(person);
    }
});

server.get('/api/users', (req, res) => {
    if(!users)
        res.status(404).json(`{ errorMessage: "The users information could not be retrieved."}`);
    else
        res.status(200).json(users);
});

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;

    let person = users.find(user => user.id === id);

    if(person)
        res.status(200).json(person);
    else if(!person)
        res.status(404).json(`{ errorMessage: "The user with the specified ID does not exist."}`);
    else
        res.status(500).json(`{ errorMessage: "The users information could not be retrieved."}`);  
});

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;

    let i = 0;
    let new_users = [];

    for(i; i < users.length; i++)
        if(users[i].id === id) //they should both be strings
            break;

    if(i < users.length) //means you found the id
    {
        for(j = 0; j < users.length - 1; j++)
            if(i !== j)
                new_users.push(users[j]); //create new array w/o user with id

        users = [...new_users];  //Make sure we are copying the data correctly

        res.status(204).json(`{message: "user deleted"}`)
    }
    else if(i >= users.length)
        res.status(404).json({error: `User with ID: ${id} not found`});
    else
        res.status(500).json({error: "The user could not be removed"});
});

server.put('/api/users/:id', (req, res) => {
    console.log(req.body);
    const id = req.params.id;
    const person = req.body;

    let index = users.findIndex(user => user.id === id);
    console.log(index);

    if(index >= 0)
    {   
        if(!person.name || !person.bio)
            res.status(400).json('{ errorMessage: "Please provide name and bio for the user."');
        else
        {
            users[index].name = person.name;
            users[index].bio = person.bio;
            res.status(200).json(users.index);
        }
    }
    else if(index === -1)
        res.status(404).json(`{ errorMessage: "The user with the specified ID does not exist."}`);
    else
        res.status(500).json(`{ errorMessage: "The users information could not be retrieved."}`);
   
});

server.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});