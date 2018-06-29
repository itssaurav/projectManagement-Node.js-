/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name:{type:'string',required: true},
    age:{type:'string',required: true},
    email:{type:'string',required: true,unique:true},
    designation:{enum:['manager','developer','tester'],required: true},
    password:{type:'string',required: true},
    role:{enum:['admin','member', null],defaultsTo: null},
    project : {
      model: 'project'
    }
  },
  beforeCreate: function(values, next) {
    var bcrypt = require('bcryptjs');
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(values.password, salt, function(err, hash) {
        values.password = hash;
        next();
      });
    });
  }
};

