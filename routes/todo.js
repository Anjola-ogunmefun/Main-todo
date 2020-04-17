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

//At this point, all todos are displayed
todoRoute.get('/all-todo', auth, (req, res) => {
    
    TodoModel.find()
    .then((data) => {
        console.log('All todos have been fetched', data)
        return res.status(201).send({
            code: 201,
            error: false,
            message: "Here is a list of todos you have created",
            data
        });
    })
    .catch((error) => {
        console.log('There was an error fetching all todos', error)
        return res.status(500).send({
            code: 500,
            error: true,
            message: "Internal server error",
        });
    })
    
})


//This point returns a particular todo by id
todoRoute.get('/one-todo', auth, (req, res) => {
    const id = req.body.id
    if(!id){
        return res.status(400).send({
            code: 400,
            error: true,
            message: "Kindly add id to the request body"
        })
    }

    TodoModel.findOne({id: req.body.id})
    .then((data) => {
        console.log("Todo has been found" , data)
        return res.status(201).send({
            code: 201,
            error: false,
            message: "Here is the todo you requested to find",
            data
        });
    })
    .catch((error) => {
        console.log('There was an error fetching todo', error)
        return res.status(500).send({
            code: 500,
            error: true,
            message: "Internal server error",
        });
    })

})


//An extension of one_todo witch doesnt just get but also updates
todoRoute.patch('/update', auth, (req, res,) => {
   
    const completed = req.body.completed;
    const title = req.body.title;
    const description = req.body.description;
    const id = req.body.id

  let params ={};

  if(completed){
      params.completed = completed
  }
    if(title){
       params.title = title
    }
    if(description){
        params.description = description
    }

    if(!id){
       return res.status(400).send({
           code: 400,
           error: true,
           message: "Kindly add id to the request body"
       })
   }

    // if(!params){
    //    return res.status(400).send({
    //         code: 400,
    //         error:true,
    //         message:"kindly input an update"
    //     })
    // }

TodoModel.findOneAndUpdate({id:req.body.id}, params, {new: true} )
   .then((data) => {
        console.log("Todo has been updated" , data)
       return res.status(200).send({
        code: 200,
        error: false,
        message: "Todo updated successful!",
        data
        });
       
   })
       .catch((error) => {
           console.log('There was an error updating todo', error)
           return res.status(500).send({
               code: 500,
               error: true,
               message: "Internal server error",
           });
       })
    
    })
// This guy right here deletes a todo from the database
    todoRoute.delete('/delete-one', auth, (req, res) => {
    if(!{id: req.body.id}){
        console.log('Todo is missing');
        return res.status(205).send({
            code: 205,
            error: true,
            message: "Todo does not exist!"
        })
    };

    TodoModel.findOneAndDelete({id: req.body.id})
    .then((data) => {
        console.log("Todo has been deleted" , data)
       return res.status(200).send({
        code: 200,
        error: false,
        message: "Todo has been deleted successfully!",
        data
        });
   })

   .catch((error) => {
    console.log('There was an error deleting todo', error)
    return res.status(500).send({
        code: 500,
        error: true,
        message: "Internal server error",
    });
})
})


module.exports = todoRoute;