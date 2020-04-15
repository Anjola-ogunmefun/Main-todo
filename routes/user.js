const express = require('express');
const { User, validate } = require("../models/user.model");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const bodyParser = require('body-parser')
 
const userRoute = express.Router();
// parse application/x-www-form-urlencoded
userRoute.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
userRoute.use(bodyParser.json())


userRoute.get('/check', (req, res) => {
    res.send('Logged in!')
})

userRoute.post("/login", async (req, res) => {
    //const {email, password, name} = req.body;
    // if(!email || !password || !name){
    //     return res.status(400).send({
    //         code: 400,
    //         error: true,
    //         message: "Kindly add name, password and email to the request body"
    //     })
    // }
    // validate the request body first
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    //find an existing user
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered.");
  
    user = new User({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email
    });
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
  
    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send({
      _id: user._id,
      name: user.name,
      email: user.email
    });
  });

module.exports = userRoute;