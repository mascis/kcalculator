import React from 'react';
import BaseComponent from '../ui/components/BaseComponent.jsx';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Navbar from '../ui/components/navbar/Navbar.jsx';

import Calculator from '../ui/pages/Calculator.jsx';
import FoodDiaryContainer from '../ui/containers/FoodDiaryContainer.jsx';
import WeightWatchContainer from '../ui/containers/WeightWatchContainer.jsx';
import AddFood from '../ui/pages/AddFood.jsx';
import UpdateFoodContainer from '../ui/containers/UpdateFoodContainer.jsx';

export class App extends BaseComponent {
        
    constructor(props) {
        super(props);
        
        this.state = {
            user: null
        }
        
    }
    
    render() {
        
        const {
            user,
            connected
          } = this.props;
                            
          return (  
                                    
                  <BrowserRouter>   
                  
                      <div id="wrapper">
                              
                          <Navbar />
                                      
                          <div id="content-container">
                  
                              <Switch>    
                                  <Route path="/calculator" component={Calculator} />
                                  <Route path="/food-diary" component={FoodDiaryContainer} />
                                  <Route path="/weightwatch" component={WeightWatchContainer} /> 
                                  <Route path="/add-food" component={AddFood} /> 
                                  <Route path="/update-food/:id" component={UpdateFoodContainer} /> 
                              </Switch>
                                  
                              
                          </div>
                              
                          
                              
                      </div>
                              
                  </BrowserRouter>
                        
                 );
      
    }
    
}

App.propTypes = {
        user: React.PropTypes.object,      // current meteor user
        connected: React.PropTypes.bool,   // server connection status
};


export default createContainer(() => {

    return {
        user: Meteor.user(),
        connected: Meteor.status().connected,

    };
    
}, App);
