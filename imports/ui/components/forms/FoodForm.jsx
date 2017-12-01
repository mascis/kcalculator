import React from 'react';
import BaseComponent from './../BaseComponent.jsx';
import {_} from 'meteor/underscore';
import i18n from 'meteor/universe:i18n';

import {MongoUtil} from '../../../utils/MongoUtil.js';
import {Utils} from '../../../utils/Utils.js';

import {CATEGORIES} from '../../helpers/Categories.js';

import {Foods} from '../../../api/foods/foods.js';
import {insert} from '../../../api/foods/methods.js';
import {update} from '../../../api/foods/methods.js';

import VitaminItem from './VitaminItem.jsx';
import CategoryItem from './CategoryItem.jsx';

export default class FoodForm extends BaseComponent {
       
    constructor( props ) {
        super( props );
        
        this.state = { 
            success: false,
            numeric: [
                       "kcal", 
                       "kJ", 
                       "sumFats", 
                       "saturated",
                       "monounsaturated",
                       "polyunsaturated",
                       "sumCarbs", 
                       "sugar", 
                       "polyol",
                       "starch",
                       "protein", 
                       "salt",
                       "fibre",
                       "lactose"
                       ],
            required: [
                       "title",
                       "unit",
                       "kcal", 
                       "kJ", 
                       "sumFats", 
                       "saturated", 
                       "sumCarbs", 
                       "sugar", 
                       "protein", 
                       "salt"
                       ],
            isAdded: {                
                brand: false,
                monounsaturated: false,
                polyunsaturated: false,
                polyol: false,
                starch: false,
                fibre: false,
                lactose: false
            },            
            title: '',
            brand: '',
            unit: 'g',
            kcal: 0,
            kJ: 0,
            sumFats: 0,
            saturated: 0,
            monounsaturated: 0,
            polyunsaturated: 0,
            sumCarbs: 0,
            sugar: 0,
            polyol: 0,
            starch: 0,
            protein: 0,
            fibre: 0,
            salt: 0,
            lactose: 0,
            vitamins: [],
            categories: [],
            tags: '',
            showError: {
                validation: false,
                title: false,
                brand: false,
                energy: {
                    kcal: false,
                    kJ: false,    
                },
                fats: {
                    sum: false,
                    saturated: false,
                    monounsaturated: false,
                    polyunsaturated: false, 
                },
                carbs: {
                    sum: false,
                    sugar: false,
                    polyol: false,
                    starch: false,
                },                
                protein: false,
                fibre: false,
                salt: false,
                lactose: false,
                vitamins: []
            },
            numSaveClicks: 0
        };   
                  
        this.onRemoveCategory = this.onRemoveCategory.bind(this);
        this.onAddCategory = this.onAddCategory.bind(this);
        this.onRemoveVitamin = this.onRemoveVitamin.bind(this);
        this.onAddVitamin = this.onAddVitamin.bind(this);  
        this.handleChange = this.handleChange.bind(this);        
        this.setAdded = this.setAdded.bind(this);
        this.unsetAdded = this.unsetAdded.bind(this);
             
        this.isEnergy = this.isEnergy.bind(this);
        this.isCarb = this.isCarb.bind(this);
        this.isFat = this.isFat.bind(this);
        this.addError = this.addError.bind(this);
        this.handleRemoveError = this.handleRemoveError.bind(this);
        this.removeError = this.removeError.bind(this);
        this.showErrorMessages = this.showErrorMessages.bind(this);
        this.checkAndReturnCategories = this.checkAndReturnCategories.bind(this);
        
        this.createDocument = this.createDocument.bind(this);
        this.addFood = this.addFood.bind(this);
        this.updateFood = this.updateFood.bind(this);
        
    }

