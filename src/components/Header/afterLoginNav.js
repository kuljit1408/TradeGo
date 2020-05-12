import React, { Component } from 'react';
import { getUser, removeUserSession } from '../Utils/common';
import { NavLink } from "react-router-dom";

/* Get User From Session */
const user = getUser();
const handleLogout = (props) => {
    removeUserSession();
    window.location.href ='/login';
}
class afterLoginNav extends Component {
    render() {
      return (  
        <nav className="navbar navbar-expand-md navbar-dark headerBk mb-3">
            <div className="navbar-header">    
                <NavLink to="/dashboard" className=""><strong><img className="companyLogo" src={user.Logo} alt="Inventory Management"/></strong></NavLink>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
            </div>
        </nav>
      );
    }
}

export default afterLoginNav;