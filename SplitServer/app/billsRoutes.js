var User = require('../app/models/User');
var Bill = require('../app/models/Bill');
var requester = require('request');
var billQuery = [{ path: 'paid', select: 'username'},
				 { path: 'unpaid', select: 'username'},
				 { path: 'owner', select: 'username'},
                 { path: 'group.user', select: 'username firstName lastName' }];

var async = require('async');
var accountSid = 'ACc82a340f825c9497a289fa23cfb45687';
var authToken = "6bb6791bad8fa0cc270184fd2762e7e2";
var client = require('twilio')(accountSid, authToken);

module.exports = function (app) {
    console.log('init');
    // Routes for bills ======================================================
    app.get('/getOwnedBills', isLoggedIn, function (request, response) {
        console.log("WTF");
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

    app.post('/deleteBill', isLoggedIn, function(request,response) {
        Bill.remove({ _id: request.body.bill._id ,'group.paid': { $ne: true } },
            function(error, data) {
                if (error) return response.send(500);
                if (!data) response.send(400);
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
            console.log(request.user);
            var client_phone = "+" + token.user.phone;
            var payment = {
                client_id: 2178,
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
                    else {
                        
                        retrieveUser(bill.owner, function(err, user){

                            var billOwner_phone = "+" + user.venmoToken.user.phone;
                            var payer_message = "You paid " + user.firstName + " $" + bill.group[bill.group.indexOf(charge)].amount + ".";
                            var owner_message = request.user.firstName + " paid you $" + bill.group[bill.group.indexOf(charge)].amount + ".";
                            if (err) {
                                console.log(err);
                            }

                            client.messages.create({
                                body: payer_message,
                                to: client_phone,
                                from: "+19253489105",
                            }, function(err, message) {
                                client.messages.create({
                                body: owner_message,
                                to: billOwner_phone,
                                from: "+19253489105",
                            }, function(err, message) {
                                
                            });
                                
                            });

                            
                        }) 
                        response.send(200);
                    } 
                });
            });
        }); 
	});
    
    app.get('*', function (request, response) {
        response.sendfile('./public/index.html');
    });
}

function retrieveUser(userObjectId, callback) {
  User.find({_id: userObjectId}, function(err, users) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, users[0]);
    }
  });
};

function isLoggedIn(request, response, next) {
    console.log('wtf');
    if (request.isAuthenticated()) return next();
    response.redirect('/');
};
