var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var PAGE_ACCESS_TOKEN = 'EAAFdYj6cQ9IBAIwmhdw73Fx1DZAKEsJpd2144Wg4sk5PlzKGqkH7Pf1vi1zLsbH9CWwaxUFL0bqYAoFdhs0i28N9SpZA3dqH2kk6nbJgi87lu0dgNj23bxOXHtPeclXu3bW5XdQmkTFRYTcj5ZCZAhVyyyjY9gZCpNOVXCZB2AXgZDZD';

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
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:", 
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    switch (messageText) {
      case 'generic':
        sendGenericMessage(senderID);
        break;

      default:
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function sendGenericMessage(recipientId, messageText) {
  // To be expanded in later sections
}

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}

// curl -X POST "https://graph.facebook.com/v2.8/me/subscribed_apps?access_token=access_token"


app.listen(PORT);
