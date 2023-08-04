require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const route = require('./src/route/index')
const cors = require('cors')

const app = express();
app.use(cors())


const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use('/api', route)

app.listen(PORT, function(err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", PORT);
});
