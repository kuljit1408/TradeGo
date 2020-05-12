import React, { Component } from "react";
import DashboardSidebar from "../../components/Dashboard/dashboardSidebar";
import { getUser } from "../Utils/common";
import { getToken } from "../Utils/common";
import { NavLink } from "react-router-dom";
import axios from "axios";

/* Get User and Token From Session */
const user = getUser();
const token = getToken();

class purchaseOrdersDelivery extends Component {
  //Set state values
  state = {
    deliveriesList: [],
    suppliersList: [],
    deliveryStatus: "",
    deliveryId: "",
    supplier: "",
    errorMessage: "",
    successMsg: "",
  };

  //Get all Supplier API and deliveries
  componentDidMount() {
    let initialDeliveries = [];
    let initialSuppliers = [];

    let url = "";
    if (
      this.state.deliveryStatus ||
      this.state.deliveryId ||
      this.state.supplier
    ) {
      url =
        `https://api-tradego.herokuapp.com/api/delivery/getdeliveries?Status=` +
        this.state.deliveryStatus +
        "&&SupplierName=" +
        this.state.supplier +
        "&&DeliveryId=" +
        this.state.deliveryId;
    } else {
      url = `https://api-tradego.herokuapp.com/api/delivery/getdeliveries`;
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
          initialDeliveries = response.data.data.map((delivery) => {
            //console.log(product.SupplierId);
            return {
              id: delivery.DeliveryId,
              supplierName: delivery.SupplierName,
              date: delivery.DeliveryDate,
              totalUnits: delivery.TotalUnit,
              totalPrice: delivery.Total,
              status: delivery.Status,
            };
          });
          this.setState({
            deliveriesList: initialDeliveries,
          });
        } else {
          this.setState({
            deliveriesList: [],
          });
        }
      })
      .catch((error) => {
        console.log("Error:" + error);
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
        console.log(response.data.success);
        if (response.data.success == 1) {
          initialSuppliers = response.data.data.map((supplier) => {
            return {
              id: supplier.SupplierId,
              suppliername: supplier.SupplierName,
            };
          });
          this.setState({
            suppliersList: [{ id: "", suppliername: "Select supplier" }].concat(
              initialSuppliers
            ),
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
      deliveryStatus: "",
      deliveryId: "",
      supplier: "",
    });
  };

  //Start render Function
  render() {
    function myFunction() {
      var x = document.getElementById("deliveryFilter");
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
                <h3 class="text-primary">Deliveries</h3>
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
              <div id="deliveryFilter" class="row register-form">
                <div class="col-md-3">
                  <div class="form-group">
                    <select
                      class="form-control"
                      name="deliveryStatus"
                      value={this.state.deliveryStatus}
                      onChange={(e) =>
                        this.setState({
                          deliveryStatus: e.target.value,
                          errorMessage:
                            e.target.value === ""
                              ? "You must select status"
                              : "",
                        })
                      }
                    >
                      <option value="Delivery Status">Delivery Status</option>
                      <option value="Received">Received</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control input-lg"
                      name="deliveryId"
                      value={this.state.deliveryId}
                      onChange={(e) => this.ChangeHandler(e)}
                      placeholder="Delivery #"
                    />
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="form-group">
                    <select
                      name="supplier"
                      class="form-control"
                      value={this.state.supplier}
                      onChange={(e) =>
                        this.setState({
                          supplier: e.target.value,
                          errorMessage:
                            e.target.value === ""
                              ? "You must select supplier"
                              : "",
                        })
                      }
                    >
                      {this.state.suppliersList.map((supplier) => (
                        <option key={supplier.id} value={supplier.suppliername}>
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
                    <th scope="col">Delivery Id</th>
                    <th scope="col">Supplier</th>
                    <th scope="col">Date</th>
                    <th scope="col">Total Units</th>
                    <th scope="col">Total</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.deliveriesList.map((delivery) => (
                    <tr>
                      <td>
                        <NavLink to={`/viewdelivery?DeliveryId=${delivery.id}`}>
                          #{delivery.id}
                        </NavLink>
                      </td>
                      <td>{delivery.supplierName}</td>
                      <td>{delivery.date ? delivery.date : "N/A"}</td>
                      <td>{delivery.totalUnits}</td>
                      <td>${delivery.totalPrice}</td>
                      <td>{delivery.status}</td>
                      <td>
                        <img
                          src="https://img.icons8.com/bubbles/50/000000/edit.png"
                          title="Update Delivery"
                        />
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
  //End render Function
}

export default purchaseOrdersDelivery;
