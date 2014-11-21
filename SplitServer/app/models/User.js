// grab the mongoose module
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	username:     {type : String, unique : true, required : true, dropDups : true},
	password:     {type : String},
	firstName:    {type : String},
	lastName:     {type : String},
	email:        {type : String},
	friends:      [{ type: Schema.ObjectId, ref: 'User' }],
	requests:	  [{ type: Schema.ObjectId, ref: 'User' }],
	requested:    [{ type: Schema.ObjectId, ref: 'User' }],
	venmoToken:   {type : Object},
	venmoAuthed:  {type : Boolean},

})

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
