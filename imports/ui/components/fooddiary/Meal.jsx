import React from 'react';

import BaseComponent from './../BaseComponent.jsx';

import SelectedFoodsTable from '../../components/calculator/SelectedFoodsTable.jsx';
import SearchContainer from '../../containers/SearchContainer.jsx';

export default class Meal extends BaseComponent {
    
    constructor( props ) {
        super( props );
        
        this.state = {
            editing: false
        }
        
        this.onRemoveMeal = this.onRemoveMeal.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
    }
    
    onRemoveMeal( e ) {
        
        this.props.removeMeal(e.target.dataset.index);
        
    }
    
    onClick( e ) {
            
        this.state.editing = !this.state.editing;
        this.update();
        
    }
    
    onKeyPress( e ) {
        
        const code = (e.keyCode ? e.keyCode : e.which);

        if ( code == 13 ) {
            
            if ( e.target.value == "" ) {
                return;
            }
            
            this.state.editing = false;
            this.update();
            
        }
        
    }
    
    render() {
        
        const {
            editing
        } = this.state;
        
        const {
           index,
           removeMeal,
           selectFood,
           removeFood,
           mealName,
           selectedFoods,
           onChange,
           toggleDetails,
           hasQuantityError,
           hasNameError
       } = this.props;
        
        const searchKey = "search" + index;
       
        return (
                <div className="meal-container" data-index={index}>
                    {
                        
                        editing
                        
                        ?
                        <div>  
                            <input name="name" type="text" value={mealName} className="form-control" onChange={onChange} onKeyPress={this.onKeyPress} data-index={index}/>
                            <input type="button" value={i18n.getTranslation("common.buttons.save")} className="btn btn-primary" onClick={this.onClick}/>   
                            <span className="fa fa-times-circle cancel" onClick={this.onClick}></span>
                        </div>        
                        :
                           
                        <div onClick={this.onClick}> 
                            <h3 name="name">{mealName}</h3>
                            <span className="fa fa-pencil-square edit"></span>
                            {
                                hasNameError
                                
                                ?
                                 
                                <div className="alert alert-danger">
                                    <strong>{i18n.getTranslation("pages.foodDiary.errors.name")}</strong>
                                </div>
                                    
                                :
                                    
                                ""
                            }
                        </div>
                    }
                
                    
                    <span className="fa fa-times-circle remove-meal" data-index={index} onClick={this.onRemoveMeal}></span>
                    
                    {
                        hasQuantityError
                        
                        ?
                         
                        <div className="alert alert-danger">
                            <strong>{i18n.getTranslation("pages.foodDiary.errors.quantity")}</strong>
                        </div>
                            
                        :
                            
                        ""
                    }
                    
                    <div className="selected-food-container">
                        <SelectedFoodsTable 
                            selectedFoods={selectedFoods} 
                            remove={removeFood} 
                            onChange={onChange} 
                            toggleDetails={toggleDetails}
                            index={index}/> 
                    </div>
                    <SearchContainer id={searchKey} limit={5} select={selectFood} remove={removeFood} index={index}/>     
                </div>
                    
               );
    }
    
    
}