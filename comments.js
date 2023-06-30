// Create web server to handle comments

// Load modules
var http = require('http');
var fs = require('fs');
var qs = require('querystring');

// Create server
http.createServer(function (req, res) {
  // Check request method
  if (req.method === 'GET') {
    // Read form.html
    fs.readFile('form.html', function (err, data) {
      // Check error
      if (err) {
        // Log error
        console.error(err);
        // Send error response
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('500 - Internal Server Error');
      } else {
        // Send form.html
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
      }
    });
  } else if (req.method === 'POST') {
    // Create body variable
    var body = '';

    // Read data
    req.on('data', function (chunk) {
      // Add chunk to body
      body += chunk;
    });

    // When data is finished
    req.on('end', function () {
      // Parse body
      var data = qs.parse(body);

      // Create comment variable
      var comment = {
        name: data.name,
        comment: data.comment,
        date: new Date()
      };

      // Read comments.json
      fs.readFile('comments.json', function (err, data) {
        // Check error
        if (err) {
          // Log error
          console.error(err);
          // Send error response
          res.writeHead(500, {'Content-Type': 'text/plain'});
          res.end('500 - Internal Server Error');
        } else {
          // Parse comments.json
          var comments = JSON.parse(data);

          // Add new comment to comments
          comments.push(comment);

          // Write comments.json
          fs.writeFile('comments.json', JSON.stringify(comments), function (err) {
            // Check error
            if (err) {
              // Log error
              console.error(err);
              // Send error response
              res.writeHead(500, {'Content-Type': 'text/plain'});
              res.end('500 - Internal Server Error');
            } else {
              // Send response
              res.writeHead(200, {'Content-Type': 'text/plain'});
              res.end('Thank you for your comment!');
            }
          });
        }
      });
    });
  } else {