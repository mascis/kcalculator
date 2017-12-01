import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseChart from './BaseChart.jsx';

export default class LineChart extends BaseChart {
   
    constructor(props) {
        super(props);
        
        this.getChartData = this.getChartData.bind(this);
        this.createChart = this.createChart.bind(this);
        
    }
 
    getChartData( data ) {
        
        return [{
                    values: data.values,
                    key: data.series,
                    color: data.lineColor
                }];

    }
    
    createChart( props ) {
        
        const id = props.id;
        
        const {
            margin,
            useInteractiveGuideline,
            showLegend,
            showYAxis,
            showXAxis,
            xAxisLabel,
            yAxisLabel,
            values,
            series,
            lineColor
        } = props.options;
                
        const that = this;
        const lang = i18n.getLocale();
        
        nv.addGraph(function() {
            
            var chart = nv.models.lineChart()
                          .margin({left: margin})
                          .useInteractiveGuideline(useInteractiveGuideline)
                          .showLegend(showLegend)
                          .showYAxis(showYAxis)
                          .showXAxis(showXAxis);

            chart.xAxis    
                .axisLabel(xAxisLabel)
                .tickFormat( function(d){
                    
                    if ( lang == "fi" ) {
                        return d3.time.format('%d/%m/%Y')(new Date(d));
                    } else {
                        return d3.time.format('%x')(new Date(d));
                    }
                    
                });

            chart.yAxis    
                .axisLabel(yAxisLabel)
                .tickFormat(d3.format('.02f'));
            
            var chartData = that.getChartData( props.options );  
            
            d3.select("#" + id + " svg")   
                .datum(chartData)         
                .call(chart);
            
            nv.utils.windowResize(function() { chart.update() });
            
            return chart;
            
          });
        
    }
    
    componentWillMount() {
        
        this.createChart( this.props );
    }
    
    componentWillUpdate( props, state) {
        
        this.createChart( props );

    }
    
    render() {
        
        const {
            id
        } = this.props; 
        
        return (
                <div id={id}>
                    <svg></svg>
                </div>
        ); 
        
    }

}