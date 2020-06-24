//External imports
const Joi = require('@hapi/joi');
const _ = require('lodash');

//Custom Imports
const constants = require('../utils/constants');


//Initialize validator
module.exports = (schema) => (req, res, next) => validate(schema, req, res, next);



let validate = async (schema, req, res, next) =>{
    //Extract request data
    const data = extractor(req, schema);

    try {
        // Validate request
        const validatedData = await Joi.validate(data, schema, { stripUnknown: { objects: true } });

        // Replace req with the valid data after validation
        assigner(validatedData, req);

        next();
    }catch (error) {
        return res.status(constants.BAD_REQUEST.code).json({
            error: true,
            code: constants.BAD_REQUEST.code,
            message: getValidationErrorMessage(error).message || constants.BAD_REQUEST.message,
            data: null
        })
    }
};


/**
 * To get error message
 * @param error
 */
let getValidationErrorMessage = (error) =>{
    return error.details.map(({ message }) => ({
        message: message.replace(/['"]/g, '')
    }))[0];
};

/**
 * To extract data and get same as schema
 * @param req
 * @param schema
 */
let extractor = (req, schema) =>{
    const data = {};
    for(let property of ['params', 'body', 'query']){
        if(!_.isEmpty(req[property])){
            data[property] = req[property]
        }else if(schema[property]){
            data[property] = {}
        }
    }
    return data;
};

/**
 * To assign data
 * @param body
 * @param query
 * @param params
 * @param req
 */
let assigner = ({ body, query, params }, req) => {
    if (body) {
        req.body = body;
    }
    if (query) {
        req.query = query;
    }
    if (params) {
        req.params = params;
    }
};