    componentWillMount() {
                
        if ( this.props.food ) {
            
            const food = this.props.food;
                        
            this.state._id = food._id;
            this.state.title = food.title;            
            if ( food.brand != null ) {
                this.state.brand = food.brand;
                this.state.isAdded.brand = true;
            }
            this.state.unit = food.nutritional_values.unit;
            this.state.kcal = food.nutritional_values.energy.kcal;
            this.state.kJ = food.nutritional_values.energy.kJ;
            
            this.state.sumFats = food.nutritional_values.fats.sum;
            this.state.saturated = food.nutritional_values.fats.saturated;            
            if ( food.nutritional_values.fats.monounsaturated != null ) {
                this.state.monounsaturated = food.nutritional_values.fats.monounsaturated;
                this.state.isAdded.monounsaturated = true;
            }
            if ( food.nutritional_values.fats.polyunsaturated != null ) {
                this.state.polyunsaturated = food.nutritional_values.fats.polyunsaturated;
                this.state.isAdded.polyunsaturated = true;
            }
            
            this.state.sumCarbs = food.nutritional_values.carbs.sum;
            this.state.sugar = food.nutritional_values.carbs.sugar;            
            if ( food.nutritional_values.carbs.polyol != null ) {
                this.state.polyol = food.nutritional_values.carbs.polyol;
                this.state.isAdded.polyol = true;
            }
            if ( food.nutritional_values.carbs.starch != null ) {
                this.state.starch = food.nutritional_values.carbs.starch;
                this.state.isAdded.starch = true;
            }

            this.state.protein = food.nutritional_values.protein; 
            
            if ( food.nutritional_values.lactose != null ) {
                this.state.lactose = food.nutritional_values.lactose;
                this.state.isAdded.lactose = true;
            }
            
            if ( food.nutritional_values.fibre != null ) {
                this.state.fibre = food.nutritional_values.fibre;
                this.state.isAdded.fibre = true;
            }
            
            this.state.salt = food.nutritional_values.salt; 
            
            if ( food.nutritional_values.vitamins != null ) {
                this.state.vitamins = food.nutritional_values.vitamins;
                
            }
           
            if ( food.categories != null ) {
                
                for( i = 0; i < food.categories.length; i++ ) {
                    
                    const key = new Date().getTime() + i;
                    
                    const category = {
                            key: key,
                            value: food.categories[i]
                    };
                    
                    this.state.categories.push(category);
                    
                }
                
            }
            
            if ( food.tags != null ) {
                                
                this.state.tags = food.tags.join(", ");
                
                
            }
            
        }
        
    }
    
    isEnergy( name ) {
        
        return name == "kJ" || name == "kcal";
        
    }
    
    isCarb( name ) {
        
        return name == "carbsSum" || name == "sugar" || name == "polyol" || name == "starch";
        
    }
    
    isFat( name ) {
        
        return name == "fatsSum" || name == "saturated" || name == "monounsaturated" || name == "polyunsaturated";
        
    }
    
    handleRemoveError( name ) {
        
        if ( this.isEnergy( name) ) { 
            
            this.removeError("energy", name);  
        }
        
        if ( this.isFat( name) ) { 
            
            if ( "sumFats" == name ) {
                this.removeError("fats", "sum"); 
            } else {
                this.removeError("fats", name);  
            }
            
        }
        
        if ( this.isCarb( name) ) { 
            
            if ( "sumCarbs" == name ) {
                this.removeError("carbs", "sum"); 
            } else {
                this.removeError("carbs", name);  
            }
            
        }
        
    }
    
    // arguments: object, property, index
    addError() { 
                
        if ( arguments.length == 1 ) {
            
            this.state.showError[arguments[0]] = true;
            
        }
        
        if ( arguments.length == 2 ) {
            
            this.state.showError[arguments[0]][arguments[1]] = true;
            
        }
        
        if ( arguments.length == 3 ) {
                        
            const errors = this.state.showError[arguments[0]];
            const obj = {"index": parseInt(arguments[2]), "prop": arguments[1]}
            
            const index = Utils.findIndex( errors, obj );
            
            if ( index == -1 ) {
                errors.push(obj);
            }
            
        }
        
    }
    
