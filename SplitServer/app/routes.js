var User = require('../app/models/User');
var requester = require('request');

var accountSid = 'ACc82a340f825c9497a289fa23cfb45687';
var authToken = "6bb6791bad8fa0cc270184fd2762e7e2";
var client = require('twilio')(accountSid, authToken);

var query = [{ path: 'friends', select: 'username' }, 
			 { path: 'requests', select: 'username' },
			 { path: 'requested', select: 'username' }];

module.exports = function (app, passport) {
    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // Login Authentication and Signup Routes ==================================
    // Handles user authentication and profiles
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: 'https://api.venmo.com/v1/oauth/authorize?client_id=2178&scope=make_payments%20access_profile%20access_email%20access_phone%20access_balance&response_type=code',
        failureRedirect: '/signup',
    }));


    app.get('/getUsers', function(request, response) {
        User.find({}, { username: 1, firstName: 1, lastName: 1 })
            .exec(function(error, users) {
                if (error) response.send(500);
                else response.json(users);
            });
    });

    app.post('/login', function(request, response) {
        passport.authenticate('local-login', function(error, user, info) {
            if (error) return response.send(500);
            if (!user) return response.json(400, { text: 'Username or Password wrong',
                                                   type: 'danger' });
            request.logIn(user, function(error) {
                if (error) return response.send(500);
                response.send(200);
            });
        })(request, response);
    });

    app.get('/user', function (request, response) {
        request.user.populate( query, function(err, user) {
            response.json(user);
        });
    });

    app.get('/auth', function (request, response) {
        response.json(request.isAuthenticated());
    });

    app.get('/api', function (request, response) {
        response.send('this is a test.');
    });

    app.get('/logout', function (request, response) {
        request.logout();
        response.redirect('/');
    });

    app.post('/accesstoken', function(request, response) {
        if (!request.user.venmoAuthed) {
        var code = request.body.code;
        var client_id = "2178";
        var client_secret = "kxsnYhuUwwpaLNfXq8hbGWGta7cssQCv";

        var data = {
            client_id: client_id,
            client_secret: client_secret,
            code: code
        }

        requester.post({
            headers: {'content-type' : 'application/x-www-form-urlencoded'},
            url:     'https://api.venmo.com/v1/oauth/access_token',
            form:    data
        }, function(error, res, body){
            User.findOne({username: request.user.username}, function (error, user) {
                if (error) console.log ("error in saving venmo token " + request.user._id + " " + error);
                var token = JSON.parse(body);
                if (!token.hasOwnProperty('error')) {
                    user.venmoToken = token;
                    user.venmoAuthed = true;
                    user.save();
                }
            })
            console.log(JSON.parse(body));
            response.send(body);
        }); } else {
            console.log("avoided token request!!");
        }

    });
};

