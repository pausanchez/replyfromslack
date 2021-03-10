const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

const port = process.env.PORT || 80;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({limit: '50mb'}));

//import routes
const routes = require('./routes');

//use imported routes
app.use('/', routes);

//TODO remove static route on production
app.use('/tmp', express.static(path.join(__dirname, './tmp')));

//Listening
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})





