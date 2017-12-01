import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import i18n from 'meteor/universe:i18n';
import App from '../../../imports/ui/App.jsx';


if (typeof(Storage) !== "undefined" && localStorage.getItem("kcalculator-lang") != null ) {
    
    i18n.setLocale(localStorage.getItem("kcalculator-lang"));
    
} else {
    
    i18n.setLocale('fi');
    
}

Meteor.startup(() => {
    
    render(<App/>, document.getElementById('app'));
    
});