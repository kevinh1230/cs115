
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
   	res.render('profile');
	});

   app.get('/user', function(req,res) {
      res.json(req.user);
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

   

   // Friend List REST API
   app.put('/acceptFriend', function(request,response) {
      User.findOne({ username: request.body.friend }, function(error, friend) {
         if (error) { console.log(error); return; }
         if (!friend) { console.log('User not found'); return; }
         request.user.friend2s.push(friend.username);
         request.user.requests.remove(friend.username);
         request.user.save();
         friend.friend2s.push(request.user.username);
         friend.requested.remove(request.user.username);
         friend.save();
         response.json(request.user);
         console.log(request.user.username + ' accepted ' + friend.username);
      }); 
   });

   app.post('/addFriend2', function(request, response) {
      User.findOne({ username: request.body.friend }, function(error, friend) {
         if (error) { console.log(error); return; }
         if (!friend) { console.log('User not found'); return; }
         if (request.user.username === friend.username) {
            console.log('Go out and make some friends');
            return;
         }
         if (request.user.friend2s.indexOf(friend.username) != -1) {
            console.log('User is aready your friend');
            return;
         }
         request.user.requested.push(friend.username);
         request.user.save();
         friend.requests.push(request.user.username);
         friend.save();
         response.json(request.user);
         console.log(request.user.username + ' sent a friend request to ' + friend.username);
      });
   });

   app.delete('/deleteFriend/:friend', function (request, response) {
      User.findOne({ username: request.params.friend }, function (error, friend) {
         if (error) { console.log(error); return; }
         if (!friend) { console.log('User not found'); return; }
         request.user.friend2s.remove(friend.username);
         request.user.save();
         friend.friend2s.remove(request.user.username);
         friend.save();
         response.json(request.user);
         console.log(request.user.username + ' deleted ' + friend.username);
      });
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
	app.get('/', function(req, res) {
	   res.sendfile('./public/index.html');
	});
};

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();


	res.redirect('/');
};
