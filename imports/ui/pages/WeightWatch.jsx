import React from 'react';
import BaseComponent from '../components/BaseComponent.jsx';
import {_} from 'meteor/underscore';
import i18n from 'meteor/universe:i18n';

import LoadingSpinner from '../components/LoadingSpinner.jsx';
import DatePicker from '../components/DatePicker.jsx';
import LineChart from '../components/charts/LineChart.jsx';
import UserNotFound from '../components/UserNotFound.jsx';

import {save} from '../../api/weights/methods.js'; 
import {MongoUtil} from '../../utils/MongoUtil.js';
import {SessionStorage} from '../../utils/SessionStorage.js';
 
export default class WeightWatch extends BaseComponent {
    
    constructor( props ) {
        super(props);
        
        this.state = {
            weight: 0,
            allWeights: [],
            success: false,
            chartOptions: {
                margin: 100,
                useInteractiveGuideline: true,
                showLegend: false,
                showYAxis: true,
                showXAxis: true,
                xAxisLabel: "",
                yAxisLabel: "",
                values: [],
                series: "",
                lineColor: "#ff7f0e"
            },
            hasWeightError: false,
            hasUnexpectedErrors: false
        };
        
        this.onChange = this.onChange.bind(this);
        this.saveWeight = this.saveWeight.bind(this);
        this.setChartData = this.setChartData.bind(this);
        
    }
    
    setChartData() {
                
        this.state.chartOptions.xAxisLabel = i18n.getTranslation("pages.weightWatch.chart.xAxisLabel");
        this.state.chartOptions.yAxisLabel = i18n.getTranslation("pages.weightWatch.chart.yAxisLabel");
        this.state.chartOptions.series = i18n.getTranslation("pages.weightWatch.chart.series");
        
        const values = [];
        
        for( let i = 0; i < this.state.allWeights.length; i++ ) {
            
            const data = {};
            
            data["x"] = this.state.allWeights[i].date;
            data["y"] = this.state.allWeights[i].weight;
            
            values.push(data);
            
        }
        
        this.state.chartOptions.values = values;
        
    }
        
    componentWillUpdate(nextProps, nextState) {
        
        if ( !nextProps.loading ) {
            this.state.weight = nextProps.result[0] ? nextProps.result[0].weight : 0;
            this.state.allWeights = nextProps.allWeights ? nextProps.allWeights : [];
            
            this.setChartData();
            
        }
        
    }
 
    onChange( e ) {
        
        this.state.weight = e.target.value;
        this.update();
        
    }
    
    handleErrors( errors ) {
        
        for ( let i = 0; i < errors.length; i++ ) {
            
            const error = errors[i].name.split(".")[1];
            
            if ( error == "weight" ) {
                this.state.hasWeightError = true;
            } else {
                this.state.hasUnexpectedErrors = true;
            }
            
        }
       
    }
    
    saveWeight() {
        
        const userId = Meteor.userId();
        
        if ( !Meteor.userId() ) {
            this.state.hasUnexpectedErrors = true;
            this.update();
            return;
        }
        
        const data = {};
        data.userId = userId;
        data.weight = parseFloat(this.state.weight);
        
        const doc = MongoUtil.createWeightDocument( data ); 
        
        if ( !doc ) {
            this.state.hasUnexpectedErrors = true;
            this.update();
            return;
        }
        
        save.call({userId, doc}, ( err, res ) => {
            
            if ( err ) {
                this.handleErrors( err.errors );
                this.update();
            }
            
            if ( !err && res ) {
                this.state.hasWeightError = false;
                this.state.hasUnexpectedErrors = false;
                this.state.success = true;
                this.update();
                
                setTimeout(
                        function(){
                            
                            location.reload(); 
                            
                        }, 2000);
                
            }
            
        });
        
    }
    
    render() {
        
        const {
            loading,
            result,
            allWeights
        } = this.props;
                
        let Content;
        
        if ( Meteor.user() ) {
            
            Content = (
                    
                <div>                    
                    <DatePicker/>
                    
                    <div id="weightsContainer">        
                        <strong>{i18n.getTranslation("pages.weightWatch.weight")}</strong>
                        <input type="number" min="0" step="0.1" value={this.state.weight} className="form-control" onChange={this.onChange}/>
                            
                        {
                        
                            this.state.success
                            
                            ?
                                    
                            <div className="alert alert-success">
                                <strong>{i18n.getTranslation("common.save-successful")}</strong>
                            </div>   
                            
                            :
                                
                            <input type="button" className="btn btn-primary" value={i18n.getTranslation("common.buttons.save")} onClick={this.saveWeight}/>
                               
                        }
                        
                        {
                            this.state.hasWeightError || this.state.hasUnexpectedErrors
                            
                            ?
                            
                            <div className="alert alert-danger">
                                <strong>{i18n.getTranslation("common.errors.save-failed")}</strong> 
                                {
                                    this.state.hasUnexpectedErrors
                                    
                                    ?
                                    
                                    <span>&nbsp;{i18n.getTranslation("common.errors.unexpected")}</span>
                                    
                                    :
                                        
                                    ''
                                }
                                
                                {
                                    this.state.hasWeightError
                                    
                                    ?
                                    
                                    <span>&nbsp;{i18n.getTranslation("common.errors.numberExpected")}</span>
                                    
                                    :
                                        
                                    ''
                                }
                            </div>
                                    
                            :
                            
                            ''
                        }
                        
                        {
                            
                            this.state.allWeights.length > 0 
                            
                            ?
                                    
                            <div>
                                <h3>{i18n.getTranslation("pages.weightWatch.headers.weightChanges")}</h3>
                                <LineChart id="allWeightsChart" options={this.state.chartOptions}/>
                            </div>
                            
                            :
                                
                            ""
                        }
                    </div> 
                </div>
            
            );
            
        } else {
            
            Content = (
            
                <UserNotFound message={i18n.getTranslation("components.userNotFound.weightWatchMessage")}/>
            
            );
            
        }
        
        return (
                <div className="centered">
                    {
                        
                        loading
                        
                        ?
                         
                        <LoadingSpinner/>
                                
                        :
                        
                        Content
                        
                    } 
                </div>                
               );
    }
}