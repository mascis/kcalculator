import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
//import { Factory } from 'meteor/factory';
import i18n from 'meteor/universe:i18n';

class WeightsCollection extends Mongo.Collection {
	
	insert( document, callback ) {
		
		const id = super.insert(document);
		return id;
		
	}
	
}

export const Weights = new Mongo.Collection('weights');

Weights.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; }
});
