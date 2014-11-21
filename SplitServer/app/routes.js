var User = require('../app/models/User');
var Bill = require('../app/models/Bill');
var mongoose = require('mongoose');
var query = [{ path: 'friends', select: 'username' }, 
			 { path: 'requests', select: 'username' },
			 { path: 'requested', select: 'username' }];
var billQuery = [{ path: 'paid', select: 'username'},
				 { path: 'unpaid', select: 'username'},
				 { path: 'owner', select: 'username'}];

var async = require('async');

module.exports = function (app, passport) {
    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // Login Authentication and Signup Routes ==================================
    // Handles user authentication and profiles
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
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


    // Routes for bills ======================================================
    app.get('/getOwnedBills', isLoggedIn, function (request, response) {
        Bill.find({ owner: request.user._id })
            .populate(billQuery)
            .exec(function(error, bills) {
                //console.log(bills);
                response.send(bills);
            });
    });

    app.get('/getChargedBills', isLoggedIn, function (request, response) {
        var chargedBills = request.user.chargedBills;
        Bill.find({ $or: [{ unpaid:request.user }, { paid: request.user }] })
	        .populate(billQuery)
	        .exec(function(error, bills) {
	            //console.log(bills);
	            response.send(bills);
        });
    });

    app.post('/createbill', isLoggedIn, function (request, response) {
        var newbill = new Bill();
        newbill.owner = request.user;
        newbill.ammount = request.body.ammount;
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
		Bill.findById(request.body.bill._id, function(error, bill) {
            if (bill.paid.indexOf(request.user._id) == -1){
                bill.unpaid.remove(request.user);
			    bill.paid.addToSet(request.user);
			    bill.save();
            }
            response.send(200);
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
