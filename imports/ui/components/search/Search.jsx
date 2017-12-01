import React from 'react';
import BaseComponent from './../BaseComponent.jsx';
import i18n from 'meteor/universe:i18n';
import {_} from 'meteor/underscore';

import {search} from '../../../api/foods/methods.js';
import {Foods} from '../../../api/foods/foods.js';
import NotFound from './NotFound.jsx';
import SearchResult from './SearchResult.jsx';
import Pagination from './Pagination.jsx';

export default class Search extends BaseComponent {
    
    constructor( props ) {
        super( props );
        
        this.state = {
            id: null,
            searchExecuted: false,
            startIndex: 0,
            endIndex: 0,
            searchString: ""
        };
        
        this.onChange = this.onChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onClick = this.onClick.bind(this);
        this.selectPage = this.selectPage.bind(this);
    }
    
    componentWillMount() {
        this.state.id = this.props.id;
        this.state.endIndex = this.props.limit - 1;
    }
         
    selectPage( pageNumber ) {
        
        this.state.startIndex = this.props.limit * (pageNumber - 1);
        this.state.endIndex = this.state.startIndex + (this.props.limit - 1);
        this.update();
        
    }
    
    onChange( e ) {
        
        this.state.searchString = e.target.value;
        this.update();
        
    }
    
    onKeyPress( e ) {
        
        const code = (e.keyCode ? e.keyCode : e.which);

        if ( code == 13 ) {
            
            if ( e.target.value == "" ) {
                return;
            }
                        
            Session.set(this.state.id, e.target.value);                        
            
            this.state.searchExecuted = true;
            this.update();
            
        }
        
    }
    
    onClick( e ) {
                
        if (e.target.dataset.name == "empty" ) {
            
            Session.set(this.state.id, "");  
            this.state.searchExecuted = true;
            this.state.searchString = "";
            this.update();
            
        } else {
            
            if ( (e.target.value && e.target.value == "") || (e.target.dataset.value && e.target.dataset.value == "") ) {
                return;
            }
            
            e.target.dataset.value ? Session.set(this.state.id, e.target.dataset.value) : Session.set(this.state.id, e.target.value);      
            this.state.searchExecuted = true;
            this.update();
            
        }
        
    }
    
    render () {
             
        const {
            searchExecuted,
            startIndex,
            endIndex
        } = this.state;
                
        const {
            select, 
            remove,
            loading,
            results,
            index,
            limit
        } = this.props;
        
        const numPages = Math.ceil(results.length/limit);
        
        let Results; 
                
        if ( !results || !results.length || results.length == 0 && searchExecuted ) {
            
            Results = <NotFound/>;
            
        } else {
            
            if ( searchExecuted ) {
                
                Results = [];
                
                for( let i = startIndex; i <= endIndex && i < results.length; i++ ) {
                    
                    const result = results[i];
                    
                    Results.push(<SearchResult key={result._id} result={result} select={select} remove={remove} index={index}/>);
                    
                }

            }
             
        }        
                
        return (
                <div>   
                    <div className="search-container">
                        <div className="input-group">
                            <input type="text" value={this.state.searchString} className="form-control" placeholder={i18n.__("components.search.placeholder")} onChange={this.onChange} onKeyPress={this.onKeyPress}/>
                            <span className="input-group-btn"> 
                                <button className="btn btn-default" type="button" data-value={this.state.searchString} onClick={this.onClick}>
                                    <span className="fa fa-search" data-value={this.state.searchString} onClick={this.onClick}></span>
                                </button>
                            </span>
                        </div>
                        <div className="empty">
                            <span data-name="empty" className="fa fa-times-circle" onClick={this.onClick}></span>
                        </div>
                    </div>
                    <div className="resultsContainer">                             
                        {
                            loading
                            
                            ?
                            
                            <span className="fa fa-spin fa-spinner loading-spinner" aria-hidden="true"></span>
                                    
                            :
                            
                            Results
                            
                        }   
                    </div>                    
                    {
                        
                        results && results.length && results.length > 0 && limit < results.length
                        
                        ?
                                
                        <Pagination numPages={numPages} selectPage={this.selectPage}/>
                                
                        :
                            
                        ''
                    }                     
                </div>
        );
        
    }
}

Search.propTypes = {
        results: React.PropTypes.array,
        loading: React.PropTypes.bool,
        id: React.PropTypes.string
};
