var express = require('express');
var app = express();
<<<<<<< HEAD
var PORT = process.env.PORT || 3000;
=======
var PORT = process.env.PORT
>>>>>>> 5d3b8126c0d6c73f9bcf35f69c40a7d8ff6cf9e9

app.get('/', function (req, res) {
  res.send("hello world")
})

app.listen(PORT);
