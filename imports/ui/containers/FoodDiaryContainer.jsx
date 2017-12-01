import { createContainer } from 'meteor/react-meteor-data';
import FoodDiary from '../../ui/pages/FoodDiary.jsx';
import {Diaries} from '../../../imports/api/diaries/diaries.js';
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
    
    let subscription = null; 
    
    Tracker.autorun(() => {        
                
        subscription = Meteor.subscribe("diaries.diary", MongoUtil.createDate(Session.get("date")));
        
    });
    
    const loading = !subscription.ready();
    const id = Meteor.userId() + "_" +  MongoUtil.createDate(Session.get("date"));
    const diary = Diaries.find(id).fetch();
    
    return {
        loading: loading,
        diary: diary
    }
    
}, FoodDiary);