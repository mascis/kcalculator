import { createContainer } from 'meteor/react-meteor-data';
import Search from '../../ui/components/search/Search.jsx';
import {Foods} from '../../../imports/api/foods/foods.js';
import { Session } from 'meteor/session';

export default createContainer( props => {    
        
    Session.setDefault(props.id, "");
        
    let subscription = null;  
    
    Tracker.autorun(() => {  
        subscription = Meteor.subscribe("search", Session.get(props.id));
        return;
    }); 
          
    loading = subscription != null ? !subscription.ready() : false;
    
    if ( subscription != null ) {
        
        const str = Session.get(props.id);
        const strArr = str.split(" ");
        
        results = Foods.find(
                { $or: 
                    [
                        {title: { $regex: str, $options: 'i' }},
                        {brand: { $regex: str, $options: 'i' }},
                        {tags: {$in: strArr }}
                    ]
                }).fetch(); 
            
    } else {
        
        results = [];
        
    }
    
    return {
        results: results,
        loading: loading,
        id: props.id
    };
       
}, Search);
