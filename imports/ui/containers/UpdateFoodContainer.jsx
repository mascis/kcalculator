import { createContainer } from 'meteor/react-meteor-data';
import UpdateFood from '../../ui/pages/UpdateFood.jsx';
import {Foods} from '../../../imports/api/foods/foods.js';
import { Session } from 'meteor/session';
import { SessionStorage } from '../../utils/SessionStorage.js';

export default createContainer( props => { 
    
    const id = props.match.params.id; 
    
    const subscription = Meteor.subscribe("find.food", id);  
    const loading = !subscription.ready();
    const result = Foods.find({_id: id}).fetch();
    
    return {
        food: result[0],
        loading: SessionStorage.getItem(id) == null ? !subscription.ready() : false
    };
      
}, UpdateFood);
