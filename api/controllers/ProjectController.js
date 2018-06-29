/**
 * ProjectController
 *
 * @description :: Server-side logic for managing projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  create: function (req, res) {
    var data = req.body;

    var Joi = require('joi');
    Joi.validate(req.body, {
      name: Joi.string().required(),
      totalTeam: Joi.string().required(),
      startDate:Joi.date().format('YYYY-MM-DD'),
      endDate:Joi.date().format('YYYY-MM-DD'),
      organizationId:Joi.string().required()
    }, function(error, data2) {

      if (error) {
        return res.badRequest({
          success:false,
          message:error.details[0].message
        });
      }

      else {
        data.organization = req.body.organizationId;
        Project.create(data).exec(function (error, projectCreated) {
          if(error)
          {
            return res.forbidden({
              success:false,
              message:error.details
            })
          }

          return res.created({
            "success": true,
            "message": 'Record created successfully',
            "data": projectCreated
          })
        })
      }
    })
  },
  editProject: function (req, res) {
    var projectId = req.param('id');
    var Joi = require('joi');
    Joi.validate(req.body, {
      name: Joi.string().required(),
      totalTeam: Joi.string().required(),
      startDate: Joi.string().required(),
      endDate:Joi.string().required(),
      organizationId:Joi.string().required()
    }, function(error, data) {

      if (error) {
        return res.badRequest({

          message:error.details[0].message
        });
      }

      else {
        data.organization = req.body.organizationId;
        Project.findOne({id:req.param.projectId}).exec(function (error, projectData) {
          if(error)
          {
            return res.ok({
              "message":"No Record for this Id is found"
            });
          }
        Project.update({id: projectId}, req.body).exec(function (error, updatedOrganization) {
          if(error)
          {
            return res.forbidden({

              message:error.details
            })
          }
          return res.created({
            "success": true,
            "message": 'Record updated successfully',
            "data": updated
          })
        })})
      }
    })
  },
  addMembersToProject: function (req, res) {
    var reqData = req.body;
    var projectId = req.param('id');
    var Joi = require('joi');
    Joi.validate(reqData, {
      userId: Joi.string().required()
    }, function(error, data) {

      if (error) {
        return res.badRequest({
          success:false,
          message:error.details[0].message
        });
      }
      else {
       Project.findOne({id:req.param.projectId}).exec(function (error, projectData) {
         var userCollection = projectData.user;
         console.log('ProjectId',userCollection);
         userCollection.push(reqData.userId);
         reqData['user'] = userCollection;
         Project.update({id: projectId}, reqData).exec(function (error, updated) {
           if(error)
           {
             return res.forbidden({
               success:false,
               message:error.details
             })
           }
           return res.created({
             "success": true,
             "message": 'Record updated successfully',
             "data": updated
           })
         })
        })

      }
    })
  },
  deleteProject: function (req, res) {
    var projectId = req.param('id');
    Project.findOne({id:req.param.projectId}).exec(function (error, projectData) {
      if(error)
      {
        return res.ok({
             "message":"No Record for this Id is found"
        });
      }
      Project.destroy({id: projectId}).exec(function (error, deleteProject) {
        return res.ok({
          "success": true,
          "message": 'Record deleted successfully',
          "data": deleteProject
        })
      });
    })


  },

  getProject: function (req, res) {
    Project.find().populateAll().exec(function (error, project) {
      if (project.length > 0) {
        return res.ok({
          "success": true,
          "message": 'Oraganizations are successfully fetched',
          "data": project
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