    // arguments: object, property, index, update(boolean)
    removeError() {
                
        if ( arguments.length == 1 ) {
            
            this.state.showError[arguments[0]] = false;
            
        }
        
        if ( arguments.length == 2 ) {
            
            this.state.showError[arguments[0]][arguments[1]] = false;
            
        }
        
        if ( arguments.length == 3 ) {
                        
            const errors = this.state.showError[arguments[0]];
            
            const obj = {"index": arguments[2], "prop": arguments[1]}
            
            const index = Utils.findIndex( errors, obj );
                        
            if ( index > -1 ) {
                errors.splice(index, 1);
            }
            
        }
        
        if ( arguments.length == 4 ) {
            
            const errors = this.state.showError[arguments[0]];
            
            for( i = errors.length - 1; i >= 0; i-- ) {
                
                if ( errors[i].index == arguments[2] ) {
                    errors.splice(i, 1);
                }
                
            }
            
            if ( arguments[2] != this.state.vitamins.length - 1 ) {
                
                for ( i = 0; i < errors.length; i++ ) {
                    
                    if ( errors[i].index > arguments[2] ) {
                        errors[i].index = errors[i].index - 1;                      
                    }
                    
                }
                
            }
            
        }
        
    }
    
    showErrorMessages( errors ) {
        
        this.state.showError.validation = true;
        
        for ( i = 0; i < errors.length; i++ ) {
            
            const splitArr = errors[i].name.split(".");

            if ( splitArr.length == 2 ) {
                
                this.addError(splitArr.pop());
                
            }
            
            if ( splitArr.length == 3 ) {
                
                const prop = splitArr.pop();
                
                if ( prop != "energy" && prop != "fats" && prop != "carbs" && prop != "vitamins") {
                    this.addError(prop);  
                }
                
            }
            
            if ( splitArr.length == 4 ) {
                
                this.addError(splitArr[2], splitArr[3]);

            }
            
            if ( splitArr.length == 5 ) {
                
                this.addError(splitArr[2], splitArr[4], splitArr[3]);
                
            }
                        
        }
        
        this.update();
        
    }
    
    checkAndReturnCategories() {
        
        const categories = this.state.categories;
        
        if ( categories.length > 0 ) {
            
            for ( i = categories.length - 1; i >= 0; i-- ) {
                
                if ( categories[i].value == CATEGORIES.NOT_SELECTED.value ) {
                    categories.splice(i, 1);
                }
                
            }
            
        }
        
        return _.uniq(categories, true, function( category, index, value) { return category.value; });
        
    }
    
    
    onRemoveCategory( e ) { 
        
        const index = e.target.dataset.index;
        
        this.state.categories.splice(index, 1);

        this.update();
        
    }
    
    onAddCategory( e ) { 
        
        const key = new Date().getTime();
       
        const category = {
                key: key,
                value: CATEGORIES.NOT_SELECTED.value
        };
        
        this.state.categories.push(category);
        
        this.update();
        
    }
        
    onRemoveVitamin( e ) {                    
               
        const index = e.target.dataset.index;
        
        this.removeError("vitamins", null, index, true);
        
        this.state.vitamins.splice(index, 1);
        
        this.update();
                
    }
    
    onAddVitamin( e ) {
           
        const values = {
                name: null,
                unit: 'mg',
                quantity: undefined
        };
        
        this.state.vitamins.push(values);
        
        this.update();
        
    }
    
    handleChange( e ) {
                
        if ( e.target.name.startsWith("vitamin-") ) {
                                    
            const name = e.target.name.split("-").pop();
            const index = e.target.dataset.index;                      
            const vitamin = this.state.vitamins[index];            
            
            if ( name == "quantity" ) {
                vitamin[name] = parseFloat(e.target.value);
                
                if ( !isNaN(vitamin[name]) ) {
                    this.removeError("vitamins", name, index);
                }
                
            } else {
                
                vitamin[name] = e.target.value;
                
                if ( e.target.value != null && e.target.value.length > 0 ) {
                    this.removeError("vitamins", name, index);
                }
            }    
            
        } else if ( e.target.name == "categories" ) {
                         
            this.state.categories[e.target.dataset.index].value = e.target.value;
                              
        } else {
              
            this.state[e.target.name] = e.target.value;
            
            if ( Utils.inArray(this.state.numeric, e.target.name) && !isNaN(e.target.value) && e.target.value > 0 ) {
                
                this.handleRemoveError( e.target.name );
                          
            }
            
            if ( e.target.value != null && e.target.value.length > 0) {
                this.removeError(e.target.name);                
            }
        }
        
        this.update();
        
    }
    
