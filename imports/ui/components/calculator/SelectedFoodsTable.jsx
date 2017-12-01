import React from 'react';
import BaseComponent from './../BaseComponent.jsx';
import {Link} from 'react-router-dom';
import i18n from 'meteor/universe:i18n';

import {SessionStorage} from '../../../utils/SessionStorage.js';
import {Utils} from '../../../utils/Utils.js';

import PrimaryRow from './PrimaryRow.jsx';
import SecondaryRow from './SecondaryRow.jsx';
import PieChart from '../charts/PieChart.jsx';

export default class SelectedFoodsTable extends BaseComponent {
    
    constructor(props) {
        super(props);
        
        this.state = {
                rows: [],
                sum: {
                    quantity: 0,
                    energy: {
                        kcal: 0,
                        kJ: 0
                    },
                    fats: {
                        sum: 0,
                        saturated: 0,
                        monounsaturated: 0,
                        polyunsaturated: 0
                    },
                    carbs: {
                        sum: 0,
                        sugar: 0,
                        polyol: 0,
                        starch: 0
                    },
                    fibre: 0,
                    protein: 0,
                    salt: 0,
                    lactose: 0
                },
                showMonounsaturated: false,
                showPolyunsaturated: false,
                showPolyol: false,
                showStarch: false,
                showFibre: false,
                showLactose: false,
                
                DECIMALS: 1,
                showSummary: false,
                chartOptions: {
                    showLabels: true,
                    data: []
                }
        };
                     
        this.toggleSummary = this.toggleSummary.bind(this);
        this.createSummary = this.createSummary.bind(this);
        
    }   
    
    toggleSummary() {
        
        this.state.showSummary = !this.state.showSummary;        
        this.update();
        
    }
    
    componentWillMount() {

        this.createSummary( this.props.selectedFoods );
        
    }
        
    componentWillUpdate( nextProps, nextState ) {
        
        this.createSummary( nextProps.selectedFoods );
        
    }
    
    createSummary( foods ) {
                     
        let sumQuantity = 0;
        
        let sumKcal = 0;
        let sumKJ = 0;
        
        let sumFats = 0;
        let sumSaturated = 0;
        let sumMonounsaturated = 0;
        let sumPolyunsaturated = 0;
        
        let sumCarbs = 0;
        let sumSugar = 0;
        let sumPolyol = 0;
        let sumStarch = 0;
        
        let sumFibre = 0;
        let sumProtein = 0;
        let sumSalt = 0;
        let sumLactose = 0;
                
        let pieChartData = [];
                
        for( i = 0; i < foods.length; i++ ) {
            
            sumQuantity += parseFloat(foods[i].quantity); 
            
            sumKcal += foods[i].nutritional_values.energy.kcal * (foods[i].quantity/100);
            sumKJ += foods[i].nutritional_values.energy.kJ * (foods[i].quantity/100);
            
            sumFats += foods[i].nutritional_values.fats.sum * (foods[i].quantity/100);
            sumSaturated += foods[i].nutritional_values.fats.saturated * (foods[i].quantity/100);
            
            if ( foods[i].nutritional_values.fats.monounsaturated != null ) {
                sumMonounsaturated += foods[i].nutritional_values.fats.monounsaturated * (foods[i].quantity/100);
                this.state.showMonounsaturated = true;
            }
            
            if ( foods[i].nutritional_values.fats.polyunsaturated != null ) {
                sumPolyunsaturated += foods[i].nutritional_values.fats.polyunsaturated * (foods[i].quantity/100);
                this.state.showPolyunsaturated = true;
            }
            
            sumCarbs += foods[i].nutritional_values.carbs.sum * (foods[i].quantity/100);
            sumSugar += foods[i].nutritional_values.carbs.sugar * (foods[i].quantity/100);
            
            
            if ( foods[i].nutritional_values.carbs.polyol != null ) {
                sumPolyol += foods[i].nutritional_values.carbs.polyol * (foods[i].quantity/100);
                this.state.showPolyol = true;
            }
            
            if ( foods[i].nutritional_values.carbs.starch != null ) {
                sumStarch += foods[i].nutritional_values.carbs.starch * (foods[i].quantity/100);
                this.state.showStarch = true;
            }
            
            if ( foods[i].nutritional_values.carbs.fibre != null ) {
                sumFibre += foods[i].nutritional_values.fibre * (foods[i].quantity/100);
                this.state.showFibre = true;
            }
            
            sumProtein += foods[i].nutritional_values.protein * (foods[i].quantity/100);
            
            sumSalt += foods[i].nutritional_values.salt * (foods[i].quantity/100);
            
            if ( foods[i].nutritional_values.lactose != null ) {
                sumLactose += foods[i].nutritional_values.lactose * (foods[i].quantity/100);
                this.state.showLactose = true;
            }
            
            
        }
        
        this.state.sum.quantity = sumQuantity;
        
        this.state.sum.energy.kcal = sumKcal;
        this.state.sum.energy.kJ = sumKJ;
        
        this.state.sum.fats.sum = sumFats;
        this.state.sum.fats.saturated = sumSaturated;
        this.state.sum.fats.monounsaturated = sumMonounsaturated;
        this.state.sum.fats.polyunsaturated = sumPolyunsaturated;
        
        this.state.sum.carbs.sum = sumCarbs;
        this.state.sum.carbs.sugar = sumSugar;
        this.state.sum.carbs.polyol = sumPolyol;
        this.state.sum.carbs.starch = sumStarch;
        
        this.state.sum.fibre = sumFibre;
        this.state.sum.protein = sumProtein;
        this.state.sum.salt = sumSalt;
        this.state.sum.lactose = sumLactose;   
                        
        pieChartData.push({
            label: "Rasvat (g)",
            value: Utils.round(this.state.sum.fats.sum, this.state.DECIMALS)
        });
        
        pieChartData.push({
            label: "Hiilihydraatit (g)",
            value: Utils.round(this.state.sum.carbs.sum, this.state.DECIMALS)
        });
        
        pieChartData.push({
            label: "Proteiini (g)",
            value: Utils.round(this.state.sum.protein, this.state.DECIMALS)
        });
        pieChartData.push({
            label: "Suola (g)",
            value: Utils.round(this.state.sum.salt, this.state.DECIMALS)
        });
        
        this.state.chartOptions.data = pieChartData;
        
    }
    
