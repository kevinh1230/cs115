var mongoose	= require('mongoose');
var Schema   	= mongoose.Schema; 
var User		= require('./User');

var billSchema = mongoose.Schema({
    owner :   {type : Schema.ObjectId, ref: 'User'},
	ammount : {type : Number},
	subject : {type : String},
	paid    : [{ type: Schema.ObjectId, ref: 'User' }],
	unpaid  : [{ type: Schema.ObjectId, ref: 'User' }]
})

module.exports = mongoose.model('Bill', billSchema);
