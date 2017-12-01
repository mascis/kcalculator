import React from 'react';
import BaseComponent from './../BaseComponent.jsx';
import i18n from 'meteor/universe:i18n';
import { Link } from 'react-router-dom';

import {SessionStorage} from '../../../utils/SessionStorage.js';

export default class SearchResult extends BaseComponent {
    
    constructor( props ) {
        super( props );
        
        this.state = {
                selected: false,
                to: ""
        };
        
        this.select = this.select.bind(this);
        this.remove = this.remove.bind(this);
        
    }
    
    componentWillMount() {
        
        const foods = SessionStorage.getItem("selected-foods") != null ? JSON.parse(SessionStorage.getItem("selected-foods")) : [];
        
        for( let i = 0; i < foods.length; i++ ) {
            
            if ( foods[i]._id == this.props.result._id ) {
                this.state.selected = true;
            }
            
        }
        
        this.state.to = "/update-food/" + this.props.result._id;
        
    }
    
    select() {
        
        this.state.selected = true;
        this.update();
        this.props.select(this.props.result, this.props.index); 
        
    }
    
    remove() {
        
        this.state.selected = false;
        this.update();
        this.props.remove(this.props.result._id, this.props.index);
        
    }
          
    render () {
        
        const {
            result,
            select,
            remove,
            index
        } = this.props;
        
        return (
                <div className="search-result row">
                
                    <div className="col-xs-10 col-md-9">
                        <div>{result.title}</div>
                        <div>{result.brand}</div>
                        <div>
                            <Link to={this.state.to}>{i18n.getTranslation("components.searchResult.editLink")}</Link>
                        </div>
                    </div>
                                            
                    <div className="col-xs-2 col-md-3">
                        
                        {
                            this.state.selected
                            
                            ?
                                    
                            <div className="fa fa-minus-circle toggle toggle-remove" onClick={this.remove}></div> 
                                    
                            :
                                        
                            <div className="fa fa-plus-circle toggle toggle-select" onClick={this.select}></div> 
                                
                        }
                        
                    </div>
            </div>
        );
        
    }
}