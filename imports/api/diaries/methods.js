import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
//import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';

import { Diaries } from './diaries.js';

const SAVE_SCHEMA = new SimpleSchema({
	
	"userId": {type: String},	
	"doc._id": {type: String},
	"doc.date": {type: Date},
	"doc.createdAt": {type: Date},
	"doc.owner": {type: String},
	"doc.meals": {type: [Object]},
	"doc.meals.$.name": {type: String},
	"doc.meals.$.foods": {type: [Object]},
	"doc.meals.$.foods.$.title": {type: String},
	"doc.meals.$.foods.$.brand": {type: String},
	"doc.meals.$.foods.$.quantity": {type: Number, min: 0, decimal: true},
	"doc.meals.$.foods.$.nutritional_values": 		{ type: Object },
	"doc.meals.$.foods.$.nutritional_values.unit": { type: String, min: 1 },
	"doc.meals.$.foods.$.nutritional_values.energy": { type: Object },
	"doc.meals.$.foods.$.nutritional_values.energy.kcal": { type: Number, min: 0, decimal: true },
	"doc.meals.$.foods.$.nutritional_values.energy.kJ": { type: Number, min: 0, decimal: true },
	"doc.meals.$.foods.$.nutritional_values.fats": { type: Object, min: 0, decimal: true },
	"doc.meals.$.foods.$.nutritional_values.fats.sum": { type: Number, min: 0, decimal: true },
	"doc.meals.$.foods.$.nutritional_values.fats.saturated": { type: Number, min: 0, decimal: true },
	"doc.meals.$.foods.$.nutritional_values.fats.monounsaturated": { type: Number, min: 0, decimal: true, optional: true },
	"doc.meals.$.foods.$.nutritional_values.fats.polyunsaturated": { type: Number, min: 0, decimal: true, optional: true },
	"doc.meals.$.foods.$.nutritional_values.carbs": { type: Object, min: 0, decimal: true },
	"doc.meals.$.foods.$.nutritional_values.carbs.sum": { type: Number, min: 0, decimal: true },
	"doc.meals.$.foods.$.nutritional_values.carbs.sugar": { type: Number, min: 0, decimal: true },
	"doc.meals.$.foods.$.nutritional_values.carbs.polyol": { type: Number, min: 0, decimal: true, optional: true },
	"doc.meals.$.foods.$.nutritional_values.carbs.starch": { type: Number, min: 0, decimal: true, optional: true },
	"doc.meals.$.foods.$.nutritional_values.fibre": { type: Number, min: 0, decimal: true, optional: true },
	"doc.meals.$.foods.$.nutritional_values.protein": { type: Number, min: 0, decimal: true },
	"doc.meals.$.foods.$.nutritional_values.salt": { type: Number, min: 0, decimal: true },
	"doc.meals.$.foods.$.nutritional_values.vitamins": { type: [Object], optional: true },
	"doc.meals.$.foods.$.nutritional_values.vitamins.$.name": { type: String, min: 1 },
	"doc.meals.$.foods.$.nutritional_values.vitamins.$.quantity": { type: Number, min: 0, decimal: true },
	"doc.meals.$.foods.$.nutritional_values.vitamins.$.unit": { type: String, min: 2 },
	"doc.meals.$.foods.$.nutritional_values.lactose": { type: Number, min: 0, decimal: true, optional: true }
}).validator();

export const save = new ValidatedMethod({
	name: 'diaries.save',
	validate: SAVE_SCHEMA,	
	run( {userId, doc} ) {
		
		if ( !userId ) {
			throw new Meteor.error("userId-not-found", "userId-not-found");
			return;
		}
		
		const diary = Diaries.findOne(doc._id);
		
		if ( diary ) {
			return Diaries.update(doc._id, {$set: doc});	
		} else {
			return Diaries.insert(doc);
		}
		 
	}
});