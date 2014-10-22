var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var users = [{ FirstName: "Jesse",
               LastName: "Cheun"
             },
             {
               FirstName: "Ephraim",
               LastName: "Chu"
             }];

var router = express.Router();
var usersRoute = router.route('/users');

app.use(bodyParser());

usersRoute.get(function(request, response) {
  response.send(users);
});

usersRoute.put(function(request, response) {
   users.push({ FirstName: request.body.FirstName,
                LastName: request.body.LastName 
              });
   response.send(users[users.length - 1]);
});

usersRoute.delete(function(request, response) {
   response.send(users.splice(parseInt(request.body.user_id),1))
});

app.use('/test', router);
app.listen(8888);
