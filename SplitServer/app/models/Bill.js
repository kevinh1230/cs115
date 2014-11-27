var mongoose	= require('mongoose');
var Schema   	= mongoose.Schema; 
var User		= require('./User');

var billSchema = mongoose.Schema({
    owner :   {type : Schema.ObjectId, ref: 'User'},
	amount : {type : Number},
	subject : {type : String},
    group   : [{ user   : { type: Schema.ObjectId, ref: 'User' },
                 amount : Number, 
                 paid   : Boolean, 
                 _id    : false}],
	paid    : [{ type: Schema.ObjectId, ref: 'User' }],
	unpaid  : [{ type: Schema.ObjectId, ref: 'User' }]
});


module.exports = mongoose.model('Bill', billSchema);
