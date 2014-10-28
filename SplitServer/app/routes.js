var User = require('../app/models/User');
var Bill = require('../app/models/Bill');
var mongoose = require('mongoose');

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
        response.json(request.user);
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

    // Friend List REST API
    app.put('/acceptFriend', function (request, response) {
        User.findOne({
            username: request.body.friend
        }, function (error, friend) {
            if (error) {
                console.log(error);
                return;
            }
            if (!friend) {
                console.log('User not found');
                return;
            }
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

    app.post('/addFriend2', function (request, response) {
        User.findOne({
            username: request.body.friend
        }, function (error, friend) {
            if (error) {
                console.log(error);
                return;
            }
            if (!friend) {
                console.log('User not found');
                return;
            }
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
        User.findOne({
            username: request.params.friend
        }, function (error, friend) {
            if (error) {
                console.log(error);
                return;
            }
            if (!friend) {
                console.log('User not found');
                return;
            }
            request.user.friend2s.remove(friend.username);
            request.user.save();
            friend.friend2s.remove(request.user.username);
            friend.save();
            response.json(request.user);
            console.log(request.user.username + ' deleted ' + friend.username);
        });
    });



    // Routes for bills ======================================================
    app.get('/getOwnedBills', isLoggedIn, function (request, response) {
        Bill.find({
            owner: request.user._id
        }, function (error, bills) {
            if (error) {
                console.log(error);
                return;
            }
            response.send(bills);
        });
    });

    app.get('/getChargedBills', isLoggedIn, function (request, response) {
        var chargedBills = request.user.chargedBills;
        Bill.find({
            debters: {$in : [request.user.username]}
        }, function (error, bills) {
            if (error) {
                console.log(error);
                return;
            }
            console.log(bills);
            response.send(bills);
        });
    });

    app.post('/createbill', isLoggedIn, function (request, response) {
        var newbill = new Bill();
        //var a = JSON.parse(debters);
        newbill.owner = request.user._id;;
        newbill.ammount = request.body.ammount;
        newbill.subject = request.body.subject;
        newbill._id = mongoose.Types.ObjectId();
        // for (var debter in a) {
        //  console.log(a[debter]);
        //  newbill.debters.push(mongoose.Types.ObjectId(a[debter]));
        // }
        newbill.debters.push(request.body.debters);

        newbill.save(function (err) {
            if (err) {
                console.log('Error in Saving bill: ' + request.user._id + " " + err);
                throw err;
            }
            User.findOne({
                _id: request.user._id
            }, function (error, user) {
                if (err) console.log('Error in Saving bill: ' + request.user._id + " " + err);
                user.ownedBills.push(newbill._id);
                user.save();
            });

            User.findOne({
                username: request.body.debters
            }, function (error, user) {
                if (err) console.log('Error in Saving bill: ' + request.user._id + " " + err);
                user.chargedBills.push(newbill._id);
                user.save();
            });
            response.send(newbill);
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