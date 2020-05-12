import React, { Component } from "react";
import DashboardSidebar from "../Dashboard/dashboardSidebar";
import { getUser } from "../Utils/common";
import { getToken } from "../Utils/common";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

/* Get User and Token From Session */
const user = getUser();
const token = getToken();

class getPurchaseOrders extends Component {
  //Set state values
  state = {
    purchaseOrderList: [],
    suppliersList: [],
    filterSupplierId: "",
    filterOrderId: "",
    errorMessage: "",
    successMsg: "",
    toDel: [],
    checks: [],
  };

  //Get all salesOrder API
  componentDidMount() {
    let initialPurchaseOrders = [];
    let initialSuppliers = [];

    let url = "";
    if (this.state.filterSupplierId || this.state.filterOrderId) {
      url =
        `https://api-tradego.herokuapp.com/api/purchaseorder/getpurchaseorders?SupplierId=` +
        this.state.filterSupplierId +
        "&&PurchaseOrderId=" +
        this.state.filterOrderId;
    } else {
      url = `https://api-tradego.herokuapp.com/api/purchaseorder/getpurchaseorders`;
    }
    axios({
      method: "POST",
      responseType: "json",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: {
        CompanyId: user.CompanyId,
      },
    })
      .then((response) => {
        //console.log(response.data.success);
        if (response.data.success == 1) {
          initialPurchaseOrders = response.data.data.map((order) => {
            return {
              id: order.Purchase_OrderId,
              supplierName: order.SupplierName,
              purchasedDate: order.Date,
              totalUnits: order.Quantity,
              totalPrice: order.Total,
              pStatus: order.Status,
            };
          });
          this.setState({
            purchaseOrderList: initialPurchaseOrders,
          });
        } else {
          this.setState({
            purchaseOrderList: [],
          });
        }
      })
      .catch((error) => {
        this.setState({ errorMessage: error.response.data.message });
      });

    //Supplier API
    axios({
      method: "POST",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/supplier/getsuppliers`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: {
        CompanyId: user.CompanyId,
      },
    })
      .then((response) => {
        //console.log(response.data.success);
        if (response.data.success == 1) {
          initialSuppliers = response.data.data.map((supplier) => {
            return {
              id: supplier.SupplierId,
              suppliername: supplier.SupplierName,
            };
          });
          this.setState({
            suppliersList: [
              { id: "", suppliername: "Please select supplier" },
            ].concat(initialSuppliers),
          });
        } else {
          this.setState({
            suppliersList: [],
          });
        }
      })
      .catch((error) => {
        console.log("Error:" + error);
        this.setState({ errorMessage: error.response.data.message });
      });
  }

  ChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  submitHandler = (e) => {
    e.preventDefault();
    this.componentDidMount();
  };

  reset = () => {
    this.setState({
      filterSupplierId: "",
      filterOrderId: "",
    });
  };

  handleChange = (date) => {
    this.setState({
      filterDate: date,
    });
  };

  //Delete API
  deleteOrder(purchase_orderid) {
    axios({
      method: "DELETE",
      responseType: "json",
      url: `https://api-tradego.herokuapp.com/api/purchaseorder/deletepurchaseorder?purchase_orderid=${purchase_orderid}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        console.log("Response" + response.data);
        if (response.data.success === 0) {
          this.setState({ errorMessage: response.data.message });
        } else {
          window.location.href = "/getPurchaseOrders";
          this.setState({ successMsg: response.data.message });
        }
      })
      .catch((error) => {
        console.log("Error" + error);
        this.setState({ errorMessage: error.response.data.message });
      });
  }
  //Start render Function
  render() {
    function myFunction() {
      var x = document.getElementById("purchaseOrdersFilter");
      if (x.style.display === "none") {
        x.style.display = "flex";
      } else {
        x.style.display = "none";
      }
    }
    return (
      <div class="container-fluid  pt-5 mt-3">
        <div class="row">
          <DashboardSidebar />
          <div class="col-md-9 ml-sm-auto col-lg-10 px-4">
            <div class="headings">
              <div class="float-left">
                <h3 class="text-primary">Purchase Orders</h3>
              </div>
              <div class="float-right">
                <NavLink to="/createPurchaseOrder" className="btn btn-primary">
                  Create Purchase Order
                </NavLink>
              </div>
            </div>
            <form
              method="post"
              name="register"
              class="formClass"
              onSubmit={this.submitHandler}
            >
              <div class="float-right">
                <button class="btn btn-primary" onClick={myFunction}>
                  Display/Hide Filter
                </button>
                &nbsp;&nbsp;
                <button class="btn btn-primary" onClick={this.reset}>
                  Reset
                </button>
              </div>
              <br />
              <br />
              <br />
              <br />
              <div id="purchaseOrdersFilter" class="row register-form">
                <div class="col-md-3">
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control input-lg"
                      name="filterOrderId"
                      value={this.state.filterOrderId}
                      onChange={(e) => this.ChangeHandler(e)}
                      placeholder="Purchase Order #"
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-group">
                    <select
                      name="filterSupplierId"
                      class="form-control"
                      value={this.state.filterSupplierId}
                      onChange={(e) =>
                        this.setState({
                          filterSupplierId: e.target.value,
                          errorMessage:
                            e.target.value === ""
                              ? "You must select supplier"
                              : "",
                        })
                      }
                    >
                      {this.state.suppliersList.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.suppliername}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div class="col-md-3">
                  <input
                    type="submit"
                    class="btn btn-primary mb-2"
                    value="Execute"
                  />
                </div>
              </div>
            </form>

            {this.state.successMsg && (
              <p className="alert alert alert-success">
                {" "}
                {this.state.successMsg}
              </p>
            )}
            <div class="table-wrapper-scroll-y my-custom-scrollbar">
              <table class="table table-bordered table-striped mb-0">
                <thead>
                  <tr>
                    <th scope="col">Purchase Order Id</th>
                    <th scope="col">Supplier</th>
                    <th scope="col">Date</th>
                    <th scope="col">Total Units</th>
                    <th scope="col">Total Price</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.purchaseOrderList.map((order) => (
                    <tr>
                      <td>
                        <NavLink
                          to={`/changeStatus?purchaseOrderId=${order.id}`}
                        >
                          #{order.id}
                        </NavLink>
                      </td>
                      <td>{order.supplierName}</td>
                      <td>{order.purchasedDate}</td>
                      <td>{order.totalUnits}</td>
                      <td>${order.totalPrice}</td>
                      <td>{order.pStatus}</td>
                      <td width="17%">
                        <NavLink
                          to={`/updatePurchaseOrder?purchase_ord_Id=${order.id}`}
                        >
                          <img
                            src="https://img.icons8.com/bubbles/50/000000/edit.png"
                            title="Update Purchase Order"
                          />
                        </NavLink>{" "}
                        |{" "}
                        <a
                          onClick={() => {
                            if (
                              window.confirm(
                                "DO you want to delete " +
                                  order.id +
                                  " purchase order ?"
                              )
                            ) {
                              let removeToCollection = this.deleteOrder.bind(
                                this,
                                order.id
                              );
                              removeToCollection();
                            }
                          }}
                        >
                          <img
                            src="https://img.icons8.com/bubbles/50/000000/delete-sign.png"
                            title="Delete Purchase Order"
                          />
                        </a>
                      </td>
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
}
//End render Function

export default getPurchaseOrders;
