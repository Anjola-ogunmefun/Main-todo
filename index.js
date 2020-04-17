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



    


        

        





app.listen(port, () => {
    console.log('its happening live!')
})