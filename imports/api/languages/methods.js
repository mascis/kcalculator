import { ValidatedMethod } from 'meteor/mdg:validated-method';
import i18n from 'meteor/universe:i18n';

const getLanguages = new ValidatedMethod({
	name: 'languages.getAll',
	validate: null,
	run() {

		return i18n.getLanguages();
		
	},
});

export default getLanguages;