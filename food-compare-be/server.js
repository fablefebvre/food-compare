'use strict'

const express = require('express')
const morgan = require('morgan')
const path = require('path')
const  mongodb = require('mongodb')
const bodyParser = require('body-parser')
const offSortRoutes = require('./app/Routes')

const DB_URL = 'mongodb://192.168.0.27:27017/off';
const APP_PORT = 4000;
const DB = 'off';
const PRODUCTS = 'products';

const app = express()


// Require configuration file defined in app/config.js

// Connect to database
mongodb.MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(client =>{
const db = client.db(DB);
const products = db.collection(PRODUCTS);

// Sends static files  from the public path directory
app.use(express.static(path.join(__dirname, '/public')))

// Use morgan to log request in dev mode
app.use(morgan('dev'))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended: true}))

let port = APP_PORT || 4000;

app.locals.products = products;

app.listen(port) // Listen on port defined in config file

console.log('App listening on port ' + port)

app.use(function (req, res, next) {
    // Website you wish to allow to connect
  //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081')

    // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

    // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

    // Pass to next layer of middleware
  next()
})

//  Use routes defined in Route.js and prefix it with api
app.use('/api', offSortRoutes)
}).catch(error => console.error(error));
