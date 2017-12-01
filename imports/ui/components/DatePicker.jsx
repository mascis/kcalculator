import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';

import {SessionStorage} from '../../utils/SessionStorage.js';
import {DateUtil} from '../../utils/DateUtil.js';

export default class DatePicker extends BaseComponent {
   
    constructor(props) {
        super(props);
        
        const d = Session.get("date");
        
        if ( SessionStorage.getItem("date") == null ) {
            SessionStorage.setItem("date", d.getTime());
        }
        
        this.state = {
            date: d.getDate(),
            month: d.getMonth(),
            year: d.getFullYear()
        }
        
        this.changeDate = this.changeDate.bind(this);
    }
    
    componentWillUnmount() {
        SessionStorage.removeItem("date");
    }
    
    changeDate( e ) {
        
        if ( this.props.onChange ) {
            this.props.onChange();
        }
                
        let date = null;
                
        if ( e.target.dataset.id == "prev" ) {
                        
            date = DateUtil.getPrevDate(this.state.date, this.state.month, this.state.year);
                       
        } else {
                        
            date = DateUtil.getNextDate(this.state.date, this.state.month, this.state.year);
            
        }
        
        Session.set("date", date);
        SessionStorage.setItem("date", date.getTime());
        
        this.state.date = date.getDate();
        this.state.month = date.getMonth();
        this.state.year = date.getFullYear();
                
        this.update();
        
    }
      
    render() {
        
        const {
            onChange
        } = this.props;
        
        return (
                <div className="date-picker"> 
                    <div className="fa fa-chevron-left prev" data-id="prev" aria-hidden="true" onClick={this.changeDate}></div>
                    <h3 className="date">{this.state.date}.{this.state.month + 1}.{this.state.year}</h3>
                    <div className="fa fa-chevron-right next" data-id="next" aria-hidden="true" onClick={this.changeDate}></div>
                </div>
        ); 
        
    }

}

DatePicker.propTypes = {
        onChange: React.PropTypes.func
};