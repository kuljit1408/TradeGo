import React, { Component } from "react";
import { getUser } from "../Utils/common";
import { getToken } from "../Utils/common";
import DashboardSidebar from "./dashboardSidebar";
import axios from "axios";

/* Get User and Token From Session */
const user = getUser();
const token = getToken();
console.log(token);
class dashboard extends Component {
  //Set state values
  state = {
    highestSoldProducts: "",
    highestSoldProductName: "",
    lowestSoldProducts: "",
    lowestSoldProductName: "",
    currentIncomingProducts: "",
    OrdersList: [],
    salesPerCategory: [],
    totalOnHand: "",
    currentValuation: "",
    newSalesOrders: [],
  };

  //Get Dashboard API
  componentDidMount() {
    //Get Highest Sold Products
    axios({
      method: "GET",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/sales/getmostsoldproduct?companyid=${user.CompanyId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        //console.log(response.data.success);
        if (response.data.success == 1) {
          if (response.data.data.length > 0) {
            this.setState({
              highestSoldProducts: response.data.data[0].Quantity,
              highestSoldProductName: response.data.data[0].Product_name,
            });
          }
        } else {
          this.setState({ errorMessage: response.data.message });
        }
      })
      .catch((error) => {
        this.setState({ errorMessage: error.response.data.message });
      });

    //Get Lowest Sold Products
    axios({
      method: "GET",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/sales/getlowestsoldproduct?companyid=${user.CompanyId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        //console.log(response.data.success);
        if (response.data.success == 1) {
          if (response.data.data.length > 0) {
            this.setState({
              lowestSoldProducts: response.data.data[0].Quantity,
              lowestSoldProductName: response.data.data[0].Product_name,
            });
          }
        } else {
          this.setState({ errorMessage: response.data.message });
        }
      })
      .catch((error) => {
        this.setState({ errorMessage: error.response.data.message });
      });

    //Current Incoming Products
    axios({
      method: "GET",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/product/incoming_products?CompanyId=${user.CompanyId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        //console.log(response.data.success);
        if (response.data.success == 1) {
          if (response.data.data) {
            this.setState({ currentIncomingProducts: response.data.data });
          }
        } else {
          this.setState({ errorMessage: response.data.message });
        }
      })
      .catch((error) => {
        this.setState({ errorMessage: error.response.data.message });
      });

    //Incoming Purchases Orders
    let initialPurchaseOrders = [];
    axios({
      method: "GET",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/purchaseorder/getincomingpurchaseorder?companyid=${user.CompanyId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        //console.log(response.data.success);
        if (response.data.success == 1) {
          initialPurchaseOrders = response.data.data.map((order) => {
            return {
              id: order.Purchase_OrderId,
              supplierName: order.Supplier,
              purchaseDate: order.Date,
              totalUnits: order.Total_Unit,
              totalPrice: order.Total,
            };
          });
          this.setState({
            OrdersList: initialPurchaseOrders,
          });
        } else {
          this.setState({
            OrdersList: [],
          });
        }
      })
      .catch((error) => {
        console.log("Error:" + error);
        this.setState({ errorMessage: error.response.data.message });
      });

    //Sales Per Category
    let initialSalesCatOrders = [];
    axios({
      method: "GET",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/sales/getsalespercategory?companyid=${user.CompanyId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        //console.log(response.data.success);
        if (response.data.success == 1) {
          if (response.data.data == 0) {
            this.setState({
              salesPerCategory: [],
            });
          } else {
            initialSalesCatOrders = response.data.data.map((sale) => {
              return {
                catName: sale.CategoryName,
                qty: sale.Quantity_Per_Category,
                total: sale.Total,
                profitMargin: sale.Profit_Margin,
              };
            });
            this.setState({
              salesPerCategory: initialSalesCatOrders,
            });
          }
        } else {
          this.setState({
            salesPerCategory: [],
          });
        }
      })
      .catch((error) => {
        console.log("Error:" + error);
        this.setState({ errorMessage: error.response.data.message });
      });

    //Current Valuation == Total Values
    axios({
      method: "GET",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/product/total_value?companyid=${user.CompanyId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        console.log(response);
        if (response.data.success == 1) {
          if (response.data.data) {
            this.setState({ currentValuation: response.data.data });
          }
        } else {
          this.setState({ errorMessage: response.data.message });
        }
      })
      .catch((error) => {
        this.setState({ errorMessage: error.response.data.message });
      });

    //Total On hand == Total Articals
    axios({
      method: "GET",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/product/total_articles?companyid=${user.CompanyId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        console.log(response);
        if (response.data.success == 1) {
          if (response.data.data) {
            this.setState({ totalOnHand: response.data.data });
          }
        } else {
          this.setState({ errorMessage: response.data.message });
        }
      })
      .catch((error) => {
        this.setState({ errorMessage: error.response.data.message });
      });

    //New Sales Orders
    let initialSalesOrders = [];
    axios({
      method: "GET",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/sales/getrecentsalesbyweek?CompanyId=${user.CompanyId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        //console.log(response.data.success);
        if (response.data.success == 1) {
          if (response.data.data == 0) {
            this.setState({
              newSalesOrders: [],
            });
          } else {
            initialSalesOrders = response.data.data.map((sale) => {
              return {
                cutomerOrderId: sale.CustomerOrderId,
                totalUnits: sale.Total_Unit,
                total: sale.Total,
                customerName: sale.customer,
              };
            });
            this.setState({
              newSalesOrders: initialSalesOrders,
            });
          }
        } else {
          this.setState({
            salesPerCategory: [],
          });
        }
      })
      .catch((error) => {
        console.log("Error:" + error);
        this.setState({ errorMessage: error.response.data.message });
      });
  }
  render() {
    return (
      <div class="container-fluid  pt-5 mt-3">
        <div class="row">
          <DashboardSidebar />
          <div class="col-md-12 margin-dashboard px-4">
            {this.state.errorMessage && (
              <p className="alert alert-danger"> {this.state.errorMessage} </p>
            )}
            <h6 class="text-uppercase text-primary">Inventory management.</h6>
            <div class="row mb-3">
              <div class="col-xl-4 col-sm-6 py-2">
                <div class="card bg-success text-white h-100">
                  <div class="card-body bg-success">
                    <div class="rotate">
                      <i class="fa fa-user fa-4x"></i>
                    </div>
                    <h6 class="text-uppercase">Highest Sold Products</h6>
                    <h6>
                      {this.state.highestSoldProductName
                        ? this.state.highestSoldProductName
                        : ""}
                    </h6>
                    <h1 class="display-4">
                      {this.state.highestSoldProducts
                        ? this.state.highestSoldProducts
                        : 0}
                    </h1>
                  </div>
                </div>
              </div>
              <div class="col-xl-4 col-sm-6 py-2">
                <div class="card text-white bg-danger h-100">
                  <div class="card-body bg-danger">
                    <div class="rotate">
                      <i class="fa fa-list fa-4x"></i>
                    </div>
                    <h6 class="text-uppercase">Lowest Sold Products</h6>
                    <h6>
                      {this.state.lowestSoldProductName
                        ? this.state.lowestSoldProductName
                        : ""}
                    </h6>
                    <h1 class="display-4">
                      {this.state.lowestSoldProducts
                        ? this.state.lowestSoldProducts
                        : 0}
                    </h1>
                  </div>
                </div>
              </div>
              <div class="col-xl-4 col-sm-6 py-2">
                <div class="card text-white bg-info h-100">
                  <div class="card-body bg-info">
                    <div class="rotate">
                      <i class="fa fa-twitter fa-4x"></i>
                    </div>
                    <h6 class="text-uppercase">Current Incoming Products</h6>
                    <h1 class="display-4">
                      {this.state.currentIncomingProducts
                        ? this.state.currentIncomingProducts
                        : 0}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div class="row my-4">
              <div class="col-lg-8">
                <div class="table-responsive">
                  <h6 class="text-uppercase  text-center text-primary">
                    Incoming Purchases
                  </h6>
                  <table class="table table-striped table-wrapper-scroll-y my-custom-scrollbar">
                    <thead class="thead-inverse">
                      <tr>
                        <th>Purchase Order Id</th>
                        <th>Supplier</th>
                        <th>Ship Date</th>
                        <th>Total Units</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.OrdersList.map((order) => (
                        <tr>
                          <td>{order.id}</td>
                          <td>{order.supplierName}</td>
                          <td>{order.purchaseDate}</td>
                          <td>{order.totalUnits}</td>
                          <td>${order.totalPrice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="col-lg-4">
                <div class="table-responsive">
                  <h6 class="text-uppercase text-center text-primary">
                    Sales Per Category
                  </h6>
                  <table class="table table-striped table-wrapper-scroll-y my-custom-scrollbar">
                    <thead class="thead-inverse">
                      <tr>
                        <th>Category Name</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th>Profit Margin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.salesPerCategory.map((sales) => (
                        <tr>
                          <td>{sales.catName}</td>
                          <td>{sales.qty}</td>
                          <td>${sales.total}</td>
                          <td>{sales.profitMargin.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <h2 class="sub-header mt-5  text-center text-primary text-uppercase borderStyle">
              Inventory Valuation
            </h2>
            <div class="mb-3">
              <div class="card-deck">
                <div class="card card-inverse card-success text-center">
                  <div class="card-body">
                    <blockquote class="card-blockquote">
                      <p class="text-uppercase text-primary">Total On hand</p>
                      <footer>
                        {this.state.totalOnHand ? this.state.totalOnHand : 0}
                      </footer>
                    </blockquote>
                  </div>
                </div>
                <div class="card card-inverse card-danger text-center">
                  <div class="card-body">
                    <blockquote class="card-blockquote">
                      <p class="text-uppercase text-primary">
                        Current Valuation
                      </p>
                      <footer>
                        {this.state.currentValuation
                          ? this.state.currentValuation
                          : 0}
                      </footer>
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div class="row my-4">
              <div class="col-lg-6">
                <div class="table-responsive">
                  <h6 class="text-uppercase  text-center text-primary">
                    New Sales Orders
                  </h6>
                  <table class="table table-striped table-wrapper-scroll-y my-custom-scrollbar">
                    <thead class="thead-inverse">
                      <tr>
                        <th>Customer Order Id</th>
                        <th>Total Units</th>
                        <th>Total</th>
                        <th>Customer Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.newSalesOrders.map((order) => (
                        <tr>
                          <td>{order.cutomerOrderId}</td>
                          <td>{order.totalUnits}</td>
                          <td>${order.total}</td>
                          <td>{order.customerName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default dashboard;
