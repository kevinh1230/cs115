var User = require('../app/models/User');
var Bill = require('../app/models/Bill');
var mongoose = require('mongoose');
var requester = require('request');

var query = [{ path: 'friends', select: 'username' }, 
			 { path: 'requests', select: 'username' },
			 { path: 'requested', select: 'username' }];
var billQuery = [{ path: 'paid', select: 'username'},
				 { path: 'unpaid', select: 'username'},
				 { path: 'owner', select: 'username'}];

module.exports = function (app, passport) {
    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // Login Authentication and Signup Routes ==================================
    // Handles user authentication and profiles
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: 'https://api.venmo.com/v1/oauth/authorize?client_id=2114&scope=make_payments%20access_profile%20access_email%20access_phone%20access_balance&response_type=code',
        failureRedirect: '/signup',
    }));


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
        var client_id = "2114";
        var client_secret = "nsWqxLQzYcVkFJepqtGyqun6UfvRWWV9";

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
                console.log(body.id);
                var token = JSON.parse(body);
                if (!token.hasOwnProperty('error')) {
                    user.venmoToken = token;
                    user.venmoAuthed = true;
                    user.save();
                }
            })
            response.send(body);
        }); } else {
            console.log("avoided token request!!");
        }

    });

    // Routes for bills ======================================================
    app.get('/getOwnedBills', isLoggedIn, function (request, response) {
        Bill.find({ owner: request.user._id })
            .populate(billQuery)
            .exec(function(error, bills) {
                response.send(bills);
            });
    });

    app.get('/getChargedBills', isLoggedIn, function (request, response) {
        var chargedBills = request.user.chargedBills;
        Bill.find({ $or: [{ unpaid:request.user }, { paid: request.user }] })
	        .populate(billQuery)
	        .exec(function(error, bills) {
	            response.send(bills);
        });
    });

    app.post('/createbill', isLoggedIn, function (request, response) {
        var newbill = new Bill();
        newbill.owner = request.user;
        newbill.amount = request.body.amount;
        newbill.subject = request.body.subject;
        newbill._id = mongoose.Types.ObjectId();
        for (var debter in request.body.debters) {
            User.findOne({
                    username: request.body.debters[debter].text
                }, function (error, user) {
                    if (error) console.log('Error in Saving bill: ' + request.user._id + " " + err);
                    newbill.unpaid.addToSet(user._id);
                    newbill.save();
                    console.log(debter + "adding ");
                });
        }
        
        newbill.save();
        response.send(newbill);
    });


	app.put('/payBill', isLoggedIn, function (request, response) {
		Bill.findById(request.body.bill._id, function(error, bill) {
            if (bill.paid.indexOf(request.user._id) == -1){
                bill.unpaid.remove(request.user);
			    bill.paid.addToSet(request.user);
                User.findOne({_id : bill.owner}, function (err, user) {
                    if (err) console.log(err);
                    console.log(user.venmoToken.id);
                var token = request.user.venmoToken;
                console.log(token.user.id);

                var payment = {
                    client_id: 2114,
                    user_id: user.venmoToken.user.id,
                    note: bill.subject,
                    amount: bill.amount,
                    access_token: token.access_token
                }

                console.log(payment);

                requester.post({
                    headers: {'content-type' : 'application/x-www-form-urlencoded'},
                    url:     'https://api.venmo.com/v1/payments',
                    form:    payment
                }, function(error, res, body){
                    console.log(body);
                });
                 });
                } else {
                    console.log("avoided token request!!");
                }


			    bill.save();
                response.send(200);
            }
           
		);
	});

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function (request, response) {
        response.sendfile('./public/index.html');
    });
};

function isLoggedIn(request, response, next) {
    if (request.isAuthenticated()) return next();
    response.redirect('/');
};