    setAdded( e ) {
        
        if ( this.state.isAdded.hasOwnProperty( e.target.id ) ) {
            
            this.state.isAdded[e.target.id] = true;
            
        }
        
        this.update();
      
    }
    
    unsetAdded( e ) {
        
        const prop = e.target.id;
        
        if ( this.state.isAdded.hasOwnProperty( e.target.id ) ) {
            
            this.state.isAdded[prop] = false;
            
        }
        
        if ( Utils.inArray(this.state.numeric, prop) ) {
            this.state[prop] = 0;
        } else {
            this.state[prop] = '';
        }
                    
        this.handleRemoveError( prop );        
        
        this.update();

    }
    
    createDocument() {
        
        const data = {};
        
        for ( prop in this.state ) {     
                                    
            if ( prop == "categories" ) {
                
                const categories = this.checkAndReturnCategories();
                
                if ( categories.length > 0 ) {
                    
                    data.categories = [];
                    
                    for ( i = 0; i < categories.length; i++ ) {
                        data.categories.push(parseInt(categories[i].value));
                    }
                    
                }
                
            } else if ( prop == "vitamins" ) {                    
                                
                if ( this.state.vitamins.length > 0 ) { 
                    data.vitamins = [];
                    
                    this.state.vitamins.forEach(( vitamin ) => {
                        
                        const v = {};
                        v.name = Utils.removeWhitespaces(vitamin.name);
                        v.unit = vitamin.unit;
                        v.quantity = vitamin.quantity;
                        data.vitamins.push(v);
                        
                    });
                    
                }
                
            } else if ( prop == "tags" ) {
                
                if ( this.state.tags.length > 0 ) {
                    data.tags = [];
                    const tags = this.state.tags.split(",");
                    
                    tags.forEach(( tag ) => {
                        data.tags.push(Utils.removeWhitespaces(tag));
                    });
                    
                }
                
            } else {                
                
                if ( ( this.state.isAdded.hasOwnProperty( prop ) && this.state.isAdded[prop] ) ||
                        Utils.inArray( this.state.required, prop ) ) {
                                 
                    if ( !isNaN(this.state[prop]) ) {
                        data[prop] = parseFloat(this.state[prop]);
                    } else {
                        data[prop] = this.state[prop];
                    }
                    
                }
                
            }
            
        }       

        const document = MongoUtil.createDocument(data);
        
        return document;
        
    }
       
    updateFood() {
        
        this.setState({
            numSaveClicks: this.state.numSaveClicks++
        });
        
        const document = this.createDocument();
                
        if ( document != null ) {                  
            
            const id = this.state._id;
            
            update.call({id, document}, (err, res) => {
                
                if ( err ) {
                    
                    this.showErrorMessages(err.errors); 
                    
                }
                
                if ( !err && res > 0 ) {
                    
                    this.state.success = true;
                    this.update();
                    
                    setTimeout(
                            function(){
                                
                                location.reload(); 
                                
                            }, 2000);
                    
                }
                 
              });
            
        }
        
    }
    
    addFood() {
        
        this.setState({
            numSaveClicks: this.state.numSaveClicks++
        });

        const document = this.createDocument();
                     
        if ( document != null ) {                  
            
            insert.call( { document }, (err, res) => {
                                   
                if ( err ) {
                    
                    this.showErrorMessages(err.errors); 
                    
                }
                
                if ( !err && res ) {
                    
                    this.state.success = true;
                    this.update();
                    
                    setTimeout(
                            function(){
                                
                                location.reload(); 
                                
                            }, 2000);
                    
                }
               
              });
            
        }
        
    }
    
