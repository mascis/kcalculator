import React, {Component} from 'react';
import i18n from 'meteor/universe:i18n';

class BaseComponent extends React.Component {
    
    constructor(props) {        
        super(props);
        
        this.state = {
                locale: i18n.getLocale()
        };
        
        this.handleLocaleChange = this.handleLocaleChange.bind(this);
        this.update = this.update.bind(this);
    }
    
    componentWillMount() {   
        i18n.onChangeLocale(this.handleLocaleChange);
    }
    
    componentWillUnmount() {
        i18n.offChangeLocale(this.handleLocaleChange);
    }
    
    handleLocaleChange(locale) {
        this.setState({ locale });        
    }
    
    update() {
        
        const newState = this.state;
        this.setState(newState);
        
    } 
}

export default BaseComponent;