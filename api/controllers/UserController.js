/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  signUp: function (req, res) {
    var data = req.body;
    var jwt = require('jsonwebtoken');
  var Joi = require('joi');
    Joi.validate(req.body, {
      name: Joi.string().required(),
      age: Joi.string().required(),
      email: Joi.string().email(),
      designation: Joi.string().required(),
      role:Joi.string(),
      password:Joi.string().required(),
      project:Joi.string()
    }, function(error, data2) {

      if (error) {
        return res.badRequest({
          success:false,
          message:error.details[0].message
        });
      }
     else{
      User.create(data).exec(function (error, user) {
        if(error)
        {
          return res.forbidden({
            success:false,
            message:error.details
          })
        }
        delete user['password'];
        console.log('User', user);
        var access_token = jwt.sign({
          exp: Date.now(),
          token: user.id,
          type:user.type
        }, sails.config.scrtKey);
        return res.created({
          "success": true,
          "accessToken": access_token,
          "message": 'Record created successfully',
          "data": user
        })
      })
     }
    })
  },
  signIn: function (req, res) {

    var jwt = require('jsonwebtoken');
    var bcrypt = require('bcryptjs');
    var Joi = require('joi');
    Joi.validate(req.body, {
      email: Joi.string().email(),
      password: Joi.string()
    }, function (error, data2) {
      console.log('Data', error);
      if (error) {
        return res.badRequest({
          success: false,
          message: error.details[0].message
        });
      }

      else {
        User.findOne({email: req.body.email}).exec(function (error, user) {
          var access_token = jwt.sign({
            exp: Date.now(),
            token: user.id,
            role:user.role
          },sails.config.scrtKey);

          bcrypt.compare(req.body.password, user.password, function (err, status) {
            if (status) {
              return res.send({
                "success": true,
                "message": 'You are successfully login',
                "data": {
                  'userName': user.email,
                  "accessToken": access_token
                }
              })
            }
            else {
              res.notFound({
                "success": false,
                "message": 'Password doesnot match',
             })
            }
          })

        })
      }
    })
  },

  updateUser: function (req, res) {
    var data = req.body;
    var userId = req.param('id');
    var Joi = require('joi');
    Joi.validate(req.body, {
      name: Joi.string().required(),
      age: Joi.string().required(),
      email: Joi.string().email(),
      designation: Joi.string().required(),
      role:Joi.string(),
      password:Joi.string().required(),
      project:Joi.string()
    }, function(error, data2) {
      if (error) {
        return res.badRequest({
          success:false,
          message:error.details[0].message
        });
      }

       User.update({id: userId},data).exec(function (error, user) {
          if(error)
          {
            return res.forbidden({
              success:false,
              message:error.details
            })
          }
          delete user['password'];
          return res.created({
            "message": 'Record updated successfully',
            "data": user
          })
        })

    })
  },

  updateRole: function (req,res)
  {
    var data = req.body;
    var userId = req.param('id');
    console.log('DataisnotValid',userId);
    var Joi = require('joi');
    Joi.validate(req.body, {
      role:Joi.string().required()
    }, function(error, data2) {
      if (error) {
        return res.badRequest({
          success:false,
          message:error.details[0].message
        });
      }
       User.update({id: userId},data).exec(function (error, user) {
          if(error)
          {
            return res.forbidden({
              success:false,
              message:error.details
            })
          }
          delete user[0]['password'];
          return res.created({
            "success": true,
            "message": 'Record updated successfully',
            "data": user
          })
        })

    })
  },

  deleteUser: function (req, res) {
    var userId = req.param('id');

    User.destroy({id: userId}).exec(function (error, deleteProject) {
      return res.ok({
         "message": 'Record deleted successfully',
      })
    });
  },

  getUser: function (req, res) {
    User.find().exec(function (error, user) {
      if (user.length > 0) {
        return res.ok({
          "success": true,
          "message": 'Users are successfully fetched',
          "data": user
        })
      }
      else {
        return res.ok({
          "success": true,
          "message": 'No record in database'
        })
      }
    })

  }
};

