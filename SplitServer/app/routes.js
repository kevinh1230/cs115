var User		   = require('../app/models/User');
var Bill 		   = require('../app/models/bill');
var mongoose = require('mongoose');
module.exports = function(app, passport) {
	// server routes ===========================================================
	// handle things like api calls
	// authentication routes


	// Login Authentication and Signup Routes ==================================
	// Handles user authentication and profiles
	app.post('/signup', passport.authenticate('local-signup',{
		successRedirect : '/profile',
		failureRedirect : '/signup',
	}));

	app.post('/login', passport.authenticate('local-login',{
		successRedirect : '/profile',
		failureRedirect : '/login',
	}));

	app.get('/profile', isLoggedIn, function(req, res) {
		res.send(req.user);
	});

	app.get('/api', function(req, res) {
		res.send('this is a test.');
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


	// Friends list adding routes ==============================================
	app.post('/addFriend', isLoggedIn, function(req, res) {
		var friend = mongoose.Types.ObjectId(req.body._id);
		User.update(
			{_id: req.user._id},
			{$push : {friends : friend}}, 
			function(err, user) {
				if (err)
					res.send(err);
				else { 
					console.dir(user);
					res.send(user);
				}

		})
	});

	app.post('/createBill', isLoggedIn, function(req, res) {
		var subject = req.param('subject');
		var ammount = req.param('ammount');
		var owner = req.user._id;
		var debters = req.param('debters');
		console.log(debters);
		var newbill = new Bill();
		var a = JSON.parse(debters);
		newbill.owner = owner;
		newbill.ammount = ammount;
		newbill.subject = subject;
		for (var debter in a) {
			console.log(a[debter]);
			newbill.debters.push(mongoose.Types.ObjectId(a[debter]));
		}

		newbill.save(function(err) {
                    if (err){
                    	console.log('Error in Saving bill: ' +err);
                    	throw err;
                    }

                    console.log(debters); 
                    res.send(newbill);
               });

	})

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});
};

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}