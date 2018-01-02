import React from 'react';
import BaseComponent from '../../components/BaseComponent.jsx';
import {Link} from 'react-router-dom';
import {_} from 'meteor/underscore';
import i18n from 'meteor/universe:i18n';

import {Utils} from '../../../utils/Utils.js';

import PieChart from '../charts/PieChart.jsx';

export default class SecondaryRow extends BaseComponent {
    
    constructor(props) {
        super(props);
       
        this.state = {                               
                showMonounsaturated: false,
                showPolyunsaturated: false,
                showPolyol: false,
                showStarch: false,
                showFibre: false,
                showLactose: false,
                showSummary: false
        };
        
        this.createFoodSummary = this.createFoodSummary.bind(this);
        this.getPieChartData = this.getPieChartData.bind(this);
        
    }    
       
    componentWillMount() {
        
        this.createFoodSummary( this.props.food );
        
    }

    componentWillUpdate( nextProps, nextState ) {
        
        this.createFoodSummary( nextProps.food );
        
    }
       
    createFoodSummary( food ) {
                
        this.state.showMonounsaturated = food.nutritional_values.fats.monounsaturated != null ? true : false;
        this.state.showPolyunsaturated = food.nutritional_values.fats.polyunsaturated != null ? true : false;
        this.state.showPolyol = food.nutritional_values.carbs.polyol != null ? true : false;
        this.state.showStarch = food.nutritional_values.carbs.starch != null ? true : false;
        this.state.showFibre = food.nutritional_values.fibre != null ? true : false;
        this.state.showLactose = food.nutritional_values.lactose != null ? true : false;
        /*
        
        */
    }
    
    getPieChartData( food, DECIMALS ) {
                
        let pieChartData = {
                showLabels: true,
                data: []
        };
        
        pieChartData.data.push({
            label: i18n.getTranslation("common.fats"),
            value: isNaN(food.quantity) ? 0 : Utils.round(food.nutritional_values.fats.sum * (food.quantity/100), this.props.DECIMALS)
        });
        
        pieChartData.data.push({
            label: i18n.getTranslation("common.carbs"),
            value: isNaN(food.quantity) ? 0 : Utils.round(food.nutritional_values.carbs.sum * (food.quantity/100), this.props.DECIMALS)
        });
        
        pieChartData.data.push({
            label: i18n.getTranslation("common.protein"),
            value: isNaN(food.quantity) ? 0 : Utils.round(food.nutritional_values.protein * (food.quantity/100), this.props.DECIMALS)
        });
        pieChartData.data.push({
            label: i18n.getTranslation("common.salt"),
            value: isNaN(food.quantity) ? 0 : Utils.round(food.nutritional_values.salt * (food.quantity/100), this.props.DECIMALS)
        });
        
        return pieChartData;
        
    }
    
