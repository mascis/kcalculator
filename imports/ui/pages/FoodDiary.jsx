import React from 'react';
import {_} from 'meteor/underscore';
import i18n from 'meteor/universe:i18n';
import {SweetAlert} from 'meteor/kevohagan:sweetalert';

import {save} from '../../api/diaries/methods.js'; 

import {SessionStorage} from '../../utils/SessionStorage.js';
import {MongoUtil} from '../../utils/MongoUtil.js';
import {Utils} from '../../utils/Utils.js';

import BaseComponent from '../components/BaseComponent.jsx';
import Meal from '../components/fooddiary/Meal.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import DatePicker from '../components/DatePicker.jsx';
import PieChart from '../components/charts/PieChart.jsx';
import UserNotFound from '../components/UserNotFound.jsx';
 
export default class FoodDiary extends BaseComponent {
    
    constructor(props) {
        super(props);
        
        this.state = {               
            meals: [],
            defaultQuantity: 100,
            success: false,
            hasErrors: false,
            quantityErrors: [],
            nameErrors: [],
            hasUnexpectedErrors: false
        };
        
        this.addMeal = this.addMeal.bind(this);
        this.toggleDetails = this.toggleDetails.bind(this);
        this.onChange = this.onChange.bind(this); 
        this.select = this.select.bind(this);
        this.remove = this.remove.bind(this);
        this.removeMeal = this.removeMeal.bind(this);
        this.saveDiary = this.saveDiary.bind(this);
        this.cleanStorage = this.cleanStorage.bind(this);
        this.handleErrors = this.handleErrors.bind(this);
    }
    
    componentWillMount() {
        
        this.updateStorage = _.debounce( function() {
                        
            SessionStorage.setItem("meals", this.state.meals);
            
        }, 500);
        
    }
    
    componentWillUnmount() {
        
        SessionStorage.removeItem("meals");
        
    }
    
    cleanStorage() {
        
        SessionStorage.removeItem("meals");
        
    }
    
    componentWillUpdate(nextProps, nextState) {
        
        if ( !nextProps.loading ) {
            
            if ( SessionStorage.getItem("meals") != null ) {
                
                this.state.meals = JSON.parse(SessionStorage.getItem("meals"));
                
            } else {
                
                this.state.meals = nextProps.diary && nextProps.diary.length ? nextProps.diary[0].meals : [];
                SessionStorage.setItem("meals", this.state.meals);
               
            }
            
        }
                
    }
        
    addMeal() {
        
        const number = this.state.meals.length + 1;
        
        const meal = {
            name: "Ateria " + number,
            foods: []
        };
        this.state.meals.push(meal);
        this.update();
        SessionStorage.setItem("meals", this.state.meals);
        
    }
    
    toggleDetails( e ) {
       
        const mealIndex = e.target.dataset.index;
        const foodIndex = e.target.dataset.foodindex;
        
        const food = this.state.meals[mealIndex].foods[foodIndex]; 
        
        if ( food ) {
            
            food.showDetails = !food.showDetails;
            
        }
        
        this.update();
        
    }
    
    onChange( e ) {
                  
        const mealIndex = e.target.dataset.index; 
        const foodIndex = e.target.dataset.foodindex; 
        
        if ( e.target.name == "name" ) {
            
            this.state.meals[mealIndex].name = e.target.value;
            
        } else {
            
            const id = e.target.dataset.id;
            const foods = this.state.meals[mealIndex].foods;
            
            if ( !foods ) {
                return;
            }
            
            foods[foodIndex].quantity = parseFloat(e.target.value);
            
        }
                
        this.updateStorage();
        this.update();
        
    }
   
    select( food, mealIndex ) {
       
        if ( food == null || !this.state.meals[mealIndex] ) {
            return;
        }
                        
        food.quantity = this.state.defaultQuantity;
        food.showDetails = false;
               
        this.state.meals[mealIndex].foods.push( food );
                
        this.update();

        SessionStorage.setItem("meals", this.state.meals);
        
    }
    
    remove( foodIndex, mealIndex ) {
        
        this.state.meals[mealIndex].foods.splice( foodIndex, 1 );
        this.update();
        
        SessionStorage.setItem("meals", this.state.meals);
        
    }
    
    removeMeal( mealIndex ) {
        
        if ( !this.state || !this.state.meals ) {
            return;
        }

        const that = this;
        const mealName = this.state.meals[mealIndex].name;
        const confirmText = i18n.getTranslation("pages.foodDiary.confirm.text") + " " + mealName + "?";
        
        
        swal({                  
            title: i18n.getTranslation("pages.foodDiary.confirm.title"),
            text: confirmText,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: i18n.getTranslation("pages.foodDiary.confirm.confirmButtonText"),
            cancelButtonText: i18n.getTranslation("pages.foodDiary.confirm.cancelButtonText")
        }, function(isConfirm) {
            
            if (isConfirm) {
                
                that.state.meals.splice( mealIndex, 1 );
                that.update();
                
                SessionStorage.setItem("meals", that.state.meals);  
                
            }
            
        }); 
                
    }
    
