import BaseComponent from './../BaseComponent.jsx';
import React, { Component } from 'react';
import i18n from 'meteor/universe:i18n';
import {_} from 'meteor/underscore';
import {Utils} from '../../../utils/Utils.js';

export default class VitaminItem extends BaseComponent {
    
    constructor( props ) {
        super( props );
        
    }
   
    render () {
        
        const {
            index,
            remove,            
            values,
            errors
        } = this.props;
        
        let hasNameError = false;
        let hasQuantityError = false;
        let hasUnitError = false;
                
        if ( errors && errors.length > 0 ) {
            
            hasNameError = _.find(errors, function(obj){ return obj.index == index && obj.prop == "name"}) != undefined ? true : false;
            hasQuantityError = _.find(errors, function(obj){ return obj.index == index && obj.prop == "quantity"}) != undefined ? true : false;
            hasUnitError = _.find(errors, function(obj){ return obj.index == index && obj.prop == "unit"}) != undefined ? true : false;
            
        }
        
        return (
                <div className="optional-field">
                    <div className={hasNameError ? "has-error": ""}>
                        {
                            hasNameError
                            
                            ?
                            
                            <div className="alert alert-danger">
                                <strong>{i18n.getTranslation("common.errors.stringExpected")}</strong>
                            </div>
                                    
                            :
                            
                            ''
                        } 
                        <label>{i18n.__("pages.addFood.vitamins.name")}</label>
                        <input type="text" className="form-control" data-index={index} name="vitamin-name" defaultValue={values.name}></input>
                    </div>                   
                    <div className={hasQuantityError ? "has-error": ""}>
                        {
                            hasQuantityError
                            
                            ?
                            
                            <div className="alert alert-danger">
                                <strong>{i18n.getTranslation("common.errors.numberExpected")}</strong>
                            </div>
                                    
                            :
                            
                            ''
                        }
                        <label>{i18n.__("pages.addFood.vitamins.quantity")}</label> 
                        <input type="number" min="0" className="form-control" data-index={index} name="vitamin-quantity" defaultValue={values.quantity}></input>
                    </div>                       
                    <div className={hasUnitError ? "has-error": ""}>   
                        {
                            hasUnitError
                            
                            ?
                            
                            <div className="alert alert-danger">
                                <strong>{i18n.getTranslation("common.errors.stringExpected")}</strong>
                            </div>
                                    
                            :
                            
                            ''
                        } 
                        <label>{i18n.__("pages.addFood.vitamins.unit")}</label>
                        <select className="form-control" data-index={index} name="vitamin-unit" defaultValue={values.unit}>
                            <option value="mg">mg</option>
                            <option value="ug">&micro;g</option>
                        </select>
                    </div>                        
                    <span className="fa fa-minus-circle remove" data-index={index} onClick={remove}></span>
                </div>
        );
        
    }
}
