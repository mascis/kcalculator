import { createContainer } from 'meteor/react-meteor-data';
import WeightWatch from '../../ui/pages/WeightWatch.jsx';
import {Weights} from '../../../imports/api/weights/weights.js';
import {Session} from 'meteor/session';
import {MongoUtil} from '../../utils/MongoUtil.js';
import {SessionStorage} from '../../utils/SessionStorage.js';

export default createContainer(props => {    
    
    if ( SessionStorage.getItem("date") != null ) {        
        const d = new Date(parseInt(SessionStorage.getItem("date")));
        Session.setDefault("date", d);        
    } else {        
        Session.setDefault("date", new Date());          
    } 
    
    let subscriptionForDate = null; 
    let subscriptionAllWeights = null; 
    
    Tracker.autorun(() => {        
                
        subscriptionForDate = Meteor.subscribe("weights.forDate", MongoUtil.createDate(Session.get("date")));
        subscriptionAllWeights = Meteor.subscribe("weights.allWeights");
        
    });
        
    const loading = !(subscriptionForDate.ready() && subscriptionAllWeights.ready());
    
    const id = Meteor.userId() + "_" +  MongoUtil.createDate(Session.get("date"));
    
    const result = Weights.find(id).fetch();
    const allWeights = Weights.find({owner: Meteor.userId()}, {sort: {date: 1}}).fetch();
    
    return {
        loading: loading,
        result: result,
        allWeights: allWeights
    }
    
}, WeightWatch);