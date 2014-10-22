// grab the mongoose module
var mongoose = require('mongoose');

// define our nerd model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('User', {
	username : {type : String, unique : true, required : true, dropDups : true},
	password : {type : String},
	first : {type : String},
	last : {type : String},
	email : {type : String}
});
