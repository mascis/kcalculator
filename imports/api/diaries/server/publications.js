import { Meteor } from 'meteor/meteor';
import { Diaries } from '../diaries.js';

Meteor.publish('diaries.diary', function( date ) {
		
	const id = Meteor.userId() + "_" + date;
	
	return Diaries.find({_id: id});
	
});

