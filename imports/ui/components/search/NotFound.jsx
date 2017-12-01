import React from 'react';
import BaseComponent from './../BaseComponent.jsx';
import i18n from 'meteor/universe:i18n';

export default class NotFound extends BaseComponent {
    
    render() {
        return (                
                <div className="not-found">
                    {i18n.getTranslation("components.notFound.message")}
                </div>
               );
    }
}