    createVitaminSummaryFromSelectedFoods() {
        
        const selectedFoods = JSON.parse(SessionStorage.getItem("selected-foods")); 
        const sumVitamins = [];
        
        if ( !selectedFoods ) {
            return [];
        }
        
        selectedFoods.map( (food, i) => {
           
            let vitamins = food.nutritional_values.vitamins;
            
            vitamins.forEach( ( vitamin ) => {
                
                const current = selectedFoods[i];
                const result = _.findWhere(sumVitamins, {name: vitamin.name});
                
                if ( result ) {
                    
                    const index = _.indexOf(sumVitamins, result);                    
                    sumVitamins[index].quantity += vitamin.quantity * (current.quantity/100); 
                    
                } else {
                    
                    vitamin.quantity = vitamin.quantity * (current.quantity/100);
                    sumVitamins.push(vitamin);
                }
                
            });
            
        });
        
        return sumVitamins;
        
    }
    
    createVitaminSummaryFromMeals() {
        
        const meals = JSON.parse(SessionStorage.getItem("meals")); 
        const sumVitamins = [];
        
        if ( !meals ) {
            return [];
        }
        
        this.props.selectedFoods.forEach( (food, i ) => {
            
            const current = meals[this.props.index].foods[i];
            const vitamins = current.nutritional_values.vitamins;
            
            vitamins.forEach( ( vitamin ) => {
                
                const result = _.findWhere(sumVitamins, {name: vitamin.name});
                
                if ( result ) {
                    
                    const index = _.indexOf(sumVitamins, result);                    
                    sumVitamins[index].quantity += vitamin.quantity * (current.quantity/100); 
                    
                } else {
                    
                    vitamin.quantity = vitamin.quantity * (current.quantity/100);
                    sumVitamins.push(vitamin);
                }
                
            });
            
        });
        
        return sumVitamins;
        
    }
    
    createVitaminSummary() {

        const location = this.context.router.route.location.pathname;
        let sumVitamins = [];
        
        if ( location == "/calculator" ) {
            
            sumVitamins = this.createVitaminSummaryFromSelectedFoods();
            
        } else if ( location == "/food-diary" ){
            
            sumVitamins = this.createVitaminSummaryFromMeals();
            
        }
                
        return sumVitamins;
        
    }
        
