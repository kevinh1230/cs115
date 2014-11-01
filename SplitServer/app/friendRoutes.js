var User     = require('../app/models/User');
var router   = require('express').Router();
var mongoose = require('mongoose');
var query = [{ path: 'friends', select: 'username' }, 
			 { path: 'requests', select: 'username' },
			 { path: 'requested', select: 'username' }];

module.exports = function () {
    // Friend List REST API
    router.put('/acceptFriend', function (request, response) {
		console.log(request.body.friend);
		User.findOne(request.body.friend, function (error, friend) {
			if (error) {
				console.log(error);
				return;
			}
			if (!friend) {
				console.log('User not found');
				return;
			}

			request.user.requests.remove(friend);
			request.user.friends.addToSet(friend);
			request.user.save();
			friend.requested.remove(request.user);
			friend.friends.addToSet(request.user);
			friend.save();
			
			request.user.populate( query, function(err, user) {
				response.json(user);
			});
			console.log(request.user.username + ' accepted ' + friend.username);
		});
    });

    router.post('/addFriend', function (request, response) {
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
            if (request.user.friends.indexOf(friend._id) != -1) {
				console.log('User is aready your friend');
				return;
            }

			request.user.requested.addToSet(friend);
			request.user.save();
			friend.requests.addToSet(request.user);
			friend.save();
			
			request.user.populate( query, function(err, user) {
				response.json(user);
			});
			console.log(request.user.username + ' sent a friend request to ' + friend.username);
        });
    });

    router.delete('/deleteFriend/:friend', function (request, response) {
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

            request.user.friends.remove(friend);
            request.user.save();
            friend.friends.remove(request.user);
            friend.save();
            
			request.user.populate( query, function(err, user) {
				response.json(user);
			});
            console.log(request.user.username + ' deleted ' + friend.username);
        });
    });
	return router;
}
