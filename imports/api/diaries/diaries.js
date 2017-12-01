import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
//import { Factory } from 'meteor/factory';
import i18n from 'meteor/universe:i18n';

class DiariesCollection extends Mongo.Collection {
	
	insert( document, callback ) {
		
		const id = super.insert(document);
		return id;
		
	}
	
}

export const Diaries = new Mongo.Collection('diaries');

Diaries.deny({
	insert() { return true; },
	update() { return true; },
	remove() { return true; }
});