    render() {
        
        const {
            type,
            food
        } = this.props;
                
        const action = type == "add" ? this.addFood : this.updateFood;
        
        const renderCategories = [];
        const renderVitamins = [];
        
        for( index = 0; index < this.state.categories.length; index++ ) {            
            const key = this.state.categories[index].key;            
            renderCategories.push(<CategoryItem key={key} index={index} value={this.state.categories[index].value} remove={this.onRemoveCategory}/>);
        }
        
        for( index = 0; index < this.state.vitamins.length; index++ ) {            
            const values = this.state.vitamins[index];            
            if ( this.state.numSaveClicks > 0 ) {
                renderVitamins.push(<VitaminItem key={index} index={index} values={values} remove={this.onRemoveVitamin} errors={this.state.showError.vitamins}/>);
            } else {
                renderVitamins.push(<VitaminItem key={index} index={index} values={values} remove={this.onRemoveVitamin}/>);
            }
            
        }
        
        return (
                
                <div id="foodFormContainer" className="centered">
                    
                    <form id="foodForm" onChange={this.handleChange}>
                       
                        <fieldset>
                            <legend>{i18n.__("pages.addFood.info")}</legend>
                            <div className="form-group"> 
                                {
                                    this.state.showError.title
                                    
                                    ?
                                    
                                    <div className="alert alert-danger">
                                        <strong>{i18n.getTranslation("common.errors.stringExpected")}</strong>
                                    </div>
                                            
                                    :
                                    
                                    ''
                                } 
                                <div className={this.state.showError.title ? "has-error" : '' }>
                                    <label htmlFor="title">{i18n.__("pages.addFood.title.label")}</label>
                                    <input type="text" className="form-control" name="title" placeholder={i18n.__("pages.addFood.title.placeholder")} value={this.state.title}></input>
                                </div>                                        
                                <div>
                                    {
                                        this.state.showError.brand
                                        
                                        ?
                                        
                                        <div className="alert alert-danger">
                                            <strong>{i18n.getTranslation("common.errors.stringExpected")}</strong> {i18n.getTranslation("common.errors.optional")}
                                        </div>
                                                
                                        :
                                        
                                        ''
                                    }   
                                    <label htmlFor="brand">{i18n.__("pages.addFood.brand.label")}</label>
                                    
                                    { this.state.isAdded.brand 
                                        
                                        ?
                                        
                                        <div className={this.state.showError.brand ? "has-error optional-field" : "optional-field" }>
                                            <input type="text" className="form-control" name="brand" value={this.state.brand} placeholder={i18n.__("pages.addFood.brand.placeholder")}></input>
                                            <span className="fa fa-minus-circle remove" id="brand" onClick={this.unsetAdded}></span>
                                        </div>
                                         
                                        :
                                           
                                        <div className="optional-field">
                                            <span className="fa fa-plus-circle add" id="brand" onClick={this.setAdded}></span>
                                        </div>
                                        
                                            
                                    }                                
                                </div>
                                <div>
                                    <label htmlFor="unit">{i18n.__("pages.addFood.unit")}</label>
                                    <select name="unit" className="form-control">
                                        <option value="g">100 g</option>
                                        <option value="ml">100 ml</option>
                                    </select>
                                </div>
                            </div>
                        </fieldset>
                                        
                        <fieldset>
                            <legend>{i18n.__("pages.addFood.energy.header")}</legend>
                            <div className="form-group">                            
                                <div className={this.state.showError.energy.kJ ? "has-error" : ''}>
                                    {
                                        this.state.showError.energy.kJ
                                        
                                        ?
                                        
                                        <div className="alert alert-danger">
                                            <strong>{i18n.getTranslation("common.errors.numberExpected")}</strong>
                                        </div>
                                                
                                        :
                                        
                                        ''
                                    }  
                                    <label htmlFor="kJ">{i18n.__("pages.addFood.energy.kJ")}</label>
                                    <input type="number" min="0" className="form-control" name="kJ" value={this.state.kJ}></input>
                                </div> 
                                <div className={this.state.showError.energy.kcal ? "has-error" : '' }>
                                    {
                                        this.state.showError.energy.kcal
                                        
                                        ?
                                        
                                        <div className="alert alert-danger">
                                            <strong>{i18n.getTranslation("common.errors.numberExpected")}</strong>
                                        </div>
                                                
                                        :
                                        
                                        ''
                                    } 
                                    <label htmlFor="kcal">{i18n.__("pages.addFood.energy.kcal")}</label>     
                                    <input type="number" min="0" className="form-control" name="kcal" value={this.state.kcal}></input> 
                                </div>
                            </div>
                        </fieldset>
                                    
                        <fieldset>
                            <legend>{i18n.__("pages.addFood.fats.header")}</legend>                                
                            <div className="form-group">
                                <div className={this.state.showError.fats.sum ? "has-error" : '' }>
                                    {
                                        this.state.showError.fats.sum
                                        
                                        ?
                                        
                                        <div className="alert alert-danger">
                                            <strong>{i18n.getTranslation("common.errors.numberExpected")}</strong>
                                        </div>
                                                
                                        :
                                        
                                        ''
                                    }
                                    <label htmlFor="sumFats">{i18n.__("pages.addFood.fats.sum")}</label>
                                    <input type="number" min="0" className="form-control" name="sumFats" value={this.state.sumFats}></input>
                                </div>
                                <div className={this.state.showError.fats.saturated ? "has-error" : '' }>
                                    {
                                        this.state.showError.fats.saturated
                                        
                                        ?
                                        
                                        <div className="alert alert-danger">
                                            <strong>{i18n.getTranslation("common.errors.numberExpected")}</strong>
                                        </div>
                                                
                                        :
                                        
                                        ''
                                    }
                                    <label htmlFor="saturated">{i18n.__("pages.addFood.fats.saturated")}</label>
                                    <input type="number" min="0" className="form-control" name="saturated" value={this.state.saturated}></input>
                                </div>                                    
                                <div>
                                    {
                                        this.state.showError.fats.monounsaturated
                                        
                                        ?
                                        
                                        <div className="alert alert-danger">
                                            <strong>{i18n.getTranslation("common.errors.numberExpected")}</strong> {i18n.getTranslation("common.errors.optional")}
                                        </div>
                                                
                                        :
                                        
                                        ''
                                    }
                                    <label htmlFor="monounsaturated">{i18n.__("pages.addFood.fats.monounsaturated")}</label>                                
                                    { this.state.isAdded.monounsaturated 
                                        
                                        ?
                                        
                                        <div className={this.state.showError.fats.monounsaturated ? "has-error optional-field" : 'optional-field'}>
                                            <input type="number" min="0" className="form-control" name="monounsaturated" value={this.state.monounsaturated}></input>
                                            <span className="fa fa-minus-circle remove" id="monounsaturated" onClick={this.unsetAdded}></span>    
                                        </div>
                                         
                                        :
                                          
                                        <div className="optional-field">
                                            <span className="fa fa-plus-circle add" id="monounsaturated" onClick={this.setAdded}></span>
                                        </div>  
                                    } 
                                </div>                                    
                                <div>
                                    {
                                        this.state.showError.fats.polyunsaturated
                                        
                                        ?
                                        
                                        <div className="alert alert-danger">
                                            <strong>{i18n.getTranslation("common.errors.numberExpected")}</strong> {i18n.getTranslation("common.errors.optional")}
                                        </div>
                                                
                                        :
                                        
                                        ''
                                    }
                                    <label htmlFor="polyunsaturated">{i18n.__("pages.addFood.fats.polyunsaturated")}</label>
                                    { this.state.isAdded.polyunsaturated 
                                        
                                        ?
                                        
                                        <div className={this.state.showError.fats.polyunsaturated ? "has-error optional-field" : 'optional-field'}>
                                            <input type="number" min="0" className="form-control" name="polyunsaturated" value={this.state.polyunsaturated}></input>
                                            <span className="fa fa-minus-circle remove" id="polyunsaturated" onClick={this.unsetAdded}></span>    
                                        </div>
                                         
                                        :
                                          
                                        <div className="optional-field">
                                            <span className="fa fa-plus-circle add" id="polyunsaturated" onClick={this.setAdded}></span>
                                        </div>  
                                    }                                   
                                </div>
                            </div>
                        </fieldset>
                        
                        <fieldset>
                            <legend>{i18n.__("pages.addFood.carbs.header")}</legend>
                            <div className="form-group">
                                <div className={this.state.showError.carbs.sum ? "has-error" : ''}>
                                    {
                                        this.state.showError.carbs.sum
                                        
                                        ?
                                        
                                        <div className="alert alert-danger">
                                            <strong>{i18n.getTranslation("common.errors.numberExpected")}</strong>
                                        </div>
                                                
                                        :
                                        
                                        ''
                                    }
                                    <label htmlFor="sumCarbs">{i18n.__("pages.addFood.carbs.sum")}</label>
                                    <input type="number" min="0" className="form-control" name="sumCarbs" value={this.state.sumCarbs}></input>
                                </div>                                    
                                <div className={this.state.showError.carbs.sugar ? "has-error" : ''}>
                                    {
                                        this.state.showError.carbs.sugar
                                        
                                        ?
                                        
                                        <div className="alert alert-danger">
                                            <strong>{i18n.getTranslation("common.errors.numberExpected")}</strong>
                                        </div>
                                                
                                        :
                                        
                                        ''
                                    }
                                    <label htmlFor="sugar">{i18n.__("pages.addFood.carbs.sugar")}</label>
                                    <input type="number" min="0" className="form-control" name="sugar" value={this.state.sugar}></input>
                                </div>                                 
                                <div>
                                    {
                                        this.state.showError.carbs.polyol
                                        
                                        ?
                                        
                                        <div className="alert alert-danger">
                                            <strong>{i18n.getTranslation("common.errors.numberExpected")}</strong> {i18n.getTranslation("common.errors.optional")}
                                        </div>
                                                
                                        :
                                        
                                        ''
                                    }
                                    <label htmlFor="polyol">{i18n.__("pages.addFood.carbs.polyol")}</label>
                                    { this.state.isAdded.polyol
                                        
                                        ?
                                        
                                        <div className={this.state.showError.carbs.polyol ? "has-error optional-field" : 'optional-field'}>
                                            <input type="number" min="0" className="form-control" name="polyol" value={this.state.polyol}></input>
                                            <span className="fa fa-minus-circle remove" id="polyol" onClick={this.unsetAdded}></span>    
                                        </div>
                                         
                                        :
                                          
                                        <div className="optional-field">
                                            <span className="fa fa-plus-circle add" id="polyol" onClick={this.setAdded}></span>
                                        </div>  
                                    }    
                                </div>  
                                <div>     
                                    {
                                        this.state.showError.carbs.starch
                                        
                                        ?
                                        
                                        <div className="alert alert-danger">
                                            <strong>{i18n.getTranslation("common.errors.numberExpected")}</strong> {i18n.getTranslation("common.errors.optional")}
                                        </div>
                                                
                                        :
                                        
                                        ''
                                    }
                                    <label htmlFor="starch">{i18n.__("pages.addFood.carbs.starch")}</label>                                
                                    { this.state.isAdded.starch
                                        
                                        ?
                                        
                                        <div className={this.state.showError.carbs.starch ? "has-error optional-field" : 'optional-field'}>
                                            <input type="number" min="0" className="form-control" name="starch" value={this.state.starch}></input>
                                            <span className="fa fa-minus-circle remove" id="starch" onClick={this.unsetAdded}></span>    
                                        </div>
                                         
                                        :
                                          
                                        <div className="optional-field">
                                            <span className="fa fa-plus-circle add" id="starch" onClick={this.setAdded}></span>
                                        </div>  
                                    }                                    
                                </div>
                            </div>
                        </fieldset>
                                    
                        <fieldset> 
                            <legend>{i18n.__("pages.addFood.protein")}</legend>
                            <div className="form-group">
                                {
                                    this.state.showError.protein
                                    
                                    ?
                                    
                                    <div className="alert alert-danger">
                                        <strong>{i18n.getTranslation("common.errors.numberExpected")}</strong>
                                    </div>
                                            
                                    :
                                    
                                    ''
                                }
                                <div className={this.state.showError.protein ? "has-error" : ''}>
                                    <input type="number" min="0" className="form-control" name="protein" value={this.state.protein}></input>
                                </div>
                            </div>
                        </fieldset> 
                            
                        <fieldset> 
                            <legend>{i18n.__("pages.addFood.salt")}</legend>
                            <div className="form-group">
                                {
                                    this.state.showError.salt
                                    
                                    ?
                                    
                                    <div className="alert alert-danger">
                                        <strong>{i18n.getTranslation("common.errors.numberExpected")}</strong>
                                    </div>
                                            
                                    :
                                    
                                    ''
                                }
                                <div className={this.state.showError.salt ? "has-error" : ''}>
                                    <input type="number" min="0" className="form-control" name="salt" value={this.state.salt}></input>
                                </div>
                            </div>
                        </fieldset>  
                            
                        <fieldset> 
                            <legend>{i18n.__("pages.addFood.fibre")}</legend>            
                            <div className="form-group">
                                {
                                    this.state.showError.fibre
                                    
                                    ?
                                    
                                    <div className="alert alert-danger">
                                        <strong>{i18n.getTranslation("common.errors.numberExpected")}</strong> {i18n.getTranslation("common.errors.optional")}
                                    </div>
                                            
                                    :
                                    
                                    ''
                                }
                                <div>
                                    { this.state.isAdded.fibre
                                        
                                        ?
                                        
                                        <div className={this.state.showError.fibre ? "has-error optional-field" : 'optional-field'}>
                                            <input type="number" min="0" className="form-control" name="fibre" value={this.state.fibre}></input>
                                            <span className="fa fa-minus-circle remove" id="fibre" onClick={this.unsetAdded}></span>    
                                        </div>
                                         
                                        :
                                          
                                        <div className="optional-field">
                                            <span className="fa fa-plus-circle add" id="fibre" onClick={this.setAdded}></span>
                                        </div>  
                                    }    
                                </div>
                            </div>
                        </fieldset>
                            
                        <fieldset> 
                            <legend>{i18n.__("pages.addFood.vitamins.header")}</legend>
                            <div className="form-group">
                                <div>
                                    <div id="vitaminContainer">                            
                                        {renderVitamins}                                        
                                    </div>      
                                    <span className="fa fa-plus-circle add" onClick={this.onAddVitamin}></span>
                                </div>
                             </div>
                        </fieldset>
                            
                        <fieldset> 
                            <legend>{i18n.__("pages.addFood.lactose")}</legend>    
                            <div className="form-group">
                                {
                                    this.state.showError.lactose
                                    
                                    ?
                                    
                                    <div className="alert alert-danger">
                                        <strong>{i18n.getTranslation("common.errors.numberExpected")}</strong> {i18n.getTranslation("common.errors.optional")}
                                    </div>
                                            
                                    :
                                    
                                    ''
                                }
                                <div>
                                    { this.state.isAdded.lactose
                                        
                                        ?
                                        
                                        <div className={this.state.showError.lactose ? "has-error optional-field" : 'optional-field'}>
                                            <input type="number" min="0" className="form-control" name="lactose" value={this.state.lactose}></input>
                                            <span className="fa fa-minus-circle remove" id="lactose" onClick={this.unsetAdded}></span>    
                                        </div>
                                         
                                        :
                                          
                                        <div className="optional-field">
                                            <span className="fa fa-plus-circle add" id="lactose" onClick={this.setAdded}></span>
                                        </div>  
                                    }   
                                </div>
                            </div>                            
                        </fieldset>
                            
                        <fieldset>
                            <legend>{i18n.__("pages.addFood.categories")}</legend>
                            <div className="form-group">
                                <div>
                                    {renderCategories}
                                    <span className="fa fa-plus-circle add" onClick={this.onAddCategory}></span>
                                </div>
                            </div>
                        </fieldset> 
                        
                        <fieldset>
                            <legend>{i18n.__("pages.addFood.tags")}</legend>
                            <div className="form-group">
                                <div>
                                    <textarea className="form-control" rows="3" name="tags" value={this.state.tags}></textarea>
                                </div>
                            </div>
                        </fieldset> 
                        
                        <div className="form-group">
                            <div>
                            {
                                this.state.showError.validation
                                
                                ?
                                
                                <div className="alert alert-danger">
                                    <strong>{i18n.getTranslation("common.errors.save-failed")}</strong> {i18n.getTranslation("common.errors.validation")}
                                </div>
                                        
                                :
                                
                                ''
                            }
                            
                            {
                                this.state.success
                                
                                ?
                                        
                                <div className="alert alert-success">
                                    <strong>{i18n.getTranslation("common.save-successful")}</strong>
                                </div> 
                                        
                                :
                                    
                                <input type="button" className="btn btn-primary" value={i18n.__("common.buttons.save")} onClick={action}/>
                            } 
                            </div>
                        </div> 
                            
                    </form>
                        
                        
                </div>

            );
    }
    
}