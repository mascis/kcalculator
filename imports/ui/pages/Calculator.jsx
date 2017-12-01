import React from 'react';
import {Link} from 'react-router-dom';
import i18n from 'meteor/universe:i18n';
import {_} from 'meteor/underscore';

import {SessionStorage} from '../../utils/SessionStorage.js';

import BaseComponent from '../components/BaseComponent.jsx';
import SelectedFoodsTable from '../components/calculator/SelectedFoodsTable.jsx';
import SearchContainer from '../containers/SearchContainer.jsx';

export default class Calculator extends BaseComponent {
    
    constructor(props) {
        super(props);
        
        this.state = {
            selectedFoods: SessionStorage.getItem("selected-foods") != null ? JSON.parse(SessionStorage.getItem("selected-foods")) : [],
            defaultQuantity: 100
        };
        
        
        this.toggleDetails = this.toggleDetails.bind(this);
        this.onChange = this.onChange.bind(this); 
        this.findIndex = this.findIndex.bind(this);
        this.select = this.select.bind(this);
        this.remove = this.remove.bind(this);
        
    }  

    componentWillUnmount() {
        
        SessionStorage.removeItem("selected-foods");
        
    }
    
    toggleDetails( e ) {
        
        const index = e.target.dataset.foodindex;        
        const food = this.state.selectedFoods[index];
        
        if ( food ) {
            
            food.showDetails = !food.showDetails;
            
        }
        
        this.update();
       
    }
    
    onChange( e ) {
        
        const id = e.target.dataset.id;
        
        for( i = 0; i < this.state.selectedFoods.length; i++ ) {
            
            if ( this.state.selectedFoods[i]._id == id ) {
                
                this.state.selectedFoods[i].quantity = parseFloat(e.target.value);
                
            }
            
        }
        
        this.update();
        
    }
    
    findIndex( id ) {
        
        let i = 0;
            
        while( i < this.state.selectedFoods.length ) {
            
            if ( this.state.selectedFoods[i]._id == id ) {
                return i;
            }
            
            i++;
        }
        
        return -1;
        
    }
    
    select( food ) {
                   
        if ( food == null ) {
            return;
        }
            
        if ( this.findIndex( food._id ) != -1 ) {
            return;
        }
       
        food.quantity = this.state.defaultQuantity;
        food.showDetails = false;
        
        this.state.selectedFoods.push( food );
                
        this.update();
        
        SessionStorage.setItem("selected-foods", this.state.selectedFoods);
        
    }
    
    remove( index ) {
                 
        this.state.selectedFoods.splice( index, 1 );
        this.update();
        
        SessionStorage.setItem("selected-foods", this.state.selectedFoods);
        
    }
    
    render() {
                   
        return (
                <div className="centered">
                    <div>
                        <SelectedFoodsTable 
                            selectedFoods={this.state.selectedFoods} 
                            remove={this.remove} 
                            onChange={this.onChange} 
                            toggleDetails={this.toggleDetails}/> 
                        <SearchContainer id={"calcSearch"} limit={10} select={this.select} remove={this.remove}/>                
                        <Link to="/add-food">{i18n.getTranslation("common.addNewFood")}</Link>
                    </div>
                </div>
                    
               );
    }
}
