import { Meteor } from 'meteor/meteor';
import { Weights } from '../weights.js';

Meteor.publish('weights.forDate', function( date ) {
		
	const id = Meteor.userId() + "_" + date;
	
	return Weights.find({_id: id});
	
});

Meteor.publish('weights.allWeights', function() {
		
	return Weights.find(
			{owner: Meteor.userId()},
			{sort: {date: 1}}
			//{fields: {'date': 1, 'weight': 1}}
			
	);
	
});

