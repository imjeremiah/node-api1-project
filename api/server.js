// BUILD YOUR SERVER HERE
const express = require('express');
const User = require('./users/model');

const server = express();

server.use(express.json());

server.post('/api/users', (req,res) => {
    const newUser = req.body;
    User.insert(newUser)
        .then(user => {
            user.name && user.bio ? res.status(201).json(user) : res.status(400).json({ message: "Please provide name and bio for the user" }) 
        })
        .catch(() => {
            res.status(500).json({ message: "There was an error while saving the user to the database" });
        })
});

server.get('/api/users', (req, res) => {
    User.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "The users information could not be retrieved" });
        })
});

server.get('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            user ? res.status(200).json(user) : res.status(404).json({ message: "The user with the specified ID does not exist"  })
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "The user information could not be retrieved" });
        })
});

server.delete('/api/users/:id', (req, res) => {
    User.remove(req.params.id)
        .then(user => {
            user ? res.status(200).json(user) : res.status(404).json({ message: "The user with the specified ID does not exist" });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "The user could not be removed" });
        })
});

server.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, bio } = req.body;
    const updatedUser = await User.update(id, { name, bio });
    try {
        name && bio ? (updatedUser ? res.status(200).json(updatedUser) : res.status(404).json({ message: "The user with the specified ID does not exist" })) : res.status(400).json({ message: "Please provide name and bio for the user" });
    } catch {
        res.status(500).json({ message: "The user information could not be modified" });
    }
});

module.exports = server; // EXPORT YOUR SERVER instead of {}
