var PouchDB = require('pouchdb');
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: true, methods: 'GET,PUT,POST,OPTIONS,DELETE', allowedHeaders: 'Content-Type,Authorization' }));

app.use(function (req, res, next) {
    // console.log(req)
    console.log(req.method, req.url, req.body, '\n');
    next();
});

// app.use('/db', require('express-pouchdb')(PouchDB));
app.use('/', require('express-pouchdb')(PouchDB));

app.listen(3005);