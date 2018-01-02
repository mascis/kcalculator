import { Meteor } from 'meteor/meteor';
import { Foods } from '../../api/foods/foods.js';
import { MongoUtil } from '../../utils/MongoUtil.js';

Meteor.startup(() => {
		
	if ( Foods.find().count() === 0 ) {
		
		let foods = [];
		foods = JSON.parse(Assets.getText('sampledata.json'));

		foods.forEach( (food) => {
			
			var doc = MongoUtil.createDocument(food);
			
			Foods.insert(doc);
			
			
		});

	} 
	
});

