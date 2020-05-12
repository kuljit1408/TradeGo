import React, { Component } from 'react';
import { getToken } from '../Utils/common';
import BeforeLoginNav from './beforeLoginNav';
import AfterLoginNav from './afterLoginNav';

/* Get User Token From Session */
const userToken = getToken();
let navigation;
if(userToken){
  navigation = <AfterLoginNav/>; 
}else{
  navigation = <BeforeLoginNav/>;
}

class header extends Component {
    render() {
      return (        
        <header class="fixed-top">
           {navigation}        
        </header>
      );
    }
  }
  
  export default header;