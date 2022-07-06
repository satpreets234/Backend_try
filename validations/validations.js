const Joi = require('joi');

const userSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    age: Joi.number()
        .integer()
        .min(15)
        .max(130),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    
    profession:Joi.string().
    min(3).max(100).required()
})

const postSchema = Joi.object({
    userId: Joi.number()
        .integer()
        .required(),

    imagePath: Joi.string().allow(null).allow('').optional(),

    description:Joi.string().allow(null).allow('').optional()
})

const reactionSchema = Joi.object({
    userId: Joi.number()
        .integer()
        .required(),

    postId: Joi.number()
        .integer()
        .required(),

    reactionType: Joi.string().valid('text','vote','emoji'),

    reactionData:Joi.when('reactionType',{is:'text',then:Joi.string().required()}).
    when('reactionType',{is:'vote',then:Joi.string().valid('like','dislike')}).
    when('reactionType',{is:'emoji',then:Joi.string()}),
    
    parentId: Joi.number()
    .integer().optional().allow(null),
});

module.exports={userSchema:userSchema,postSchema:postSchema,reactionSchema:reactionSchema};