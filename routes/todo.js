const express = require('express');
const TodoModel = require('../models/todo');
const auth = require("../middleware/auth");
const uuid = require('uuid/v4');

const todoRoute = express.Router();

todoRoute.get('/todo', (req, res) => {
    res.send('Todo in!')
})

//This end point helps to create a new todo
todoRoute.post('/create-todo', auth, (req, res) => {
    const todo = req.body;
    console.log('todo', todo)
    const description = todo.description;
    const title = todo.title;
    if(!description){
        return res.status(400).send({
            code: 400,
            error: true,
            message: "Kindly add description to the request body"
        })
    }
   
    if(!title){
        return res.status(400).send({
            code: 400,
            error: true,
            message: "Kindly add title to the request body"
        })
    }
    console.log('new todo', todo);
    const newTodo = { 
        id: uuid(),
        title,
        description,
        completed:false
    };

    TodoModel.create(newTodo)
        .then((data) => {
            console.log('Todo was created successfully', data)
            return res.status(201).send({
                code: 201,
                error: false,
                message: "Todo created successfully",
                data: newTodo
            });
        })
        .catch((error) => {
            console.log('There was an error saving the data', error)
            return res.status(500).send({
                code: 500,
                error: true,
                message: "Internal server error",
            });
        })
    
});

module.exports = todoRoute;