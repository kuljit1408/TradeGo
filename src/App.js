import React, { Component } from 'react';

/* Start Load Components */
import NotFoundPage from "./components/PageNotFound/pageNotFound";
import PrivateRoute from './components/Utils/privateRoute';
import PublicRoute from './components/Utils/publicRoute';

//Public pages
import Header from './components/Header/header';
import Footer from './components/Footer/footer';
import Home from './components/BodyPart/content';
import SignUp from "./components/Signup/signup";
import Login from './components/Login/login';
import ForgotPass from "./components/ForgotPassword/sendEmailNotification";

//Dashboard Components
import Dashboard from "./components/Dashboard/dashboard";

//Supplier Components
import GetSupplier from './components/AdminSuppliers/getSuppliers';
import CreateSupplier from './components/AdminSuppliers/createSupplier';
import UpdateSupplier from './components/AdminSuppliers/updateSupplier';

//Catgory Components
import GetCategory from './components/AdminCatgeories/getCategory';
import CreateCategory from './components/AdminCatgeories/createCategory';
import EditCategory from './components/AdminCatgeories/editCategory.js';

//Product Components
import GetProducts from './components/AdminProducts/getProducts';
import CreateProduct from './components/AdminProducts/createProduct';
import UpdateProduct from './components/AdminProducts/updateProduct';

//Sales order Components
import SalesOrders from './components/AdminSalesOrders/salesOrder';

//Devileries Components
import Deliveries from './components/AdminDeliveries/purchaseOrdersDelivery';

//Purchase orders Components
import ChangePurchaseStatus from './components/AdminPurchaseOrders/changePurchaseOrderStatus';
import GetPurchaseOrders from './components/AdminPurchaseOrders/getPurchaseOrders';
import ViewDelivery from './components/AdminPurchaseOrders/viewDeliver';
import UpdatePurchaseOrders from './components/AdminPurchaseOrders/updatePurchaseOrder';
import CreatePurchaseOrders from './components/AdminPurchaseOrders/createPurchaseOrder';

//Settings Components
import UpdateCompanySettings from './components/AdminSettings/companySettings';
import UpdateUserSettings from './components/AdminSettings/userSettings';

//Project Team
import TeamMember from './components/ProjectTeam/team'; 
/* End Load Components */

/* Start Load CSS */
import './css/bootstrap.min.css';
import './css/dashboard.css';
import './css/sticky-footer-navbar.css';
import './css/style.css';
/* End Load CSS */

import {
  BrowserRouter ,
  Route,
  Switch,
  Redirect

} from "react-router-dom";

/* Start App Class*/
class App extends Component {
  componentDidMount() {
    const scriptAjax = document.createElement("script");
    const scriptBootstrap = document.createElement("script");
    scriptAjax.async = true;
    scriptAjax.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js";
    scriptBootstrap.async = true;
    scriptBootstrap.src = "https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js";
    document.head.appendChild(scriptAjax);
    document.head.appendChild(scriptBootstrap);
  }
    render() {
      return ( 
      <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
            <meta name="description" content="Manage the Inventory of the Store"/>
            <meta name="author" content="Rajwinder-Manjinder-Kuljit"/>
            <link rel="icon" href="favicon.ico"/>
            <title>Inventory Management</title>
          </head>          
            <BrowserRouter>
              <body>           
                {/* Load Header Component */}
                  <Header/>
                {/* Load Home,Login,Signup and Notfound Components */}
                <main role="main" class="container content">
                  <Switch>               
                      <Route exact path="/" component={Home}/> 
                      <PublicRoute exact path="/login" component={Login}/>                      
                      <PublicRoute  exact path="/signup" component={SignUp}/>
                      <PublicRoute  exact path="/forgotpassword" component={ForgotPass}/>
                      <PublicRoute  exact path="/team" component={TeamMember}/>
                      <PrivateRoute  exact path="/dashboard" component={Dashboard}/>
                      <PrivateRoute  exact path="/getSuppliers" component={GetSupplier}/>
                      <PrivateRoute  exact path="/createSupplier" component={CreateSupplier}/>                      
                      <PrivateRoute  exact path="/updateSupplier" component={UpdateSupplier}/>                      
                      <PrivateRoute  exact path="/getProducts" component={GetProducts}/>
                      <PrivateRoute  exact path="/createProduct" component={CreateProduct}/>
                      <PrivateRoute  exact path="/updateProduct" component={UpdateProduct}/>
                      <PrivateRoute  exact path="/getCategories" component={GetCategory}/>
                      <PrivateRoute  exact path="/createCategory" component={CreateCategory}/>
                      <PrivateRoute  exact path="/editCategory" component={EditCategory}/>
                      <PrivateRoute  exact path="/salesOrders" component={SalesOrders}/>
                      <PrivateRoute  exact path="/deliveries" component={Deliveries}/>
                      <PrivateRoute  exact path="/viewdelivery" component={ViewDelivery}/>
                      <PrivateRoute  exact path="/changeStatus" component={ChangePurchaseStatus}/>
                      <PrivateRoute  exact path="/getPurchaseOrders" component={GetPurchaseOrders}/>                                            
                      <PrivateRoute  exact path="/updatePurchaseOrder" component={UpdatePurchaseOrders}/>
                      <PrivateRoute  exact path="/createPurchaseOrder" component={CreatePurchaseOrders}/>                      
                      <PrivateRoute  exact path="/updateCompanySettings" component={UpdateCompanySettings}/>                     
                      <PrivateRoute  exact path="/userSettings" component={UpdateUserSettings}/>                       
                      <Route  exact path="/404" component={NotFoundPage}/>
                      <Redirect to="/404" />
                  </Switch> 
                </main>  
              </body>
            </BrowserRouter>           
            {/* Load Footer Component */}
            <Footer />
        </html>
      );
    }
  }  
  export default App;
