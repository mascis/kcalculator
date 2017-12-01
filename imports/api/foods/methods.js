import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
//import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';


import { Foods } from './foods.js';

const INSERT_SCHEMA = new SimpleSchema({	
	
	"document.createdAt": 				{ type: Date },	
	"document.title": 					{ type: String, min: 1 },
	"document.brand": 					{ type: String, min: 1, optional: true },
	"document.categories": 				{ type: [Number], optional: true },
	"document.tags": 					{ type: [String], optional: true },
	"document.nutritional_values": 		{ type: Object },
	"document.nutritional_values.unit": { type: String, min: 1 },
	"document.nutritional_values.energy": { type: Object },
	"document.nutritional_values.energy.kcal": { type: Number, min: 0, decimal: true },
	"document.nutritional_values.energy.kJ": { type: Number, min: 0, decimal: true },
	"document.nutritional_values.fats": { type: Object, min: 0, decimal: true },
	"document.nutritional_values.fats.sum": { type: Number, min: 0, decimal: true },
	"document.nutritional_values.fats.saturated": { type: Number, min: 0, decimal: true },
	"document.nutritional_values.fats.monounsaturated": { type: Number, min: 0, decimal: true, optional: true },
	"document.nutritional_values.fats.polyunsaturated": { type: Number, min: 0, decimal: true, optional: true },
	"document.nutritional_values.carbs": { type: Object, min: 0, decimal: true },
	"document.nutritional_values.carbs.sum": { type: Number, min: 0, decimal: true },
	"document.nutritional_values.carbs.sugar": { type: Number, min: 0, decimal: true },
	"document.nutritional_values.carbs.polyol": { type: Number, min: 0, decimal: true, optional: true },
	"document.nutritional_values.carbs.starch": { type: Number, min: 0, decimal: true, optional: true },
	"document.nutritional_values.fibre": { type: Number, min: 0, decimal: true, optional: true },
	"document.nutritional_values.protein": { type: Number, min: 0, decimal: true },
	"document.nutritional_values.salt": { type: Number, min: 0, decimal: true },
	"document.nutritional_values.vitamins": { type: [Object], optional: true },
	"document.nutritional_values.vitamins.$.name": { type: String, min: 1 },
	"document.nutritional_values.vitamins.$.quantity": { type: Number, min: 0, decimal: true },
	"document.nutritional_values.vitamins.$.unit": { type: String, min: 2 },
	"document.nutritional_values.lactose": { type: Number, min: 0, decimal: true, optional: true },
	"document.keywords": { type: [String], min: 2 }
	
}).validator();

const UPDATE_SCHEMA = new SimpleSchema({	
	"id": 								{ type: String },
	"document.createdAt": 				{ type: Date },	
	"document.title": 					{ type: String, min: 1 },
	"document.brand": 					{ type: String, min: 1, optional: true },
	"document.categories": 				{ type: [Number], optional: true },
	"document.tags": 					{ type: [String], optional: true },
	"document.nutritional_values": 		{ type: Object },
	"document.nutritional_values.unit": { type: String, min: 1 },
	"document.nutritional_values.energy": { type: Object },
	"document.nutritional_values.energy.kcal": { type: Number, min: 0, decimal: true },
	"document.nutritional_values.energy.kJ": { type: Number, min: 0, decimal: true },
	"document.nutritional_values.fats": { type: Object, min: 0, decimal: true },
	"document.nutritional_values.fats.sum": { type: Number, min: 0, decimal: true },
	"document.nutritional_values.fats.saturated": { type: Number, min: 0, decimal: true },
	"document.nutritional_values.fats.monounsaturated": { type: Number, min: 0, decimal: true, optional: true },
	"document.nutritional_values.fats.polyunsaturated": { type: Number, min: 0, decimal: true, optional: true },
	"document.nutritional_values.carbs": { type: Object, min: 0, decimal: true },
	"document.nutritional_values.carbs.sum": { type: Number, min: 0, decimal: true },
	"document.nutritional_values.carbs.sugar": { type: Number, min: 0, decimal: true },
	"document.nutritional_values.carbs.polyol": { type: Number, min: 0, decimal: true, optional: true },
	"document.nutritional_values.carbs.starch": { type: Number, min: 0, decimal: true, optional: true },
	"document.nutritional_values.fibre": { type: Number, min: 0, decimal: true, optional: true },
	"document.nutritional_values.protein": { type: Number, min: 0, decimal: true },
	"document.nutritional_values.salt": { type: Number, min: 0, decimal: true },
	"document.nutritional_values.vitamins": { type: [Object], optional: true },
	"document.nutritional_values.vitamins.$.name": { type: String, min: 1 },
	"document.nutritional_values.vitamins.$.quantity": { type: Number, min: 0, decimal: true },
	"document.nutritional_values.vitamins.$.unit": { type: String, min: 2 },
	"document.nutritional_values.lactose": { type: Number, min: 0, decimal: true, optional: true },
	"document.keywords": { type: [String], min: 2 }
}).validator();

export const insert = new ValidatedMethod({
	name: 'foods.insert',	
	validate: INSERT_SCHEMA,
	
	run( {document} ) {
		
		return Foods.insert(document);
		 
	}
});

export const update = new ValidatedMethod({
	name: 'foods.update',
	validate: UPDATE_SCHEMA,	
	run( { id, document } ) {
		
		const food = Foods.findOne(id);
		
	    if ( !food ) {
	      throw new Meteor.Error('api.errors.documentNotFound',
	        'Could not find document');
	    }
		
	    return Foods.update(id, {$set: document});		
		
	}
});
