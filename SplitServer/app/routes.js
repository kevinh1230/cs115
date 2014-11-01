var User = require('../app/models/User');
var Bill = require('../app/models/Bill');
var mongoose = require('mongoose');
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
        successRedirect: '/profile',
        failureRedirect: '/signup',
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
    }));

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
				console.log(bills);
				response.send(bills);
			});

    });

    app.get('/getChargedBills', isLoggedIn, function (request, response) {
        var chargedBills = request.user.chargedBills;
        Bill.find({ debters: {$in : [request.user.username]} })
		    .populate(billQuery)
		    .exec(function(error, bills) {
				console.log(bills);
				response.send(bills);
			});
    });

    app.post('/createbill', isLoggedIn, function (request, response) {
        var newbill = new Bill();
        newbill.owner = request.user;
        newbill.ammount = request.body.ammount;
        newbill.subject = request.body.subject;
        newbill._id = mongoose.Types.ObjectId();
        newbill.debters.push(request.body.debters.username);
		
		User.findOne(request.body.debters, function(error, debter) {
			newbill.unpaid.addToSet(debter);
			newbill.save();
			console.log(newbill);
			User.findOne({
                _id: request.user._id
            }, function (error, user) {
                if (error) console.log('Error in Saving bill: ' + request.user._id + " " + err);
                user.ownedBills.push(newbill._id);
                user.save();
            });

            User.findOne({
                username: request.body.debters.username
            }, function (error, user) {
                if (error) console.log('Error in Saving bill: ' + request.user._id + " " + err);
                user.chargedBills.push(newbill._id);
                user.save();
			});

			response.send(newbill);
		});
    });


	app.put('/payBill', isLoggedIn, function (request, response) {
		Bill.findById(request.body.bill._id, function(error, bill) {
			bill.unpaid.remove(request.user);
			bill.paid.addToSet(request.user);
			bill.save();
		}).populate(billQuery).exec(function (error, bill) {
			response.send(bill);
		});
		return;
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
