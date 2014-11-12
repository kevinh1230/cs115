var User     = require('../app/models/User');
var router   = require('express').Router();
var query    = [{ path: 'friends', select: 'username' }, 
                { path: 'requests', select: 'username' },
                { path: 'requested', select: 'username' }];

module.exports = function () {
    // Friend List REST API
    router.put('/acceptFriend', function (request, response) {
        User.findOne(request.body.friend, function (error, friend) {
            if (error) {
                console.log(error);
                return response.send(500);
            }
            if (!friend) {
                console.log('Cannot find user: ' + request.body.friend);
                return response.json(400, { text: 'Cannot find user: ' + request.body.friend,
                                            type: 'warning' });
            }

            request.user.requests.remove(friend);
            request.user.friends.addToSet(friend);
            request.user.save();
            friend.requested.remove(request.user);
            friend.friends.addToSet(request.user);
            friend.save();
            
            request.user.populate( query, function (error, user) {
                response.json(user);
            });
            console.log(request.user.username + ' accepted ' + friend.username);
        });
    });

    router.post('/addFriend', function (request, response) {
        console.log(request.body.friend);
        User.findOne({
            username: request.body.friend
        }, function (error, friend) {
            if (error) {
                console.log(error);
                return response.json(500, {  text: 'Request Error', type: 'danger' });
            }
            if (!friend) {
                console.log('Cannot find user: ' + request.body.friend);
                return response.json(400, { text: 'Cannot find user: ' + request.body.friend,
                                            type: 'warning' });
            }
            if (request.user.username === friend.username) {
                console.log('Cannot add yourself as a friend');
                return response.json(400, { text: 'Cannot add yourself as a friend', 
                                            type: 'warning' });
            }
            if (request.user.friends.indexOf(friend._id) != -1) {
                console.log('User: ' + friend.username + 'is already your friend');
                return response.json(400, { text: 'User: ' + friend.username + ' is already your friend', 
                                            type: 'warning'});
            }

            request.user.requested.addToSet(friend);
            request.user.save();
            friend.requests.addToSet(request.user);
            friend.save();
            
            request.user.populate( query, function (error, user) {
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
                return response.send(500);
            }
            if (!friend) {
                console.log('Cannot find user: ' + request.body.friend);
                return response.json(400, { text: 'Cannot find user: ' + request.body.friend,
                                            type: 'warning' });
            }
            if (request.user.username == friend.username) {
                console.log('Cannot add yourself as a friend');
                return response.json(400, { text: 'Cannot remove yourself as a friend', 
                                            type: 'warning' });
            }
            if (request.user.friends.indexOf(friend._id) == -1) {
                console.log('User: ' + friend.username + 'is not your friend');
                return response.json(400, { text: 'User: ' + friend.username + ' is not your friend', 
                                            type: 'warning'});
            }

            request.user.friends.remove(friend);
            request.user.save();
            friend.friends.remove(request.user);
            friend.save();
            
            request.user.populate( query, function (error, user) {
                response.json(user);
            });
            console.log(request.user.username + ' deleted ' + friend.username);
        });
    });

    return router;
}
