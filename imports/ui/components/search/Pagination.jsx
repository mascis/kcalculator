import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './../BaseComponent.jsx';

export default class Pagination extends BaseComponent {
   
    constructor(props) {
        super(props);
        
        this.state = {
            currentPage: 1
        };
        
        this.onSelectPage = this.onSelectPage.bind(this);
    }
    
    onSelectPage( e ) {
        
        let pageNumber = 0;
        
        if ( e.target.dataset.name ) {
            
            if ( e.target.dataset.name == "prev" ) {
                
                pageNumber = this.state.currentPage - 1 >= 1 ? this.state.currentPage - 1 : 1; 
                
            } else {
                
                pageNumber = this.state.currentPage + 1 <= this.props.numPages ? this.state.currentPage + 1 : this.props.numPages; 
                
            }
            
        } else {
            
            pageNumber = e.target.dataset.page;
            
        }
        
        this.state.currentPage = pageNumber;
        this.props.selectPage( pageNumber );
        
    }
    
    render() {
       
        const {
            currentPage
        } = this.state;
        
        const {
            numPages,
            selectPage
        } = this.props;
        
        let pageItems = [];
        
        for( let i = 0; i < numPages; i++ ) {
            
            const pageNumber = i + 1;
            pageItems.push(<li className={pageNumber == currentPage ? 'active' : ''} key={i}><a data-page={i+1} onClick={this.onSelectPage}>{pageNumber}</a></li>);
            
        }
        
        return (
                <nav aria-label="Page navigation">
                    <ul className="pagination">
                        <li>
                            <a aria-label="Previous" data-name="prev" onClick={this.onSelectPage}>
                                <span aria-hidden="true" data-name="prev">&laquo;</span>
                            </a>
                        </li>
                                
                        {pageItems}

                        <li>
                            <a aria-label="Next" data-name="next" onClick={this.onSelectPage}>
                                <span aria-hidden="true" data-name="next">&raquo;</span>
                            </a>
                        </li>
                    </ul>
              </nav>
        ); 
        
    }

}

Pagination.propTypes = {
        selectPage: React.PropTypes.func,
        numPages: React.PropTypes.number
};