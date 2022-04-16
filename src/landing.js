import React from 'react';
import { Link } from 'react-router-dom';
import "./landing.css"

const LandingComponent = () => {

    return <nav className='landing'>
        <Link className="btn btn-primary" to="/bars">Dashbord</Link>
        <Link className="btn btn-primary" to="/globe">See Global Stat</Link>
    </nav>
}

export default LandingComponent;