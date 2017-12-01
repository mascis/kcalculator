import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
//import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';

import { Weights } from './weights.js';

const SAVE_SCHEMA = new SimpleSchema({
	
	"userId": {type: String},	
	"doc._id": {type: String},
	"doc.date": {type: Date},
	"doc.createdAt": {type: Date},
	"doc.owner": {type: String},
	"doc.weight": {type: Number, min: 0, decimal: true}
	
}).validator();

export const save = new ValidatedMethod({
	name: 'weights.save',	
	validate: SAVE_SCHEMA,	
	run( {userId, doc} ) {
		
		if ( !userId ) {
			throw new Meteor.error("userId-not-found", "userId-not-found");
			return;
		}
		
		const weight = Weights.findOne(doc._id);
		
		if ( weight ) {
			return Weights.update(doc._id, {$set: doc});	
		} else {
			return Weights.insert(doc);
		}
		 
	}
});