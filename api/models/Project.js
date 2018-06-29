/**
 * Project.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
      name:{type:'string',required: true},
      totalTeam:{type:'string',required: true},
      startDate:{type:'date',required: true},
      endDate:{type:'date',required: true},
      status:{enum:['notStarted','inProgress','completed'],defaultsTo:'notStarted'},
      organization : {
         model: 'organization'
      },
     user:{
        collection:'User',
        via:'project'
      }
   }
};

