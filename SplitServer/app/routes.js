var User = require('../app/models/User');
var Bill = require('../app/models/Bill');
var mongoose = require('mongoose');
var requester = require('request');

var query = [{ path: 'friends', select: 'username' }, 
			 { path: 'requests', select: 'username' },
			 { path: 'requested', select: 'username' }];
var billQuery = [{ path: 'paid', select: 'username'},
				 { path: 'unpaid', select: 'username'},
				 { path: 'owner', select: 'username'},
                 { path: 'group.user', select: 'username firstName lastName' }];

var async = require('async');
var _ = require('underscore');

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


    app.get('/getUsers', function(request, response) {
        User.find({}, { username: 1, firstName: 1, lastName: 1 })
            .exec(function(error, users) {
                if (error) response.send(500);
                else response.json(users);
            });
/*        console.log(request.query.search);
        var search = '^(' + request.query.search + ')';
        User.find({ $or: [ { username:  { $regex: search, $options:'i' } },
                           { firstName: { $regex: search, $options:'i' } },
                           { lastName:  { $regex: search, $options:'i' } } ] },
                  { username: 1, firstName: 1, lastName: 1 })
            .exec(function(error, users) {
                console.log(error,users);
                response.json(users);
            }); */
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
        Bill.find({ 'group.user': request.user })
	        .populate(billQuery)
	        .exec(function(error, bills) {
	            response.send(bills);
        });
    });

    app.delete('/deleteBill/:bill', isLoggedIn, function(request,response) {
        Bill.remove(request.params.bill, function(error, data) {
            if (error) response.send(500)
            else response.send(200);
        });
    });

    app.post('/createbill', isLoggedIn, function (request, response) {
        var newbill = new Bill();
        newbill.owner = request.user;
        newbill.amount = request.body.amount;
        newbill.subject = request.body.subject;
 
        async.each(request.body.debters, function (debter, done) {
            User.findOne( {username: debter.text}, function (error, user) {
                if (error) console.log('Error in Saving bill: ' + request.user._id + " " + err);
                newbill.group.addToSet({ user: user._id, amount: debter.amount, paid: false });
                newbill.unpaid.addToSet(user._id);
            }).exec(done);
        }, function(err) {
            newbill.save();  
            response.send(newbill);
        });
    });

    app.put('/payBill', isLoggedIn, function (request, response) {
        Bill.findById(request.body.bill._id).populate({ path: 'owner' }).exec( function(error, bill) {
            if (error) response.send(500);
            if (!bill) response.send(400);
            
            var charge = bill.group.filter(function(item) { 
                return item.user.equals(request.user._id)
            })[0];

            var token = request.user.venmoToken;
            
            var payment = {
                client_id: 2214,
                user_id: bill.owner.venmoToken.user.id,
                note: bill.subject,
                amount: charge.amount,
                access_token: token.access_token
            }
            
            requester.post({
                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                url:     'https://api.venmo.com/v1/payments',
                form:    payment
            }, function(error, res, body){
                bill.group[bill.group.indexOf(charge)].paid = true;
                bill.save(function(error) {
                    if (error) 
                        response.send(400);
                    else 
                        response.send(200);
                });
            });
        }); 
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
