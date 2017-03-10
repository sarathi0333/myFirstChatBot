var express = require('express');
var app = express();
var PORT = process.env.PORT

app.get('/', function (req, res) {
  res.send("hello world")
})

app.listen(PORT);
