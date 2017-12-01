import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';

export default class Loading extends BaseComponent {
   
    constructor(props) {
        super(props);
    }
      
    render() {
       
        return (
                <div> 
                    <span className="fa fa-spin fa-spinner loading-spinner" aria-hidden="true"></span>
                </div>
               
                    
        ); 
        
    }

}