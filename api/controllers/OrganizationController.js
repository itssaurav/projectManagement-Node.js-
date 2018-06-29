/**
 * OrganizationController
 *
 * @description :: Server-side logic for managing organizations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */



module.exports = {
  create: function (req, res) {
    var data = req.body;
    var Joi = require('joi');
    Joi.validate(req.body, {
      name: Joi.string().required(),
      email: Joi.string().email(),
      phoneNo: Joi.string().max(10),
      address:Joi.string()
     }, function(error, data2) {

      if (error) {
        return res.badRequest({
          success:false,
          message:error.details[0].message
        });
      }
        Organization.create(data).exec(function (error, organizationCreated) {
          if(error)
          {
            return res.forbidden({
              success:false,
              message:error.details
            })
          }

          return res.created({
            "data": organizationCreated
          })
        })

    })
  },
  editOrganization: function (req, res) {
    var organizationId = req.param('id');
    var Joi = require('joi');
    Joi.validate(req.body, {
      name: Joi.string().required(),
      email: Joi.string().email(),
      phoneNo: Joi.string().max(10),
      address:Joi.string()
    }, function(error, data) {

      if (error) {
        return res.badRequest({

          message:error.details[0].message
        });
      }

      else {
        Organization.update({id: organizationId}, req.body).exec(function (error, updatedOrganization) {
          if(error)
          {
            return res.forbidden({
                message:error.details
            })
          }
          return res.ok({
            "data": updatedOrganization
          })
        })
      }
    })
  }
  ,
  deleteOrganization: function (req, res) {
    var organizationId = req.param('id');
    Organization.destroy({id: organizationId}).exec(function (error, deletedOraganization) {
      return res.ok({
        "data": deletedOraganization
      })
    });
  },

  getOrganization: function (req, res) {
    Organization.find().exec(function(error,organization){
        return res.ok({
          "message": 'Oraganizations are successfully fetched',
          "data": organization
        })

    })
  }
};


