var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var PORT = process.env.PORT || 3000;

var access_token = 'EAAFdYj6cQ9IBALbWR4Vp7msZCrXNZBWgUsK1qkZBww08CWd3b1aRyILCtL43516mtJZAyW7q4iedJd89UrT0HEZAQQDnd4vWJUZCWrB9rPr7KD8iplTJbKIRXbsQZCxmDMQZAZAq1IWdvKWrdjCSMtmE4lLmYxcvWr9wq5pleTCiCzQZDZD';

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send("hello world")
});

app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'abc123') {
      res.send(req.query['hub.challenge']);
    } else {
      res.send('Error, wrong validation token');    
    }
  });

app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});
  
function receivedMessage(event) {
  // Putting a stub for now, we'll expand it in the following steps
  console.log("Message data: ", event.message);
}

// curl -X POST "https://graph.facebook.com/v2.8/me/subscribed_apps?access_token=access_token"


app.listen(PORT);