    addNameError( i ) {
        
        this.state.nameErrors.push(i);
        
    }
    
    addQuantityError( i ) {
        
        this.state.quantityErrors.push(i);
        
    }
    
    handleErrors( errors ) {
        
        for ( let i = 0; i < errors.length; i++ ) {
            
            const err = errors[i].name.split(".");
            
            if ( err.length == 6 && err[5] == "quantity" ) {
                                
                this.addQuantityError(err[2]);
                
            } else if ( err.length == 4 && err[3] == "name" ) {

                this.addNameError(err[2]);
                
            } else {
                
                this.state.hasUnexpectedErrors = true;
                
            } 
            
        }
                
    }
    
    saveDiary() {
        
        const userId = Meteor.userId();
        
        if ( !Meteor.userId() ) {
            this.state.hasErrors = true;
            this.state.hasUnexpectedErrors = true;
            this.update();
            return;
        }
        
        const data = {};
        data.userId = userId;
        data.meals = this.state.meals;
        
        const doc = MongoUtil.createDiaryDocument( data );
                
        if ( !doc ) {
            this.state.hasErrors = true;
            this.state.hasUnexpectedErrors = true;
            this.update();
            return;
        }
        
        save.call({userId, doc}, ( err, res ) => {
            
            if ( err ) {
                this.handleErrors(err.errors);
                this.state.hasErrors = true;
                this.update();
            }
            
            if ( !err && res ) {
                
                this.state.hasErrors = false;
                this.state.hasUnexpectedErrors = false;
                this.state.quantityErrors = [];
                this.state.nameErrors = [];
                this.state.success = true;
                this.update();
                
                setTimeout(
                        function(){
                            
                            location.reload(); 
                            
                        }, 2000);
                
            }
            
        });
        
    }
    
    render() {
        
        const {
            loading
        } = this.props;
              
        let Content;
        let Meals = [];
        
        if ( Meteor.user() ) {
            
            if ( !loading ) {
                
                for( let i = 0; i < this.state.meals.length; i++ ) {
                                        
                    Meals.push(<Meal                     
                            key={i} 
                            index={i} 
                            removeMeal={this.removeMeal}
                            selectFood={this.select} 
                            removeFood={this.remove}
                            mealName={this.state.meals[i].name}
                            selectedFoods={this.state.meals[i].foods}
                            onChange={this.onChange}
                            toggleDetails={this.toggleDetails}
                            hasQuantityError={Utils.inArray(this.state.quantityErrors, i)}
                            hasNameError={Utils.inArray(this.state.nameErrors, i)}
                    />);
                    
                }
                
            }
            
            Content = (
                    
                    <div>
                    
                        <DatePicker onChange={this.cleanStorage}/>
                        
                        <div id="mealsContainer">
                            {Meals}                
                            <span className="fa fa-plus-circle add" onClick={this.addMeal}></span>
                            {
                                this.state.hasErrors
                                
                                ?
                                
                                <div className="alert alert-danger">
                                    <strong>{i18n.getTranslation("common.errors.save-failed")}</strong> 
                                    {
                                        this.state.hasUnexpectedErrors
                                        
                                        ?
                                        
                                        <span>&nbsp;{i18n.getTranslation("common.errors.unexpected")}</span>
                                        
                                        :
                                            
                                        ''
                                    }
                                    
                                    {
                                        this.state.quantityErrors.length > 0 || this.state.nameErrors.length > 0
                                        
                                        ?
                                        
                                        <span>&nbsp;{i18n.getTranslation("common.errors.validation")}</span>
                                        
                                        :
                                            
                                        ''
                                    }
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
                                
                                <input type="button" className="btn btn-primary save" value={i18n.getTranslation("common.buttons.save")} onClick={this.saveDiary}/>
                                
                            }                         
                        </div>
                            
                    </div>    
            );
            
        } else {
            
            Content = (
            
                <UserNotFound message={i18n.getTranslation("components.userNotFound.foodDiaryMessage")}/>
            
            );
            
        }
        
        
        
        
        return (
                <div className="centered">
                    {
                        
                        loading
                        
                        ?
                          
                        <LoadingSpinner/>
                                
                        :  
                            
                        Content
                        
                    }
                    
                </div>
                    
               );
    }
    
    
}

FoodDiary.propTypes = {
        loading: React.PropTypes.bool,
        diary: React.PropTypes.array
};
