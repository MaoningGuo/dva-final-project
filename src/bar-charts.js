import React from 'react';
import BarChart from './bar-chart';
import MultilineChart from './multiline-chart1'
import './bar-charts.css';

function BarCharts() {
  return (
    <div className="App">
      <h2 id="title">Temperature Time Series of Cities around the World</h2>
      <div id="select-box">
        <lable>Select Location </lable><br></br>
        <select id="selectButton"></select>
        </div>
      <div id="tooltip">
      </div>
      <div id="svg-div">
        <MultilineChart></MultilineChart>
      </div>
      
    </div>
  );
}

export default BarCharts;
