import React from 'react';
import i18n from 'meteor/universe:i18n';
import BaseChart from './BaseChart.jsx';

export default class PieChart extends BaseChart {
   
    constructor(props) {
        super(props);
        
        this.getChartData = this.getChartData.bind(this);
        this.createChart = this.createChart.bind(this);
        
    }
 
    getChartData( data ) {
        
        return [{
                    label: data.label,
                    value: data.value
                }];

    }
    
    createChart( props ) {
        
        const id = props.id;
        
        const {
            showLabels,
            data
        } = props.options;
        
        const that = this;
        
        nv.addGraph(function() {
            
            var chart = nv.models.pieChart()
                            .x(function(d) { return d.label })
                            .y(function(d) { return d.value })
                            .showLabels(showLabels);

            const select = "#"+ id + " svg";
            d3.select(select)
                            .datum( data )
                            .transition().duration(350)
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
        
        console.log()
        
        return (
                <div id={id} className="pie-chart">
                    <svg></svg>
                </div>
        ); 
        
    }

}