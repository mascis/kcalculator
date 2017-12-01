import React from 'react';
import BaseComponent from './../BaseComponent.jsx';
import {Link} from 'react-router-dom';
import i18n from 'meteor/universe:i18n';

import {Utils} from '../../../utils/Utils.js';

export default class PrimaryRow extends BaseComponent {
    
    constructor(props) {
        super(props);
       
    }  
       
    render() {
        
        const {
            food,
            toggleDetails,
            onChange,
            remove,
            DECIMALS,
            mealIndex,
            foodIndex
        } = this.props;
                
        return (
                <tr>
                    <td>
                        <div>
                            <div>{food.title}</div>
                            <div>{food.brand}</div>
                        </div>
                        <div>
                            <a  data-foodIndex={foodIndex}
                                data-index={mealIndex}
                                onClick={toggleDetails} className={food.showDetails ? "fa fa-caret-down toggle-details" : "fa fa-caret-right toggle-details"}></a>
                        </div> 
                    </td>
                    <td>
                        <div className="quantityInputContainer">
                            <input type="number" name="quantity" min="0" data-id={food._id} data-index={mealIndex} data-foodIndex={foodIndex} value={food.quantity} className="form-control pull-left" onChange={onChange}/> 
                            <span className="unit">g / ml</span>
                        </div>
                    </td>
                    <td>{Utils.round( food.nutritional_values.fats.sum * (food.quantity/100), DECIMALS)} g</td>                    
                    <td>{Utils.round( food.nutritional_values.carbs.sum * (food.quantity/100), DECIMALS)} g</td>
                    <td>{Utils.round( food.nutritional_values.protein * (food.quantity/100), DECIMALS)} g</td>
                    <td>{Utils.round( food.nutritional_values.energy.kcal * (food.quantity/100), DECIMALS)} kcal</td>
                    <td>
                        <div className="fa fa-minus-circle remove" onClick={() => remove(foodIndex, mealIndex)}></div>
                    </td>
                </tr>
               );
    }
}
