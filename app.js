require("dotenv").config();              //.env config code
require('./config/database').connect();
const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
const app = express();
app.use(express.json()); // middleware to show json results
const User = require("./model/user"); // line of code to write moongoose query to identify if userexist or not

app.get("/", (req, res) => {
  res.send("<h1>This is Auth System Application</h1>");
});

app.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

  if (!(firstname && lastname && email && password)) {
    res.status(400).send("All fields are required");
  }

  const UserExist = await User.findOne({ email }); //findone() method to identify if email exist or not

  if (UserExist) {
    res.status(401).send("User already exist");
  }

  const myEncpassword = await bcrypt.hash(password , 10);

   const user = await User.create({
    firstname,
    lastname,
    email:email.toLowerCase(),
    password: myEncpassword
  })


  //Token creation part

  const token = jwt.sign(
    {user_id : user._id , email},
    process.env.SECRET_KEY ,
    {
      expiresIn : "1h"
    }
  )

  user.token = token
  res.status(201).json(user)


  } catch (error) {
    console.log(error);
  }
});

app.post('/login' , async(req,res) => {
  try {
    const {email , password} = req.body;

    if(!(email && password)){
      console.log("Field is missing");
    }

    const user = await User.findOne({email});

    if(user && (await bcrypt.compare(password , user.password))){
      const token = jwt.sign(
        {user_id: user._id},
        process.env.SECRET_KEY,
        {
          expiresIn: "1h"
        }
      )
      user.token = token;
      res.status(200).json(user);
    }

    res.status(400).send("Email or password is incorrect ")


  } catch (error) {
    console.log(error);
  }
});

app.get('/dashboard' , auth ,  (req,res)=> {
  res.status(400).send("This is information after succesfull signin");
})

module.exports = app;



