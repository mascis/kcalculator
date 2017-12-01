import React from 'react';
import BaseComponent from '../components/BaseComponent.jsx';
import FoodForm from '../components/forms/FoodForm.jsx';

export default class AddFood extends BaseComponent {
       
    constructor( props ) {
        super( props );
        
    }
    
    render() {
        
        return (
                <FoodForm type="add"/>
        );
        
        
    }
    
}