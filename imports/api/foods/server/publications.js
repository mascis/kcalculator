import { Meteor } from 'meteor/meteor';
import { Foods } from '../foods.js';

Meteor.publish('search', function( str ) {
	
	if ( str == "" ) {		
		this.ready();		
		return null;		
	}
	
	const strArr = str.split(" ");
	
	return Foods.find(
			{ $or: 
				[
					{title: { $regex: str, $options: 'i' }},
					{brand: { $regex: str, $options: 'i' }},
					{tags: {$in: strArr }}
				]
			});
	
});

Meteor.publish('find.food', function( id ) {
	
	return Foods.find({_id: id});
	
});

