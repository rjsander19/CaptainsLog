// Dependencies
const express = require('express');
const mongoose = require("mongoose")
const Log = require('./models/logs')

const methodOverride = require("method-override");

const { findOneAndUpdate } = require('./models/logs');

const app = express();

require('dotenv').config();

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

// Database Connection
mongoose.connect(process.env.DATABASE_URL)

// Database Connection Error/Success
// Define callback functions for various events
const db = mongoose.connection
db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

// Middleware
// Body parser middleware: give us access to req.body
app.use(methodOverride("_method"))
app.use(express.urlencoded({ extended: false }));



//INDUCES

// Index
app.get('/logs', async (req, res) => {
    const allLogs = await Log.find({})
    res.render('index.ejs', {
      logs: allLogs
    });
  });


// New
app.get('/logs/new', (req, res) => {
    res.render('new.ejs')
  })


// Delete
app.delete('/logs/:id', async (req, res) => {
    await Log.findByIdAndRemove(req.params.id,)
    res.redirect('/logs')
  })


// U is for UPDATE
app.put("/logs/:id", async (req, res) => {
    if (req.body.completed === "on") {
      req.body.completed = true
    } else {
      req.body.completed = false
    } await Log.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
       
      )
      res.redirect(`/logs/${req.params.id}`)

  })


// C is for CREATE
app.post('/logs', (req,res) => {
    if (req.body.completed === 'on') {
		//if checked, req.body.completed is set to 'on'
		req.body.completed = true;
	} else {
		//if not checked, req.body.completed is undefined
		req.body.completed = false;
	}
    const createdLog = new Log(req.body)
    createdLog.save().then(res.redirect('/logs'))
    
})


// Edit
app.get("/logs/:id/edit", async (req, res) => {
    let foundLog = await Log.findById(req.params.id)
      res.render("edit.ejs", {
        log: foundLog,
      })
    })
  

  // Show
  app.get('/logs/:id', async (req, res) => {
	const foundLog = await Log.findById(req.params.id).exec()
    res.render('show.ejs', {
        log: foundLog,
    });
}); 


// Listener
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server is listening on port: ${PORT}`));