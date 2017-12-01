import React from 'react';
import BaseComponent from './BaseComponent.jsx';
import i18n from 'meteor/universe:i18n';

export default class UserNotFound extends BaseComponent {
    
    render() {
        
        const {
            message
        } = this.props;
        
        return (                
                <div className="user-not-found">
                    <div className="alert alert-info fade in">
                        <a href="#" className="close" data-dismiss="alert" aria-label="close">
                            <span className="fa fa-times"></span>
                        </a>
                        <strong>{message}</strong>
                    </div>
                </div>
               );
    }
}

UserNotFound.propTypes = {
    message: React.PropTypes.string
};