    render() {
       
        const {
            food,
            DECIMALS,
            mealIndex,
            foodIndex
        } = this.props;
              
        const chartOptions = this.getPieChartData(food, DECIMALS);
        const chartId = "chart" + mealIndex + foodIndex;
            
        return (                
                <tr>    
                    <td colSpan="2">                        
                        <PieChart id={chartId} options={chartOptions}/>    
                    </td>
                    <td colSpan="2">
                    
                        <dl>
                
                        <dt>{i18n.getTranslation("components.selectedFoodsTable.contains")}</dt>
                        <dd>{i18n.getTranslation("components.selectedFoodsTable.energy.header")}</dd>
                        
                        <dd>{i18n.getTranslation("components.selectedFoodsTable.fats.header")}</dd>
                        <dd>{i18n.getTranslation("components.selectedFoodsTable.fats.saturated")}</dd>
                        { this.state.showMonounsaturated ? <dd>{i18n.getTranslation("components.selectedFoodsTable.fats.monounsaturated")}</dd> : ''}   
                        { this.state.showPolyunsaturated ? <dd>{i18n.getTranslation("components.selectedFoodsTable.fats.polyunsaturated")}</dd> : ''}    
                        
                        <dd>{i18n.getTranslation("components.selectedFoodsTable.carbs.header")}</dd>
                        <dd>{i18n.getTranslation("components.selectedFoodsTable.carbs.sugar")}</dd>
                        { this.state.showPolyol ? <dd>{i18n.getTranslation("components.selectedFoodsTable.carbs.polyol")}</dd> : ''}   
                        { this.state.showStarch ? <dd>{i18n.getTranslation("components.selectedFoodsTable.carbs.starch")}</dd> : ''}     
                        
                        { this.state.showFibre ? <dd>{i18n.getTranslation("components.selectedFoodsTable.fibre")}</dd> : ''}
                        
                        <dd>{i18n.getTranslation("components.selectedFoodsTable.protein")}</dd>
                        
                        <dd>{i18n.getTranslation("components.selectedFoodsTable.salt")}</dd>
                        
                        { this.state.showLactose ? <dd>{i18n.getTranslation("components.selectedFoodsTable.lactose")}</dd> : ''}
                       
                        
                        {
                            
                            food.nutritional_values.vitamins != null
                            
                            ?                                
                            
                            food.nutritional_values.vitamins.map( (vitamin, i) => (
                                    
                                    <dd key={"sr"+i}>{vitamin.name}</dd>
                                        
                                ))
                                
                            :
                                
                            ""
                            
                        }
                        
                        </dl>
                    </td>
                    <td colSpan="3">
                        
                        <dl>
                            <dt>per {food.quantity}g</dt>
                            
                            <dd>{Utils.round(food.nutritional_values.energy.kJ * (food.quantity/100), DECIMALS)} kJ / {Utils.round(food.nutritional_values.energy.kcal * (food.quantity/100), DECIMALS)} kcal</dd>
                            
                            <dd> {Utils.round(food.nutritional_values.fats.sum * (food.quantity/100), DECIMALS)} g</dd>
                            <dd> {Utils.round(food.nutritional_values.fats.saturated * (food.quantity/100), DECIMALS)} g</dd>                            
                            { this.state.showMonounsaturated ? <dd>{Utils.round(food.nutritional_values.fats.monounsaturated * (food.quantity/100), DECIMALS)} g</dd> : ''}                            
                            { this.state.showPolyunsaturated ? <dd> {Utils.round(food.nutritional_values.fats.polyunsaturated * (food.quantity/100), DECIMALS)} g</dd> : ''}
                            
                            <dd>{Utils.round(food.nutritional_values.carbs.sum * (food.quantity/100), DECIMALS)} g</dd>
                            <dd>{Utils.round(food.nutritional_values.carbs.sugar * (food.quantity/100), DECIMALS)} g</dd>
                            { this.state.showPolyol ? <dd>{Utils.round(food.nutritional_values.carbs.polyol * (food.quantity/100), DECIMALS)} g</dd> : ''}
                            { this.state.showStarch ? <dd>{Utils.round(food.nutritional_values.carbs.starch * (food.quantity/100), DECIMALS)} g</dd> : ''}  
                              
                            { this.state.showFibre ? <dd>{Utils.round(food.nutritional_values.fibre * (food.quantity/100), DECIMALS)} g</dd> : ''}
                            
                            <dd>{Utils.round(food.nutritional_values.protein * (food.quantity/100), DECIMALS)} g</dd>
                            
                            <dd>{Utils.round(food.nutritional_values.salt * (food.quantity/100), DECIMALS)} g</dd>
                            
                            { this.state.showLactose ? <dd>{Utils.round(food.nutritional_values.lactose * (food.quantity/100), DECIMALS)} g</dd> : ''}
                            
                            {
                                
                                food.nutritional_values.vitamins != null
                                
                                ?  
                                
                                food.nutritional_values.vitamins.map( (vitamin, i) => (
                                        
                                    <dd key={"sr"+i}>{Utils.round(vitamin.quantity * (food.quantity/100), DECIMALS)}{vitamin.unit == "ug" ? <span>&mu;</span> : "mg"}</dd>
                                        
                                ))
                                
                                :
                                    
                                ""
                            }
                        </dl>
                    </td>
                </tr>
           );
    }
}
