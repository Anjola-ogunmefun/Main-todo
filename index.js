const express = require('express');
const app = express();
const uuid = require('uuid/v4')
const bodyParser = require('body-parser');
const mongoose = require('./db');
const TodoModel = require('./models/todo');
const auth = require("./middleware/auth");

 

const config = require("config");
// const mongoose = require("mongoose");
const usersRoute = require("./routes/user.route");

//use config module to get the privatekey, if no private key set, end the application
if (!config.get("myprivatekey")) {
  console.error("FATAL ERROR: myprivatekey is not defined.");
  process.exit(1);
}

//connect to mongodb
// mongoose
//   .connect(process.env.MONGODB_URI || "mongodb://localhost/nodejsauth", { useNewUrlParser: true })
//   .then(() => console.log("Connected to MongoDB..."))
//   .catch(err => console.error("Could not connect to MongoDB..."));


app.use(express.json());
//use users route for api/users
app.use("/api/users", usersRoute);

const port = process.env.PORT || 3061;
app.listen(port, () => console.log(`Listening on port ${port}...`));






// const port = 3600;

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/home', auth, (req, res) => {
    console.log('welcome!')
    res.send({
        message: `Hi!, welcome to your Todo app`
    })
})



//At this point, all todos are displayed
app.get('/all_todo', auth, (req, res) => {
    
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
app.put('/one_todo', auth, (req, res) => {
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
app.patch('/update', auth, (req, res,) => {
   
         const completed = req.body.completed;
         const title = req.body.title;
         const description = req.body.description;

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



     TodoModel.findOneAndUpdate({id: req.body.id}, params, {new: true} )
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
        app.delete('/delete', auth, (req, res) => {
            if({id: req.body.id == false}){
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





app.listen(port, () => {
    console.log('its happening live!')
})