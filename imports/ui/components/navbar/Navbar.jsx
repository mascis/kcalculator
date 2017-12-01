import React from 'react';
import BaseComponent from './../BaseComponent.jsx';
import { Link } from 'react-router-dom';
import i18n from 'meteor/universe:i18n';

import NavItem from './NavItem.jsx';
import AccountsUIWrapper from './../AccountsUIWrapper.jsx';
import LanguageToggle from './../LanguageToggle.jsx';

export default class Navbar extends BaseComponent {
         
    constructor( props ) {
        super( props );
        
    }
            
    render() {
                
        return (
                
                <div id="nav-container">
                    <nav className="navbar navbar-default">
                        <div className="container-fluid">
                            <div className="navbar-header">
                                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                                    <span className="sr-only">Toggle navigation</span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                </button>
                                <span className="navbar-brand"><Link to="/">{i18n.__("components.navbar.brand")}</Link></span>
                            </div>
                            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1"> 
                                <ul className="nav navbar-nav navbar-right">   
                                    <NavItem to="/calculator">{i18n.__("components.navbar.calculator")}</NavItem>
                                    <NavItem to="/food-diary">{i18n.__("components.navbar.diary")}</NavItem>
                                    <NavItem to="/weightwatch">{i18n.__("components.navbar.weightwatch")}</NavItem>   
                                    <LanguageToggle/> 
                                    <AccountsUIWrapper/>
                                </ul>      
                            </div>         
                        </div>            
                    </nav>               
                </div> 
                                            
               );
        
    }
}  
