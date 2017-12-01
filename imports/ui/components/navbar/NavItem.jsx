import React, { Component } from 'react'
import { Link, IndexLink, withRouter } from 'react-router-dom'

export default class NavItem extends Component {
    
    constructor( props ) {
        super( props );
        
    }
    
    render () {
        
        const { router } = this.context;        
        const { 
            to, 
            children
        } = this.props;  
        
        let isActive;
        
        if ( router.route.location.pathname == to ) {

            return (
                    <li className="active">
                        <Link to={to}>{children}</Link>
                    </li>
            );
            
        } else {
            
            return (
                    
                    <li>
                        <Link to={to}>{children}</Link>
                    </li>
            );
            
        }
        
    }
}

NavItem.contextTypes = {
    router: React.PropTypes.object
};
