const express = require('express');
const app = express();
const routes = require('./routes/routes');
const db = require('./db/query');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bearerToken = require('express-bearer-token');
const port = 5000;

db.init();

const basicPath = '/api/v1'

// Apply middlewares
app.use(cookieParser());
app.use(bearerToken());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(basicPath,routes);

app.use((req, res) => res.status(404).send('Not Found'));

app.listen(port,()=> console.log(`Connected to ${port}`))