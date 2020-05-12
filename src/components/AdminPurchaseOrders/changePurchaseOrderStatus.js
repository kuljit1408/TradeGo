import React, { Component } from "react";
import DashboardSidebar from "../Dashboard/dashboardSidebar";
import { getUser } from "../Utils/common";
import { getToken } from "../Utils/common";
import axios from "axios";

/* Get User and Token From Session */
const user = getUser();
const token = getToken();

class changePurchaseOrderStatus extends Component {
  //Set state values
  state = {
    productList: [],
    orderStatus: "",
    supplierName: "",
    creationDate: "",
    currency: "",
    purchaseId: "",
    errorMessage: "",
    successMsg: "",
  };
  cancelStatus = this.cancelStatus.bind(this);
  updateDeliverStatus = this.updateDeliverStatus.bind(this);

  componentDidMount() {
    const purchaseOrderId = new URLSearchParams(this.props.location.search).get(
      "purchaseOrderId"
    );
    let initialProducts = [];

    //getpurchaseorderbyid API
    axios({
      method: "GET",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/purchaseorder/getpurchaseorderbyid?CompanyId=${user.CompanyId}&PurchaseOrderId=${purchaseOrderId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (response.data.success == 1) {
          console.log(response.data.data.purchaseOrder_details.Status);
          this.setState({
            orderStatus: response.data.data.purchaseOrder_details.Status,
            supplierName: response.data.data.purchaseOrder_details.SupplierName,
            creationDate: response.data.data.purchaseOrder_details.Date,
            currency: response.data.data.purchaseOrder_details.Currency_Code,
            purchaseId:
              "#" + response.data.data.purchaseOrder_details.Purchase_OrderId,
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

  //Update status to delivered API
  updateDeliverStatus() {
    const purchaseOrderId = new URLSearchParams(this.props.location.search).get(
      "purchaseOrderId"
    );
    axios({
      method: "POST",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/delivery/create`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: {
        PurchaseOrderId: purchaseOrderId,
      },
    })
      .then((response) => {
        //console.log("Response"+response.data.success);
        if (response.data.success === 0) {
          this.setState({ errorMessage: response.data.message });
        } else {
          this.setState({ successMsg: response.data.message });
          window.location.href =
            "/viewdelivery?DeliveryId=" +
            purchaseOrderId +
            "&&message=" +
            response.data.message;
        }
      })
      .catch((error) => {
        //console.log("Error"+error);
        this.setState({ errorMessage: error.response.data.message });
      });
  }

  //Cancel Order API
  cancelStatus() {
    const purchaseOrderId = new URLSearchParams(this.props.location.search).get(
      "purchaseOrderId"
    );

    axios({
      method: "PUT",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/purchaseorder/cancel`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: {
        CompanyId: user.CompanyId,
        Purchase_OrderId: purchaseOrderId,
      },
    })
      .then((response) => {
        if (response.data.success === 0) {
          this.setState({ errorMessage: response.data.message });
        } else {
          this.setState({ successMsg: response.data.message });
          window.location.reload(false);
          //window.location.href ='/changeStatus?purchaseOrderId='+purchaseOrderId;
        }
      })
      .catch((error) => {
        //console.log("Error"+error);
        this.setState({ errorMessage: error.response.data.message });
      });
  }

  render() {
    let buttons = "";
    if (this.state.orderStatus == "Active") {
      buttons = (
        <div>
          <div class="form-group deliverButtons">
            <button
              class="btn btn-primary btn-block"
              onClick={this.updateDeliverStatus}
            >
              Receive Purchase
            </button>
          </div>
          <div class="form-group deliverButtons">
            <button
              class="btn btn-danger btn-block"
              onClick={this.cancelStatus}
            >
              Cancel Purchase
            </button>
          </div>
        </div>
      );
    }
    return (
      <div class="container-fluid  pt-5 mt-3">
        <div class="row">
          <DashboardSidebar />
          <div class="col-md-9 ml-sm-auto col-lg-10 px-4">
            <div class="headings">
              <div class="float-left">
                <h3 class="text-primary">
                  Purchase Order/{this.state.purchaseId}
                </h3>
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
            <div class="row register-form viewPurchase createForm">
              <div class="col-md-6">
                <div class="form-group deliverButtons">
                  <input
                    type="text"
                    class="form-control"
                    disabled
                    name="orderStatus"
                    value={this.state.orderStatus}
                  />
                </div>
                {buttons}
              </div>
              <div class="col-md-6 row">
                <div class="col-md-4">
                  <label>Supplier: </label>
                  <br />
                  <br />
                  <br />
                  <label>Creation Date: </label>
                  <br />
                  <br />
                  <br />
                  <label>Currency: </label>
                  <br />
                </div>
                <div class="col-md-8">
                  <div class="form-group">
                    <label>{this.state.supplierName}</label>
                    <br />
                    <br />
                    <br />
                    <label>{this.state.creationDate}</label>
                    <br />
                    <br />
                    <br />
                    <label>{this.state.currency}</label>
                    <br />
                  </div>
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

export default changePurchaseOrderStatus;
