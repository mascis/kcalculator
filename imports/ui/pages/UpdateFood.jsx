import React from 'react';
import BaseComponent from '../components/BaseComponent.jsx';
import FoodForm from '../components/forms/FoodForm.jsx';

import {_} from 'meteor/underscore';
import i18n from 'meteor/universe:i18n';

export default class UpdateFood extends BaseComponent {
       
    constructor( props ) {
        super( props );
                
    }
        
    render() {
        
        const {
            food,
            loading
        } = this.props;
        
        return(
                <div>
                {
                    
                    loading 
                    
                    ?
                            
                    <h3>Loading...</h3>    
                            
                    :
                    
                    <FoodForm type="update" food={food}/>     
                    
                }
                </div>
                              
        );
        
    }

}

UpdateFood.propTypes = {
        food: React.PropTypes.object,
        loading: React.PropTypes.bool
};