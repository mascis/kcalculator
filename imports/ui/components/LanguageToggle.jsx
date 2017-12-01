import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';
import getLanguages from '../../api/languages/methods';

export default class LanguageToggle extends BaseComponent {
   
    constructor(props) {
        super(props);
        
        this.state = Object.assign( 
                this.state, { 
                    languages: [],
                    menuOpen: false
                });
        
        this.handleMenu = this.handleMenu.bind(this);
        
    }

    componentDidMount() {
        
        getLanguages.call( ( error, languages ) => {
            
            if (!error) {
                
                this.setState( { languages });
                
            }
            
        });
        
    }
    
    setLocale(event, language) {
        
        event.preventDefault();
        
        if (language) {
            
            // TODO: tallenna user profileen, jos kirjautunut sisään
            
            if ( typeof(Storage) !== "undefined" ) {
                localStorage.setItem("kcalculator-lang", language); 
            }
                       
            i18n.setLocale(language);
            
            location.reload();
           
        }
        
    }
    
    handleMenu() {
                
        this.state.menuOpen = !this.state.menuOpen;        
        this.update();
        
    }
    
    renderLanguages() {
        
        return this.state.languages.map( ( language ) => {
            
            let content;
            
            if (language === this.state.locale) {
                
                content = (
                        <span key={language} className="language active">
                            {language.toUpperCase()}
                        </span>
                            
                );
                
            } else {
                
                content = (
                        <a key={language} href="#toggle-language" className="language" onClick={event => this.setLocale(event, language)}>
                            {language.toUpperCase()}
                        </a>
                        
                );
          
        }
        
        return content;
        
    });
        
}
    
      
    render() {
       
        return (
                <li className="language-toggle-li"> 
                    <div className={this.state.menuOpen ? "language-toggle active" : "language-toggle"} onClick={this.handleMenu}>
                        <a>
                            { i18n.getTranslation("components.languageToggle.choose-lang") } 
                            <span className={this.state.menuOpen ? "fa fa-caret-down" : "fa fa-caret-right"}></span>
                        </a>
                    </div>                           
                    
                    {
                        
                        this.state.menuOpen
                        
                        ?
                         
                        <div className="language-toggle-list">
                            {this.renderLanguages()}   
                        </div>
                     
                        :
                            
                        ''
                    }        
                </li>
               
                    
        ); 
        
    }

}