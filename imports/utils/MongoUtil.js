import {Utils} from './Utils.js';
import {CATEGORIES} from '../ui/helpers/Categories.js'; 
import i18n from 'meteor/universe:i18n';

const DATE_SEPARATOR = "_";

export const MongoUtil = {

	createKeywords( data ) {
		
		var keywords = [];
		
		keywords.push(data.title);
		keywords.push(data.brand);
		
		if ( data.tags != null ) {
			
			for( i = 0; i < data.tags.length; i++ ) {
				
				keywords.push(data.tags[i]);
				
			}
			
		}
				
		if ( data.categories != null ) {			
			
			for ( category in CATEGORIES ) {
				
				if ( Utils.inArray( data.categories, CATEGORIES[category] ) ) {
					
					var translation = i18n.getTranslation("helpers.categories." + category);
					keywords.push(translation);
					
				}
				
			}
			
		}
		
		return keywords;
		
	},
		
	createNutritionalValues( data ) {
		
		var nutritional_values = {};
		var energy = {};
		var fats = {};
		var carbs = {};
		
		energy.kcal = data.kcal;
		energy.kJ = data.kJ;
		
		fats.sum = data.sumFats;
		fats.saturated = data.saturated;		
		if ( data.monounsaturated != null ) { fats.monounsaturated = data.monounsaturated; }
		if ( data.polyunsaturated != null ) { fats.polyunsaturated = data.polyunsaturated; }
		
		carbs.sum = data.sumCarbs;
		carbs.sugar = data.sugar;		
		if ( data.polyol != null ) { carbs.polyol = data.polyol; }
		if ( data.starch != null ) { carbs.starch = data.starch; }
				
		nutritional_values.unit = data.unit;
		nutritional_values.energy = energy;
		nutritional_values.fats = fats;
		nutritional_values.carbs = carbs;
		nutritional_values.protein = data.protein;
		nutritional_values.salt = data.salt;
		if ( data.fibre != null ) { nutritional_values.fibre = data.fibre; }
		if ( data.vitamins != null ) { nutritional_values.vitamins = data.vitamins; }
		if ( data.lactose != null ) { nutritional_values.lactose = data.lactose; }
		
		return nutritional_values;
		
	},	

	createDocument( data ) {
		
		var doc = {};
				
		doc.title = Utils.removeWhitespaces(data.title);
		doc.createdAt = new Date();
		
		if ( data.brand != null ) { doc.brand = Utils.removeWhitespaces(data.brand); }
		if ( data.categories != null ) { doc.categories = data.categories; }
		if ( data.tags != null ) { doc.tags = data.tags; }
		
		doc.nutritional_values = this.createNutritionalValues( data );
		doc.keywords = this.createKeywords( data );
		
		return doc;
		
	},	
	
	createDiaryDocument( data ) {
		
		const date = this.createDate(Session.get("date"));
		
		var doc = {};		
		doc._id = this.createIdByDate( date );	
		doc.date = Session.get("date");
		doc.createdAt = new Date();
		doc.owner = data.userId;		
		doc.meals = [];
		
		data.meals.forEach( ( meal ) => {	
						
			const m = {};			
			m.name = meal.name != null && meal.name != undefined && meal.name != "" ? meal.name : null;
			m.foods = [];
			
			meal.foods.forEach( ( food ) => {
				
				const f = _.pick(food, "title", "brand", "nutritional_values", "quantity");
				m.foods.push(f);
				
			});
			
			doc.meals.push(m);
			
		});
				
		return doc;
		
	},
	
	createWeightDocument( data ) {
		
		const date = this.createDate(Session.get("date"));
		
		var doc = {};		
		doc._id = this.createIdByDate( date );	
		doc.date = Session.get("date");
		doc.createdAt = new Date();
		doc.owner = data.userId;		
		doc.weight = data.weight;
				
		return doc;
		
	},
	
	createDate( param ) {
		
		let date = null;
		
		if ( param ) {
			
			date = param.getDate() + "_" + param.getMonth() + "_" + param.getFullYear();
			
		} else {
			const d = new Date();
	        date = d.getDate() + "_" + d.getMonth() + "_" + d.getFullYear();
		}
				
        return date;
        
	},
	
	createIdByDate( date ) {   
		
		if ( date == null || !Meteor.userId() ) {
			return null;
		}
		
        const id = Meteor.userId() + "_" + date;   
        return id;
        
    }
	
};