    render() {
        
        const {
            selectedFoods,
            remove,
            onChange,
            toggleDetails,
            index
        } = this.props;
          
        const sumVitamins = this.createVitaminSummary();   
        const chartId = "summaryPieChart" + index;
        
        let Rows = [];  
        
        selectedFoods.map(( food, i ) => {
            
            const primaryRow = 
                <PrimaryRow 
                    key={"primary" + i}
                    food={food} 
                    toggleDetails={toggleDetails} 
                    onChange={onChange}
                    remove={remove}
                    DECIMALS={this.state.DECIMALS}
                    mealIndex={index}
                    foodIndex={i}/>;
            
            Rows.push(primaryRow);
            
            if ( food.showDetails ) {
                const secondaryRow = <SecondaryRow key={"secondary" + i} food={food} DECIMALS={this.state.DECIMALS} mealIndex={index} foodIndex={i}/>;
                Rows.push(secondaryRow);
            }
            
        });
        
    
        let SummaryRow;
        
        if ( this.state.showSummary ) {
            
            SummaryRow = (
                    
                    <tr>    
                        <td colSpan="2">
                            <PieChart id={chartId} options={this.state.chartOptions}/>
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
                                    
                                    sumVitamins.map( (vitamin, i) => (
                                        
                                        <dd key={i}>{vitamin.name}</dd>
                                        
                                    ))
                                    
                                }
                                
                            </dl>                            
                        </td>
                        <td colSpan="3">
                            <dl>
                                <dt>per {this.state.sum.quantity}g</dt>
                            
                                <dd>{Utils.round(this.state.sum.energy.kJ, this.state.DECIMALS)} kJ / {Utils.round(this.state.sum.energy.kcal, this.state.DECIMALS)} kcal</dd>
                                
                                <dd> {Utils.round(this.state.sum.fats.sum, this.state.DECIMALS)} g</dd>
                                <dd> {Utils.round(this.state.sum.fats.saturated, this.state.DECIMALS)} g</dd>                            
                                { this.state.showMonounsaturated ? <dd>{Utils.round(this.state.sum.fats.monounsaturated, this.state.DECIMALS)} g</dd> : ''}                            
                                { this.state.showPolyunsaturated ? <dd> {Utils.round(this.state.sum.fats.polyunsaturated, this.state.DECIMALS)} g</dd> : ''}
                                
                                <dd>{Utils.round(this.state.sum.carbs.sum, this.state.DECIMALS)} g</dd>
                                <dd>{Utils.round(this.state.sum.carbs.sugar, this.state.DECIMALS)} g</dd>
                                { this.state.showPolyol ? <dd>{Utils.round(this.state.sum.carbs.polyol, this.state.DECIMALS)} g</dd> : ''}
                                { this.state.showStarch ? <dd>{Utils.round(this.state.sum.carbs.starch, this.state.DECIMALS)} g</dd> : ''}  
                                  
                                { this.state.showFibre ? <dd>{Utils.round(this.state.sum.fibre, this.state.DECIMALS)} g</dd> : ''}
                                
                                <dd>{Utils.round(this.state.sum.protein, this.state.DECIMALS)} g</dd>
                                
                                <dd>{Utils.round(this.state.sum.salt, this.state.DECIMALS)} g</dd>
                                
                                { this.state.showLactose ? <dd>{Utils.round(this.state.sum.lactose, this.state.DECIMALS)} g</dd> : ''}
                                
                                {
                                    
                                    sumVitamins.map( (vitamin, i) => (
                                        
                                        <dd key={i}>{Utils.round(vitamin.quantity, this.state.DECIMALS)}{vitamin.unit == "ug" ? <span>&mu;</span> : "mg"}</dd>
                                        
                                    ))
                                    
                                }
                                
                            </dl>
                        </td>
                    </tr>
                                
                );
        }
        
        
        
        return (
                <div>
                
                    { 
                        selectedFoods.length == 0
                        
                        ?
                        
                        <div className="selected-foods-container empty">
                            <div>
                                <strong>{i18n.getTranslation("components.selectedFoodsTable.emptyMessage")}</strong>
                            </div>
                        </div>
                
                        :
                            
                        <div className="selected-foods-container">
                        
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th><strong>{i18n.getTranslation("components.selectedFoodsTable.header.food")}</strong></th>
                                        <th><strong>{i18n.getTranslation("components.selectedFoodsTable.header.quantity")}</strong></th>
                                        <th><strong>{i18n.getTranslation("components.selectedFoodsTable.header.fat")}</strong></th>
                                        <th><strong>{i18n.getTranslation("components.selectedFoodsTable.header.carbs")}</strong></th>
                                        <th><strong>{i18n.getTranslation("components.selectedFoodsTable.header.protein")}</strong></th>
                                        <th colSpan="2"><strong>{i18n.getTranslation("components.selectedFoodsTable.header.energy")}</strong></th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <td colSpan="2">
                                            <a onClick={this.toggleSummary} className={ this.state.showSummary ? "fa fa-caret-down toggle-details" : "fa fa-caret-right toggle-details"}></a>
                                        </td>
                                        <td>
                                            <strong>{Utils.round(this.state.sum.fats.sum, this.state.DECIMALS)} g</strong>
                                        </td>
                                        <td>
                                            <strong>{Utils.round(this.state.sum.carbs.sum, this.state.DECIMALS)} g</strong>
                                        </td>
                                        <td>
                                            <strong>{Utils.round(this.state.sum.protein, this.state.DECIMALS)} g</strong>
                                        </td>
                                        <td colSpan="2">
                                            <strong>{Utils.round(this.state.sum.energy.kcal, this.state.DECIMALS)} kcal</strong>
                                        </td>                               
                                    </tr> 
                                    { SummaryRow }                        
                                </tfoot>
                                <tbody> 
                                    {Rows}
                                </tbody>
                            </table>
                        </div>  
                    }           
                </div>
                                
               );
    }
}

SelectedFoodsTable.contextTypes = {
    router: React.PropTypes.object
};