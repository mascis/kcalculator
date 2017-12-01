import React from 'react';
import BaseComponent from './../BaseComponent.jsx';
import i18n from 'meteor/universe:i18n';

import {CATEGORIES} from '../../../ui/helpers/Categories.js';
import {_} from 'meteor/underscore';

export default class CategoryItem extends BaseComponent {
    
    constructor( props ) {
        super( props );  
        
        this.state = {
                categories: []
        };

    } 
    
    componentWillMount() {
        
        for ( prop in CATEGORIES ) {    
            
            if ( prop != "NOT_SELECTED" ) {
                this.state.categories.push( { value: CATEGORIES[prop], name: i18n.getTranslation("helpers.categories." + prop) } );   
            }
                      
        }
        
        this.state.categories = _.sortBy(this.state.categories, 'name');
        
    }
        
    render () {
        
        const {
            index,            
            remove,
            value
        } = this.props;
                                 
        return (                                
                <div className="optional-field">                    
                    <select className="form-control" name="categories" data-index={index} defaultValue={value}>
                        <option value={CATEGORIES.NOT_SELECTED}>{i18n.getTranslation("helpers.categories.NOT_SELECTED") }</option>
                        {

                            this.state.categories.map( (category, i) => (

                                <option key={i} value={category.value}>{category.name}</option>
                                    
                            ))
   
                        }                                               
                    </select>
                    <span className="fa fa-minus-circle remove" data-index={index} onClick={remove}></span>
                </div>                        
        );
        
    }
}
