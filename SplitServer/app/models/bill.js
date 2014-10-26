var mongoose 	   = require('mongoose');
var User		   = require('./User');

var billSchema = mongoose.Schema({
	owner : {type : String},
	debters : [{debter: { type: mongoose.Schema.ObjectId, ref: 'User' }}],
	ammount : {type : Number},
	subject : {type : String}
})

module.exports = mongoose.model('Bill', billSchema);