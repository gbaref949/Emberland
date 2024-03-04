// const bodyParser = require('body-parser');
// const cors = require('cors');
// const express = require('express');
// const dotenv = require('dotenv');
// const session = require('express-session');
// const mongoose = require('mongoose');
// const passport = require('passport');
// const login = require('./middleware/login.js');
// const passportSetup = require('./config/passportSetup.js');
// const isAuthenticated = require('./middleware/auth.js');
// const path = require('path');
// dotenv.config();
// mongoose.connect(process.env.MONGO_URI);
// passportSetup(passport)


// const app = express();
// app.use(session({secret: process.env.SECRET_KEY, resave: false, saveUninitialized: true,}));
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(cors({ credentials: true, origin: 'http://localhost:5000' }));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: false, limit: 100000, parameterLimit: 20}))

// app.route('/').get((req, res) =>{
//     res.send("Welcome");
// });
// app.post("/login", login);
// app.use('/', require('./routes/people-controller'));
// app.route('/docs').get((req, res) =>{
//     // Import your mongoose model
// }).post((req, res) =>{
//     // Used for creating docs
//     // const {id} = req.body;
//     // var doc = new Model({id: id});
//     // doc.save();
// }).put((req, res) =>{
//     // Used for updating docs
//     // const {id, name} = req.body;
//     // var doc = Model.findOneAndUpdate({id: id}, {$set: {name: name}}, {new: true});
// });

// app.listen(process.env.PORT);

const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config({ path: __dirname + `/.env` });
const connectDB = require("./db/connect");
const port = 5000;

app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// app.get("/", (req, res) => {
// 	res.send("server is working");
// });
app.use('/', require('./routes/people-controller'));

const initServer = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, () => {
			console.log(`Listening on port ${port}`);
		});
	} catch (err) {
		console.log(err);
	}
};
initServer();
