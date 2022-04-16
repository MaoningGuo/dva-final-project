import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './index.css';
import BarCharts from './bar-charts';
import GlobeMap from './global-map';
import LandingComponent from "./landing"
import 'bootstrap-css-only/css/bootstrap.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <Router>
      <Routes className="root-router">
        <Route path='/' element={<LandingComponent />} />
        <Route exact path='/bars' element={<BarCharts />} />
        <Route exact path='/globe' element={<GlobeMap />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
