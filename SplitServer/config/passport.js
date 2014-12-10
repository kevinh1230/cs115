var LocalStrategy  = require('passport-local').Strategy;
var User		   = require('../app/models/User');

module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id,done) {
		User.findById(id, function(err, user) {
			done(err,user);
		});
	});


	passport.use('local-signup', new LocalStrategy({
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

		// we are checking to see if the user trying to login already exists
        User.findOne({ 'username' :  username }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

    
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

				// if there is no user with that email
                // create the user
                var newUser = new User();

                // set the user's local credentials
                newUser.username = username;
          		newUser.password = newUser.generateHash(password);
          		newUser.email = req.param('email');
          		newUser.firstName = req.param('firstName');
          		newUser.lastName = req.param('lastName');
                newUser.venmoAuthed = false;
				// save the user
                newUser.save(function(err) {
                    if (err){
                    	console.log('Error in Saving user: ' +err);
                    	throw err;
                    }

                    console.log('User Registration succesful'); 
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

	passport.use('local-login', new LocalStrategy({
		passReqToCallback : true
	},
	function(req, username, password, done){

		User.findOne({ 'username' : username }, function(err, user) {
			if (err)
				return done(err);

			if (!user)
				return done(null, false, req.flash('loginMessage', 'Username doesn\'t exist.'));

			if (!user.validPassword(password))
				return done(null, false, req.flash('loginMessage', 'Password doesn\'t match.'));

			return done(null, user);

		});
	}));
};