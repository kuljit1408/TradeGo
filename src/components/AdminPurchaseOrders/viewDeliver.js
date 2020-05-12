import React, { Component } from "react";
import DashboardSidebar from "../Dashboard/dashboardSidebar";
import { getUser } from "../Utils/common";
import { getToken } from "../Utils/common";
import { NavLink } from "react-router-dom";
import axios from "axios";

/* Get User and Token From Session */
const user = getUser();
const token = getToken();

class viewDeliver extends Component {
  //Set state values
  state = {
    productList: [],
    deliveryStatus: "",
    deliveryDate: "",
    deliveryId: "",
    errorMessage: "",
    successMsg: "",
  };

  componentDidMount() {
    const deliveryId = new URLSearchParams(this.props.location.search).get(
      "DeliveryId"
    );
    const message = new URLSearchParams(this.props.location.search).get(
      "message"
    );

    let initialProducts = [];

    //Supplier API
    axios({
      method: "GET",
      responseType: "json",
      url:
        `https://api-tradego.herokuapp.com/api/delivery/getdeliverybyid?CompanyId=${user.CompanyId}&DeliveryId=` +
        deliveryId,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (response.data.success == 1) {
          this.setState({
            deliveryStatus: response.data.data.delivery_details.Status,
            deliveryDate: response.data.data.delivery_details.DeliveryDate,
            deliveryId: "#" + response.data.data.delivery_details.DeliveryId,
            successMsg: message,
          });
          initialProducts = response.data.data.products.map((product) => {
            return {
              productSku: product.SKU,
              productName: product.Product_name,
              productDesc: product.Description,
              productPrice: product.PurchasePrice,
              productQty: product.Quantity,
              productTotal: product.Total,
            };
          });
          this.setState({
            productList: initialProducts,
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
          <div class="col-md-9 ml-sm-auto col-lg-10 px-4">
            <div class="headings">
              <div class="float-left">
                <h3 class="text-primary">Deliveries/{this.state.deliveryId}</h3>
              </div>
            </div>
            {this.state.errorMessage && (
              <p className="alert alert-danger"> {this.state.errorMessage}</p>
            )}
            {this.state.successMsg && (
              <p className="alert alert alert-success">
                {" "}
                {this.state.successMsg}
              </p>
            )}
            <div class="row register-form createForm">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Delivery Status</label>
                  <input
                    type="text"
                    class="form-control"
                    disabled
                    name="deliveryStatus"
                    value={this.state.deliveryStatus}
                  />
                </div>
                <div class="form-group">
                  <label>Delivery Id</label>
                  <input
                    type="text"
                    class="form-control"
                    disabled
                    value={this.state.deliveryId}
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>Creation date </label>
                  <input
                    type="text"
                    class="form-control"
                    name="deliveryDate"
                    disabled
                    value={this.state.deliveryDate}
                  />
                </div>
              </div>
            </div>
            <div class="table-wrapper-scroll-y my-custom-scrollbar">
              <table class="table table-bordered table-striped mb-0">
                <thead>
                  <tr>
                    <th scope="col">SKU</th>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.productList.map((order) => (
                    <tr>
                      <td>{order.productSku}</td>
                      <td>{order.productName}</td>
                      <td>{order.productDesc}</td>
                      <td>${order.productPrice}</td>
                      <td>{order.productQty}</td>
                      <td>${order.productTotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
  //End render Function
}

export default viewDeliver;
