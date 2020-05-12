import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import logo from '../../images/logo.png';
class beforeLoginNav extends Component {
    render() {
      return (  
        <nav className="navbar navbar-expand-md navbar-dark headerBk mb-3">
            <div className="navbar-header">    
                <NavLink to="/" className=""><strong><img className="logoImg" src={logo} alt="Inventory Management"/></strong></NavLink>
                <h5 class="logoTxt">TradeGo</h5>
            </div>
            <div className="collapse navbar-collapse" id="navbarCollapse">             
                <ul className="nav navbar-nav ml-auto">
                    <li className="nav-item active">
                        <NavLink to="/" className="nav-link">Home</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/team" className="nav-link">About Us</NavLink>                      
                    </li>
                    <li className="nav-item">
                        <NavLink to="/signup" className="nav-link">Signup</NavLink>
                    </li>
                        <li className="nav-item">
                        <NavLink to="/login" className="nav-link">Login</NavLink>                      
                    </li>
                </ul>  
            </div> 
        </nav>          
      );
    }
}

export default beforeLoginNav;